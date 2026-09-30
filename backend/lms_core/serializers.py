from rest_framework import serializers
from .models import Course, Module, Lesson, Enrollment, Quiz, Question, QuizAttempt, Certificate, StudentAnswer

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    class Meta:
        model = Quiz
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    quiz_id = serializers.PrimaryKeyRelatedField(source='quiz', read_only=True)
    class Meta:
        model = Lesson
        fields = '__all__'

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    class Meta:
        model = Module
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    quizzes = QuizSerializer(many=True, read_only=True)
    instructor_name = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ('instructor', 'created_at')

    def get_instructor_name(self, obj):
        return obj.instructor.name if obj.instructor else "Unknown Instructor"

    def get_thumbnail_url(self, obj):
        request = self.context.get('request')
        if obj.thumbnail:
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
            
       
        from .models import Lesson
        import re
        first_video = Lesson.objects.filter(module__course=obj).exclude(video_url__isnull=True).exclude(video_url__exact='').first()
        if first_video:
            match = re.search(r'(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|/|$)', first_video.video_url)
            if match:
                yt_id = match.group(1)
                return f"https://img.youtube.com/vi/{yt_id}/maxresdefault.jpg"
        
        return None

class EnrollmentSerializer(serializers.ModelSerializer):
    course_details = CourseSerializer(source='course', read_only=True)
    class Meta:
        model = Enrollment
        fields = '__all__'
        read_only_fields = ('student', 'enrolled_date', 'completion_percentage')

class StudentAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAnswer
        fields = '__all__'

class QuizAttemptSerializer(serializers.ModelSerializer):
    answers = StudentAnswerSerializer(many=True, read_only=True)
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    course_title = serializers.CharField(source='quiz.course.title', read_only=True)
    class Meta:
        model = QuizAttempt
        fields = '__all__'
        read_only_fields = ('student', 'attempted_at', 'score', 'total_marks', 'percentage', 'passed')

class CertificateSerializer(serializers.ModelSerializer):
    course_title = serializers.SerializerMethodField()
    student_name = serializers.SerializerMethodField()
    certificate_id = serializers.UUIDField(source='certificate_number', read_only=True)
    thumbnail_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Certificate
        fields = '__all__'

    def get_course_title(self, obj):
        return obj.course.title if obj.course else ""

    def get_student_name(self, obj):
        return obj.student.name if obj.student else ""

    def get_thumbnail_url(self, obj):
        request = self.context.get('request')
       
        if obj.course:
            return CourseSerializer(obj.course, context={'request': request}).data.get('thumbnail_url')
        return None
