from django.http import Http404
from django.contrib.auth.models import AnonymousUser
from .models import Organization


class OrganizationMiddleware:
    """Middleware to add organization context to requests"""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Add organization to request context
        request.organization = None
        
        # Get organization from slug in URL or headers
        org_slug = None
        
        # Check URL path for organization slug
        path_parts = request.path.split('/')
        if len(path_parts) > 1 and path_parts[1] != 'admin' and path_parts[1] != 'graphql':
            org_slug = path_parts[1]
        
        # Check headers for organization slug
        if not org_slug and 'HTTP_X_ORGANIZATION_SLUG' in request.META:
            org_slug = request.META['HTTP_X_ORGANIZATION_SLUG']
        
        # Set organization if slug is provided
        if org_slug:
            try:
                organization = Organization.objects.get(slug=org_slug)
                
                # Check if user has access to this organization
                if isinstance(request.user, AnonymousUser):
                    request.organization = None
                elif organization.user_has_access(request.user):
                    request.organization = organization
                else:
                    # User doesn't have access to this organization
                    request.organization = None
            except Organization.DoesNotExist:
                request.organization = None
        
        response = self.get_response(request)
        return response


class OrganizationQuerySetMixin:
    """Mixin to filter querysets by organization"""
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by organization if available
        if hasattr(self.request, 'organization') and self.request.organization:
            if hasattr(queryset.model, 'organization'):
                queryset = queryset.filter(organization=self.request.organization)
            elif hasattr(queryset.model, 'project'):
                queryset = queryset.filter(project__organization=self.request.organization)
        
        return queryset


class OrganizationPermissionMixin:
    """Mixin to check organization permissions"""
    
    def check_organization_permission(self, obj):
        """Check if user has permission to access the object"""
        if not hasattr(self.request, 'organization') or not self.request.organization:
            return False
        
        if hasattr(obj, 'organization'):
            return obj.organization == self.request.organization
        elif hasattr(obj, 'project'):
            return obj.project.organization == self.request.organization
        
        return False