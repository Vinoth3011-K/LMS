import uuid
from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Course(models.Model):
    class Difficulty(models.TextChoices):
        BEGINNER = 'beginner', 'Beginner'
        INTERMEDIATE = 'intermediate', 'Intermediate'
        ADVANCED = 'advanced', 'Advanced'

    class Status(models.TextChoices):
        DRAFT = 'Draft', 'Draft'
        PUBLISHED = 'Published', 'Published'
        
    instructor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses')
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100)
    thumbnail = models.ImageField(upload_to='thumbnails/', null=True, blank=True)
    difficulty_level = models.CharField(max_length=20, choices=Difficulty.choices, default=Difficulty.BEGINNER)
    duration = models.IntegerField(help_text="Duration in minutes", default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    order_number = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order_number']

    def __str__(self):
        return f"{self.course.title} - {self.title}"

class Lesson(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    duration = models.IntegerField(help_text="Duration in minutes", default=0)
    order_number = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order_number']

    def __str__(self):
        return self.title

class Enrollment(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_date = models.DateTimeField(auto_now_add=True)
    completion_percentage = models.FloatField(default=0.0)

    class Meta:
        unique_together = ('student', 'course')

class Progress(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='progress')
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('student', 'lesson')

class Quiz(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='quizzes')
    lesson = models.OneToOneField(Lesson, on_delete=models.CASCADE, related_name='quiz', null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    passing_marks = models.IntegerField(default=50)
    total_marks = models.IntegerField(default=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Question(models.Model):
    class Answer(models.TextChoices):
        A = 'A', 'A'
        B = 'B', 'B'
        C = 'C', 'C'
        D = 'D', 'D'

    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)
    correct_answer = models.CharField(max_length=1, choices=Answer.choices)
    marks = models.IntegerField(default=1)

    def __str__(self):
        return self.question_text

class QuizAttempt(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quiz_attempts')
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    score = models.IntegerField(default=0)
    total_marks = models.IntegerField(default=0)
    percentage = models.FloatField(default=0.0)
    passed = models.BooleanField(default=False)
    attempted_at = models.DateTimeField(auto_now_add=True)

class StudentAnswer(models.Model):
    attempt = models.ForeignKey(QuizAttempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_answer = models.CharField(max_length=1)
    is_correct = models.BooleanField(default=False)

class Certificate(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    certificate_number = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    issued_date = models.DateTimeField(auto_now_add=True)
