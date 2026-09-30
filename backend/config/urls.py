from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static

def home(request):
    return JsonResponse({
        "message": "LMS Backend API Running Successfully",
        "status": "OK"
    })

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/', include('lms_core.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
