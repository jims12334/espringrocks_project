# Generated migration to remove approval_status from User model

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_user_approval_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='approval_status',
        ),
    ]
