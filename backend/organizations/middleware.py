from django.http import Http404
from django.contrib.auth.models import AnonymousUser
from .models import Organization

class OrganizationMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.organization = None
        org_slug = None
        path_parts = request.path.split('/')
        if len(path_parts) > 1 and path_parts[1] != 'admin' and (path_parts[1] != 'graphql'):
            org_slug = path_parts[1]
        if not org_slug and 'HTTP_X_ORGANIZATION_SLUG' in request.META:
            org_slug = request.META['HTTP_X_ORGANIZATION_SLUG']
        if org_slug:
            try:
                organization = Organization.objects.get(slug=org_slug)
                if isinstance(request.user, AnonymousUser):
                    request.organization = None
                elif organization.user_has_access(request.user):
                    request.organization = organization
                else:
                    request.organization = None
            except Organization.DoesNotExist:
                request.organization = None
        response = self.get_response(request)
        return response

class OrganizationQuerySetMixin:

    def get_queryset(self):
        queryset = super().get_queryset()
        if hasattr(self.request, 'organization') and self.request.organization:
            if hasattr(queryset.model, 'organization'):
                queryset = queryset.filter(organization=self.request.organization)
            elif hasattr(queryset.model, 'project'):
                queryset = queryset.filter(project__organization=self.request.organization)
        return queryset

class OrganizationPermissionMixin:

    def check_organization_permission(self, obj):
        if not hasattr(self.request, 'organization') or not self.request.organization:
            return False
        if hasattr(obj, 'organization'):
            return obj.organization == self.request.organization
        elif hasattr(obj, 'project'):
            return obj.project.organization == self.request.organization
        return False