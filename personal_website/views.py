from django.shortcuts import render
from .templatetags import *

def home(request):
    return render(request, "home.html")

def planet(request):
    return render(request, "toys/planet.html", { "source": "https://github.com/billy-yoyo/Planet-Ray-Tracer" })

def qshade_gas(request):
    return render(request, "toys/qshade_gas.html", { "source": "https://github.com/billy-yoyo/qshade" })

def qshade_droopy(request):
    return render(request, "toys/qshade_droopy.html", { "source": "https://github.com/billy-yoyo/qshade" })

def erosion(request):
    return render(request, "toys/erosion.html", { "source": "https://github.com/billy-yoyo/Erosion" })

def ecs(request):
    return render(request, "toys/ecs.html", { "source": "https://github.com/billy-yoyo/ECS" })

def music_platform(request):
    return render(request, "articles/music_platform.html")
