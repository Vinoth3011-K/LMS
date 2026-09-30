

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('category', models.CharField(max_length=100)),
                ('thumbnail', models.ImageField(blank=True, null=True, upload_to='thumbnails/')),
                ('difficulty_level', models.CharField(choices=[('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('advanced', 'Advanced')], default='beginner', max_length=20)),
                ('duration', models.IntegerField(default=0, help_text='Duration in minutes')),
                ('price', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('status', models.CharField(choices=[('Draft', 'Draft'), ('Published', 'Published')], default='Draft', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('instructor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='courses', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Certificate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('certificate_number', models.CharField(max_length=100, unique=True)),
                ('issued_date', models.DateTimeField(auto_now_add=True)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lms_core.course')),
            ],
        ),
        migrations.CreateModel(
            name='Module',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('order_number', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='modules', to='lms_core.course')),
            ],
            options={
                'ordering': ['order_number'],
            },
        ),
        migrations.CreateModel(
            name='Lesson',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('video_url', models.URLField(blank=True, null=True)),
                ('notes', models.TextField(blank=True, null=True)),
                ('duration', models.IntegerField(default=0, help_text='Duration in minutes')),
                ('order_number', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('module', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lessons', to='lms_core.module')),
            ],
            options={
                'ordering': ['order_number'],
            },
        ),
        migrations.CreateModel(
            name='Quiz',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('passing_marks', models.IntegerField(default=50)),
                ('total_marks', models.IntegerField(default=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='quizzes', to='lms_core.course')),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question_text', models.TextField()),
                ('option_a', models.CharField(max_length=255)),
                ('option_b', models.CharField(max_length=255)),
                ('option_c', models.CharField(max_length=255)),
                ('option_d', models.CharField(max_length=255)),
                ('correct_answer', models.CharField(choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D')], max_length=1)),
                ('marks', models.IntegerField(default=1)),
                ('quiz', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='questions', to='lms_core.quiz')),
            ],
        ),
        migrations.CreateModel(
            name='QuizAttempt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.IntegerField(default=0)),
                ('total_marks', models.IntegerField(default=0)),
                ('percentage', models.FloatField(default=0.0)),
                ('passed', models.BooleanField(default=False)),
                ('attempted_at', models.DateTimeField(auto_now_add=True)),
                ('quiz', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attempts', to='lms_core.quiz')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='quiz_attempts', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='StudentAnswer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('selected_answer', models.CharField(max_length=1)),
                ('is_correct', models.BooleanField(default=False)),
                ('attempt', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers', to='lms_core.quizattempt')),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lms_core.question')),
            ],
        ),
        migrations.CreateModel(
            name='Enrollment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('enrolled_date', models.DateTimeField(auto_now_add=True)),
                ('completion_percentage', models.FloatField(default=0.0)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='enrollments', to='lms_core.course')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='enrollments', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('student', 'course')},
            },
        ),
        migrations.CreateModel(
            name='Progress',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('completed', models.BooleanField(default=False)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('lesson', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='progress', to='lms_core.lesson')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='progress', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('student', 'lesson')},
            },
        ),
    ]
