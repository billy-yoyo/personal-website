"""
URL configuration for personal_website project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from personal_website import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home),
    path('toys/planet/', views.planet),
    path('toys/qshade-gas/', views.qshade_gas),
    path('toys/qshade-droopy/', views.qshade_droopy),
    path('toys/erosion/', views.erosion),
    path('toys/ecs-gas/', views.ecs),
    path('articles/music-platform/', views.music_platform),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
