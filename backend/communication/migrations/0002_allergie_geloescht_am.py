from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("communication", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="allergie",
            name="geloescht_am",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
