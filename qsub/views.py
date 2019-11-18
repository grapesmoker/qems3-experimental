import json

from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, JsonResponse

# Create your views here.


@ensure_csrf_cookie
def index(request):

    return render(request, 'index.html')


@csrf_exempt
def webapp_login(request):

    import ipdb
    ipdb.set_trace()
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

    return HttpResponse({'status': 'OK'})