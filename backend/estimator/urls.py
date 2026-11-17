from django.urls import path
from . import views

urlpatterns = [
    path('estimate/calculate/', views.calculate_estimate, name='calculate_estimate'),
    path('leads/', views.leads_list_create, name='leads_list_create'),
    path('leads/<int:pk>/', views.lead_detail, name='lead_detail'),
]
