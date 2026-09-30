from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (CourseViewSet, ModuleViewSet, LessonViewSet, 
                    EnrollmentViewSet, QuizViewSet, QuestionViewSet,
                    QuizAttemptViewSet, CertificateViewSet, MyCoursesView,
                    MyProgressView, MyResultsView,
                    AdminAnalyticsView, InstructorAnalyticsView, StudentAnalyticsView)

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'my-courses', MyCoursesView, basename='my-courses')
router.register(r'my-progress', MyProgressView, basename='my-progress')
router.register(r'my-results', MyResultsView, basename='my-results')
router.register(r'modules', ModuleViewSet)
router.register(r'lessons', LessonViewSet)
router.register(r'enrollments', EnrollmentViewSet)
router.register(r'quizzes', QuizViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'quiz-attempts', QuizAttemptViewSet)
router.register(r'certificates', CertificateViewSet)

urlpatterns = [
    path('admin/analytics/', AdminAnalyticsView.as_view(), name='admin-analytics'),
    path('instructor/analytics/', InstructorAnalyticsView.as_view(), name='instructor-analytics'),
    path('student/analytics/', StudentAnalyticsView.as_view(), name='student-analytics'),
    path('', include(router.urls)),
]
