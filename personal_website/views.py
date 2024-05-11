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

def e_lab_notebook(request):
    return render(request, "articles/e_lab_notebook.html")

def euphoria_draft(request):
    return render(request, "articles/euphoria_draft.html")

def camel_game(request):
    return render(request, "articles/camel_game.html")

def dicegame(request):
    return render(request, "dicegame/index.html")
