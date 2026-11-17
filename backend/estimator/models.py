from django.db import models

class ProjectLead(models.Model):
    STATUS_CHOICES = [
        ('NEW', 'New Lead'),
        ('CONTACTED', 'Contacted'),
        ('PROPOSAL_SENT', 'Proposal Sent'),
        ('CLOSED', 'Closed Won'),
    ]

    client_name = models.CharField(max_length=120)
    client_email = models.EmailField()
    company_name = models.CharField(max_length=120, blank=True)
    service_type = models.CharField(max_length=50)
    selected_features = models.JSONField(default=list)
    urgency = models.CharField(max_length=30, default='standard')
    estimated_min_cost = models.IntegerField()
    estimated_max_cost = models.IntegerField()
    estimated_weeks = models.IntegerField()
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='NEW')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.client_name} - {self.service_type}"
