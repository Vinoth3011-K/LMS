import io
from django.http import HttpResponse
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.views import APIView

User = get_user_model()

from .models import Course, Module, Lesson, Enrollment, Quiz, Question, QuizAttempt, Certificate, Progress, StudentAnswer
from .serializers import (CourseSerializer, ModuleSerializer, LessonSerializer,
                          EnrollmentSerializer, QuizSerializer, QuestionSerializer,
                          QuizAttemptSerializer, CertificateSerializer)

class IsInstructor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'INSTRUCTOR' or request.user.role == 'ADMIN'

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'ADMIN'

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'enroll']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = self.queryset
        
      
        search = self.request.query_params.get('search', None)
        category = self.request.query_params.get('category', None)
        difficulty = self.request.query_params.get('difficulty', None)
        
        if search:
            queryset = queryset.filter(title__icontains=search)
        if category:
            queryset = queryset.filter(category__icontains=category)
        if difficulty:
            queryset = queryset.filter(difficulty_level=difficulty)

        if self.request.query_params.get('my_courses') == 'true':
            if self.request.user.role == 'ADMIN':
                return queryset
            return queryset.filter(instructor=self.request.user)

        if self.action == 'list':
            return queryset.filter(status='Published')
            
        return queryset

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)
        
    def perform_destroy(self, instance):
        if self.request.user.role != 'ADMIN' and instance.instructor != self.request.user:
            raise PermissionDenied("You do not have permission to delete this course.")
        instance.delete()

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def enroll(self, request, pk=None):
        course = self.get_object()
        student = request.user
        
        if student.role != 'STUDENT':
            return Response({'detail': 'Only students can enroll in courses.'}, status=status.HTTP_403_FORBIDDEN)
        
        
        if Enrollment.objects.filter(student=student, course=course).exists():
            return Response({'detail': 'Already enrolled in this course.'}, status=status.HTTP_400_BAD_REQUEST)
            
        enrollment = Enrollment.objects.create(student=student, course=course)
        return Response(EnrollmentSerializer(enrollment).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def progress(self, request, pk=None):
        course = self.get_object()
        student = request.user
        
        if not Enrollment.objects.filter(student=student, course=course).exists():
            return Response({'detail': 'Not enrolled in this course.'}, status=status.HTTP_403_FORBIDDEN)
            
        total_lessons = Lesson.objects.filter(module__course=course).count()
        completed_lessons = Progress.objects.filter(student=student, lesson__module__course=course, completed=True).count()
        progress_percentage = (completed_lessons / total_lessons * 100) if total_lessons > 0 else 0
        
        return Response({
            'course': course.title,
            'total_lessons': total_lessons,
            'completed_lessons': completed_lessons,
            'progress': round(progress_percentage, 2)
        })

class MyCoursesView(viewsets.ReadOnlyModelViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(student=self.request.user)

class ModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructor]

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsInstructor]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def retrieve(self, request, *args, **kwargs):
        lesson = self.get_object()
        user = request.user
        if user.role == 'STUDENT':
            if not Enrollment.objects.filter(student=user, course=lesson.module.course).exists():
                return Response({'detail': 'Not enrolled in this course.'}, status=status.HTTP_403_FORBIDDEN)
        return super().retrieve(request, *args, **kwargs)

    @action(detail=True, methods=['post', 'delete'], permission_classes=[permissions.IsAuthenticated])
    def complete(self, request, pk=None):
        lesson = self.get_object()
        user = request.user
        
        if not Enrollment.objects.filter(student=user, course=lesson.module.course).exists():
            return Response({'detail': 'Not enrolled in this course.'}, status=status.HTTP_403_FORBIDDEN)

        if request.method == 'POST':
            progress, created = Progress.objects.get_or_create(student=user, lesson=lesson)
            progress.completed = True
            progress.completed_at = timezone.now()
            progress.save()
            
          
            self._update_enrollment_progress(user, lesson.module.course)
            
            return Response({'detail': 'Lesson marked as completed.'}, status=status.HTTP_200_OK)
            
        elif request.method == 'DELETE':
            try:
                progress = Progress.objects.get(student=user, lesson=lesson)
                progress.completed = False
                progress.save()
                
              
                self._update_enrollment_progress(user, lesson.module.course)
                
                return Response({'detail': 'Lesson completion removed.'}, status=status.HTTP_200_OK)
            except Progress.DoesNotExist:
                return Response({'detail': 'Lesson not marked as completed yet.'}, status=status.HTTP_400_BAD_REQUEST)

    def _update_enrollment_progress(self, user, course):
        try:
            enrollment = Enrollment.objects.get(student=user, course=course)
            total_lessons = Lesson.objects.filter(module__course=course).count()
            completed_lessons = Progress.objects.filter(student=user, lesson__module__course=course, completed=True).count()
            if total_lessons > 0:
                enrollment.completion_percentage = (completed_lessons / total_lessons) * 100
                enrollment.save()
        except Enrollment.DoesNotExist:
            pass

