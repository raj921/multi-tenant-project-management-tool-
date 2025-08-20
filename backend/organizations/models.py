from django.db import models
from django.contrib.auth.models import User
from django.db.models import Case, When, IntegerField


class OrganizationManager(models.Manager):
    """Manager for Organization model with multi-tenancy support and performance optimizations"""
    
    def get_queryset(self):
        return super().get_queryset().select_related('owner')
    
    def for_user(self, user):
        """Return organizations that the user has access to with optimized query"""
        if user.is_superuser:
            return self.get_queryset()
        return self.get_queryset().filter(
            models.Q(owner=user) | models.Q(members=user)
        ).distinct().select_related('owner')
    
    def search(self, query, user=None):
        """Full-text search on organizations with performance optimization"""
        if user and not user.is_superuser:
            user_orgs = self.for_user(user)
            return user_orgs.filter(
                models.Q(name__icontains=query) |
                models.Q(slug__icontains=query) |
                models.Q(contact_email__icontains=query)
            ).select_related('owner')
        
        return self.get_queryset().filter(
            models.Q(name__icontains=query) |
            models.Q(slug__icontains=query) |
            models.Q(contact_email__icontains=query)
        ).select_related('owner')
    
    def with_stats(self, user=None):
        """Return organizations with project and task statistics"""
        if user and not user.is_superuser:
            user_orgs = self.for_user(user)
            return user_orgs.annotate(
                project_count=models.Count('projects', distinct=True),
                total_tasks=models.Count('projects__tasks', distinct=True),
                completed_tasks=models.Count(
                    models.Case(
                        models.When(projects__tasks__status='DONE', then=1),
                        output_field=models.IntegerField(),
                    ),
                    distinct=True
                ),
            ).select_related('owner')
        
        return self.get_queryset().annotate(
            project_count=models.Count('projects', distinct=True),
            total_tasks=models.Count('projects__tasks', distinct=True),
            completed_tasks=models.Count(
                models.Case(
                    models.When(projects__tasks__status='DONE', then=1),
                    output_field=models.IntegerField(),
                ),
                distinct=True
            ),
        ).select_related('owner')


class Organization(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    contact_email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_organizations')
    members = models.ManyToManyField(User, related_name='organizations', blank=True)

    objects = OrganizationManager()

    class Meta:
        ordering = ['name']
        verbose_name = 'Organization'
        verbose_name_plural = 'Organizations'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self.name.lower().replace(' ', '-').replace('_', '-')
        super().save(*args, **kwargs)

    def user_has_access(self, user):
        """Check if user has access to this organization"""
        return user.is_superuser or self.owner == user or self.members.filter(id=user.id).exists()