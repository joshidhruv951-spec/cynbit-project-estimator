from rest_framework import serializers
from .models import ProjectLead

class ProjectLeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectLead
        fields = '__all__'
        read_only_fields = ['id', 'created_at']
