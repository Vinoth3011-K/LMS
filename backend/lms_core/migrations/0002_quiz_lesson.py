import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lms_core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='quiz',
            name='lesson',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='quiz', to='lms_core.lesson'),
        ),
    ]