class MyProgressView(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        enrollments = Enrollment.objects.filter(student=request.user).select_related('course')
        results = []
        for enrollment in enrollments:
            course = enrollment.course
            total_lessons = Lesson.objects.filter(module__course=course).count()
            completed_lessons = Progress.objects.filter(student=request.user, lesson__module__course=course, completed=True).count()
            remaining_lessons = total_lessons - completed_lessons
            results.append({
                'course_id': course.id,
                'course_title': course.title,
                'completion_percentage': enrollment.completion_percentage,
                'completed_lessons': completed_lessons,
                'remaining_lessons': remaining_lessons,
                'total_lessons': total_lessons
            })
        return Response(results)

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(student=self.request.user)

    def perform_create(self, serializer):
        if self.request.user.role != 'STUDENT':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only students can enroll in courses.')
        serializer.save(student=self.request.user)

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'attempts']:
            permission_classes = [permissions.IsAuthenticated, IsInstructor]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        if request.user.role == 'STUDENT':
            for q in data.get('questions', []):
                q.pop('correct_answer', None)
        return Response(data)

    @action(detail=True, methods=['get'])
    def start(self, request, pk=None):
        quiz = self.get_object()
      
        if not Enrollment.objects.filter(student=request.user, course=quiz.course).exists():
            return Response({'detail': 'Not enrolled in this course.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = QuizSerializer(quiz)
        data = serializer.data
        for q in data.get('questions', []):
            q.pop('correct_answer', None)
            
        return Response(data)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        quiz = self.get_object()
        student = request.user
        
        if not Enrollment.objects.filter(student=student, course=quiz.course).exists():
            return Response({'detail': 'Not enrolled in this course.'}, status=status.HTTP_403_FORBIDDEN)

        answers_data = request.data.get('answers', {})
        total_marks_obtained = 0
        total_quiz_marks = 0
        
        attempt = QuizAttempt.objects.create(student=student, quiz=quiz)
        
        for question in quiz.questions.all():
            total_quiz_marks += question.marks
            selected = answers_data.get(str(question.id))
            is_correct = (selected == question.correct_answer)
            if is_correct:
                total_marks_obtained += question.marks
                
            StudentAnswer.objects.create(
                attempt=attempt,
                question=question,
                selected_answer=selected or '',
                is_correct=is_correct
            )
            
        percentage = (total_marks_obtained / total_quiz_marks * 100) if total_quiz_marks > 0 else 0
        passed = (percentage >= quiz.passing_marks)
        
        attempt.score = total_marks_obtained
        attempt.total_marks = total_quiz_marks
        attempt.percentage = percentage
        attempt.passed = passed
        attempt.save()
        
        return Response(QuizAttemptSerializer(attempt).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def attempts(self, request, pk=None):
        quiz = self.get_object()
        attempts = QuizAttempt.objects.filter(quiz=quiz)
        return Response(QuizAttemptSerializer(attempts, many=True).data)

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructor]

class QuizAttemptViewSet(viewsets.ModelViewSet):
    queryset = QuizAttempt.objects.all()
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(student=self.request.user)

class MyResultsView(viewsets.ReadOnlyModelViewSet):
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return QuizAttempt.objects.filter(student=self.request.user).order_by('-attempted_at')

class CertificateViewSet(viewsets.ModelViewSet):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return self.queryset
        elif user.role == 'INSTRUCTOR':
            return self.queryset.filter(course__instructor=user)
        return self.queryset.filter(student=user)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsAdmin()]
        return super().get_permissions()

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def generate(self, request):
        course_id = request.data.get('course_id')
        user = request.user
        
        if not course_id:
            return Response({'detail': 'Course ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({'detail': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)
            
        try:
            enrollment = Enrollment.objects.get(student=user, course=course)
        except Enrollment.DoesNotExist:
            return Response({'detail': 'Not enrolled in this course.'}, status=status.HTTP_403_FORBIDDEN)
            
        if enrollment.completion_percentage < 100.0:
            return Response({'detail': 'Course not fully completed yet.'}, status=status.HTTP_400_BAD_REQUEST)
            
        quizzes = Quiz.objects.filter(course=course)
        for q in quizzes:
            passed = QuizAttempt.objects.filter(student=user, quiz=q, passed=True).exists()
            if not passed:
                return Response({'detail': f'Quiz "{q.title}" must be passed.'}, status=status.HTTP_400_BAD_REQUEST)
                
        certificate, created = Certificate.objects.get_or_create(student=user, course=course)
        return Response(CertificateSerializer(certificate).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def verify(self, request):
        cert_id = request.query_params.get('id')
        if not cert_id:
            return Response({'detail': 'Certificate ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            cert = Certificate.objects.get(certificate_number=cert_id)
            return Response({
                'valid': True,
                'student_name': cert.student.name,
                'course_title': cert.course.title,
                'issued_date': cert.issued_date,
                'certificate_number': cert.certificate_number
            })
        except Certificate.DoesNotExist:
            return Response({'valid': False, 'detail': 'Certificate not found.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def download(self, request, pk=None):
        try:
            try:
                cert = self.get_object()
            except Exception:
                return Response({'detail': 'Certificate not found.'}, status=status.HTTP_404_NOT_FOUND)
            
            try:
                from reportlab.pdfgen import canvas
                from reportlab.lib.pagesizes import letter, landscape
                from reportlab.lib.utils import ImageReader
            except ImportError:
                return Response({'detail': 'PDF generation library not installed.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            buffer = io.BytesIO()
            p = canvas.Canvas(buffer, pagesize=landscape(letter))
            
    
            width, height = landscape(letter)
            center_x = width / 2.0
            
           
            p.setStrokeColorRGB(0.8, 0.8, 0.8)
            p.setLineWidth(4)
            p.rect(20, 20, width-40, height-40)
            
          
            p.setStrokeColorRGB(0.1, 0.4, 0.8) 
            p.setLineWidth(2)
            p.rect(28, 28, width-56, height-56)
            
            image_buffer = None
            try:
                import requests
                from lms_core.serializers import CourseSerializer
                
             
                thumbnail_url = CourseSerializer(cert.course, context={'request': request}).data.get('thumbnail_url')
                
                if thumbnail_url:
                    resp = requests.get(thumbnail_url, timeout=5)
                    if resp.status_code == 200:
                        image_buffer = io.BytesIO(resp.content)
                    elif 'maxresdefault.jpg' in thumbnail_url:
                       
                        yt_thumb_fallback = thumbnail_url.replace('maxresdefault.jpg', 'hqdefault.jpg')
                        resp_fallback = requests.get(yt_thumb_fallback, timeout=5)
                        if resp_fallback.status_code == 200:
                            image_buffer = io.BytesIO(resp_fallback.content)
                
                if image_buffer:
                    from PIL import Image
                    try:
                        img_pil = Image.open(image_buffer)
                        if img_pil.mode != 'RGB':
                            if img_pil.mode == 'RGBA':
                                background = Image.new('RGB', img_pil.size, (255, 255, 255))
                                background.paste(img_pil, mask=img_pil.split()[3])
                                img_pil = background
                            else:
                                img_pil = img_pil.convert('RGB')
                        
                        safe_buffer = io.BytesIO()
                        img_pil.save(safe_buffer, format='JPEG', quality=95)
                        safe_buffer.seek(0)
                        
                        img = ImageReader(safe_buffer)
                        p.drawImage(img, center_x - 125, 420, width=250, height=140, preserveAspectRatio=True, anchor='c')
                    except Exception as pil_e:
                        print(f"PIL Image processing error: {pil_e}")
                        pass
            except Exception as e:
                print(f"Thumbnail rendering error: {e}")
                pass 
           
            p.setFillColorRGB(0.1, 0.1, 0.1)
            p.setFont("Helvetica-Bold", 40)
            p.drawCentredString(center_x, 380, "CERTIFICATE OF COMPLETION")
            
            p.setFillColorRGB(0.4, 0.4, 0.4)
            p.setFont("Times-Italic", 18)
            p.drawCentredString(center_x, 330, "This is to proudly certify that")
            
            
            student_name = str(getattr(cert.student, 'name', '')) or str(getattr(cert.student, 'first_name', '')) or 'Student'
            p.setFillColorRGB(0.1, 0.3, 0.7)
            p.setFont("Helvetica-Bold", 36)
            p.drawCentredString(center_x, 270, student_name)
            
            
            p.setStrokeColorRGB(0.8, 0.8, 0.8)
            p.setLineWidth(2)
            p.line(center_x - 200, 255, center_x + 200, 255)
            
        
            p.setFillColorRGB(0.4, 0.4, 0.4)
            p.setFont("Times-Italic", 18)
            p.drawCentredString(center_x, 215, "has successfully completed the course")
            
            
            course_title = str(getattr(cert.course, 'title', '')) or 'Course'
            p.setFillColorRGB(0.2, 0.2, 0.2)
            p.setFont("Helvetica-Bold", 28)
            p.drawCentredString(center_x, 170, course_title)
            
           
            bottom_y_line = 90
            bottom_y_text = 100
            bottom_y_label = 70
            
           
            issued_date_str = cert.issued_date.strftime('%B %d, %Y') if cert.issued_date else 'Unknown Date'
            p.setStrokeColorRGB(0.6, 0.6, 0.6)
            p.setLineWidth(1)
            p.line(100, bottom_y_line, 250, bottom_y_line)
            
            p.setFillColorRGB(0.2, 0.2, 0.2)
            p.setFont("Helvetica-Bold", 14)
            p.drawCentredString(175, bottom_y_text, issued_date_str)
            
            p.setFillColorRGB(0.5, 0.5, 0.5)
            p.setFont("Helvetica-Bold", 10)
            p.drawCentredString(175, bottom_y_label, "DATE")
            
        
            p.setFillColorRGB(0.4, 0.4, 0.4)
            p.setFont("Courier", 10)
            p.drawCentredString(center_x, bottom_y_line, f"ID: {cert.certificate_number}")
            
          
            p.setStrokeColorRGB(0.6, 0.6, 0.6)
            p.setLineWidth(1)
            p.line(width - 250, bottom_y_line, width - 100, bottom_y_line)
            
            p.setFillColorRGB(0.2, 0.2, 0.2)
            p.setFont("Times-Italic", 24)
            p.drawCentredString(width - 175, bottom_y_text, "Instructor")
            
            p.setFillColorRGB(0.5, 0.5, 0.5)
            p.setFont("Helvetica-Bold", 10)
            p.drawCentredString(width - 175, bottom_y_label, "SIGNATURE")
            
            p.showPage()
            p.save()
            
            buffer.seek(0)
            response = HttpResponse(buffer, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="certificate_{cert.certificate_number}.pdf"'
            return response
        except Exception as e:
            return Response({'detail': f'Error generating PDF: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AdminAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    def get(self, request):
        enrollments = Enrollment.objects.order_by('-enrolled_date')[:5]
        recent_activities = [
            {"action": f"New enrollment in {e.course.title} by {e.student.name}", "date": e.enrolled_date} for e in enrollments
        ]
        
        return Response({
            "total_users": User.objects.count(),
            "students": User.objects.filter(role='STUDENT').count(),
            "instructors": User.objects.filter(role='INSTRUCTOR').count(),
            "courses": Course.objects.count(),
            "published_courses": Course.objects.filter(status='Published').count(),
            "draft_courses": Course.objects.filter(status='Draft').count(),
            "certificates": Certificate.objects.count(),
            "enrollments": Enrollment.objects.count(),
            "quiz_attempts": QuizAttempt.objects.count(),
            "recent_activities": recent_activities
        })

class InstructorAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInstructor]
    def get(self, request):
        courses = Course.objects.filter(instructor=request.user)
        total_students = Enrollment.objects.filter(course__in=courses).count()
        published = courses.filter(status='Published').count()
        certificates = Certificate.objects.filter(course__in=courses).count()
        return Response({
            "total_courses": courses.count(),
            "published_courses": published,
            "total_students": total_students,
            "certificates": certificates
        })

class StudentAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        enrollments = Enrollment.objects.filter(student=request.user)
        completed_courses = enrollments.filter(completion_percentage__gte=100.0).count()
        return Response({
            "enrolled_courses": enrollments.count(),
            "completed_courses": completed_courses,
            "certificates": Certificate.objects.filter(student=request.user).count(),
            "quiz_attempts": QuizAttempt.objects.filter(student=request.user).count()
        })
