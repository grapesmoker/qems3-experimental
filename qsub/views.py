import json

from django.conf import settings
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, JsonResponse
from django.dispatch import receiver
from django.db.models.signals import post_save

from rest_framework.authtoken.models import Token


@ensure_csrf_cookie
def index(request):

    return render(request, 'index.html')


@csrf_exempt
def webapp_login(request):

    try:
        post_data = json.loads(request.body)
    except ValueError:
        return HttpResponseBadRequest()

    if 'username' not in post_data or 'password' not in post_data:
        return HttpResponseBadRequest()

    print(post_data)
    user_name = post_data.get('username')
    password = post_data.get('password')

    user = authenticate(username=user_name, password=password)

    if not user:
        return HttpResponseForbidden()

    login(request, user)

    return JsonResponse(data={'status': 'OK', 'token': str(Token.objects.get(user=user))})


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
