from django.conf.urls import url
from rest_framework_extensions.routers import ExtendedSimpleRouter

from qsub.api import views as api_views
from qsub import views as app_views

app_name = 'qsub'

router = ExtendedSimpleRouter()

question_set_router = router.register(
    r'api/question_sets',
    api_views.QuestionSetViewSet,
    basename='question_sets')

distribution_router = router.register(
    r'api/distributions',
    api_views.DistributionViewSet,
    basename='distributions'
)

categories_router = router.register(
    r'api/categories',
    api_views.CategoryViewSet,
    basename='categories'
)

urlpatterns = router.urls + [
    url(r'webapp_login/$', app_views.webapp_login, name='login'),
    url(r'user/', app_views.user_profile, name='user')
]