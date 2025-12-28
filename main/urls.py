from django.urls import path
from . import views

app_name = 'main'

urlpatterns = [
    path('', views.index, name='index'),
    path('messages/', views.messages_view, name='messages_view'),
    path('api/about/', views.about, name='about'),
    path('api/skills/', views.skills, name='skills'),
    path('api/projects/', views.projects, name='projects'),
    path('api/experience/', views.experience, name='experience'),
]