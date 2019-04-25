from django.contrib import admin
from qsub import models

# Register your models here.

admin.site.register(models.QuestionSet)
admin.site.register(models.Distribution)
admin.site.register(models.DistributionEntry)
admin.site.register(models.TieBreakDistributionEntry)
