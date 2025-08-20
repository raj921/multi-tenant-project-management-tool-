from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from .health_check import health_check
urlpatterns = [path('admin/', admin.site.urls), path('health/', health_check, name='health_check'), path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True)))]