from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import ProjectLead
from .serializers import ProjectLeadSerializer

SERVICE_BASE = {
    'web_app': {'cost': 3000, 'weeks': 4},
    'mobile_app': {'cost': 4500, 'weeks': 6},
    'ai_integration': {'cost': 4000, 'weeks': 5},
    'ui_ux_redesign': {'cost': 1800, 'weeks': 2},
}

FEATURE_WEIGHTS = {
    'auth': {'cost': 600, 'weeks': 1},
    'payments': {'cost': 900, 'weeks': 1},
    'admin_dashboard': {'cost': 1200, 'weeks': 2},
    'ai_chatbot': {'cost': 1500, 'weeks': 2},
    'analytics': {'cost': 800, 'weeks': 1},
    'api_integrations': {'cost': 700, 'weeks': 1},
}

URGENCY_MULTIPLIER = {
    'relaxed': {'cost': 0.9, 'weeks': 1.25},
    'standard': {'cost': 1.0, 'weeks': 1.0},
    'rush': {'cost': 1.3, 'weeks': 0.75},
}

@api_view(['POST'])
def calculate_estimate(request):
    service = request.data.get('service_type', 'web_app')
    features = request.data.get('selected_features', [])
    urgency = request.data.get('urgency', 'standard')

    base = SERVICE_BASE.get(service, SERVICE_BASE['web_app'])
    total_cost = base['cost']
    total_weeks = base['weeks']

    for feat in features:
        if feat in FEATURE_WEIGHTS:
            total_cost += FEATURE_WEIGHTS[feat]['cost']
            total_weeks += FEATURE_WEIGHTS[feat]['weeks']

    mult = URGENCY_MULTIPLIER.get(urgency, URGENCY_MULTIPLIER['standard'])
    final_cost = int(total_cost * mult['cost'])
    final_weeks = max(1, round(total_weeks * mult['weeks']))

    return Response({
        'estimated_min_cost': int(final_cost * 0.9),
        'estimated_max_cost': int(final_cost * 1.15),
        'estimated_weeks': final_weeks,
    })

@api_view(['GET', 'POST'])
def leads_list_create(request):
    if request.method == 'GET':
        leads = ProjectLead.objects.all()
        serializer = ProjectLeadSerializer(leads, many=True)
        total_pipeline = sum(l.estimated_max_cost for l in leads)
        return Response({
            'leads': serializer.data,
            'stats': {
                'total_leads': leads.count(),
                'total_pipeline_value': total_pipeline,
                'new_leads': leads.filter(status='NEW').count(),
            }
        })

    elif request.method == 'POST':
        serializer = ProjectLeadSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH', 'DELETE'])
def lead_detail(request, pk):
    try:
        lead = ProjectLead.objects.get(pk=pk)
    except ProjectLead.DoesNotExist:
        return Response({'error': 'Lead not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PATCH':
        serializer = ProjectLeadSerializer(lead, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        lead.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
