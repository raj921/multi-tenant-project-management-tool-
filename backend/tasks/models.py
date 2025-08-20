from django.db import models
from django.contrib.auth.models import User
from django.db.models import Case, When, IntegerField, Count, Q
from django.utils import timezone
from datetime import timedelta
from projects.models import Project


class TaskManager(models.Manager):
    """Manager for Task model with multi-tenancy support and performance optimizations"""
    
    def get_queryset(self):
        return super().get_queryset().select_related('project', 'project__organization', 'created_by').prefetch_related('comments')
    
    def for_organization(self, organization):
        """Return tasks for a specific organization with optimized query"""
        return self.get_queryset().filter(project__organization=organization).select_related('project', 'project__organization', 'created_by')
    
    def for_project(self, project):
        """Return tasks for a specific project with optimized query"""
        return self.get_queryset().filter(project=project).select_related('project', 'created_by').prefetch_related('comments')
    
    def for_user(self, user):
        """Return tasks that the user has access to with optimized query"""
        if user.is_superuser:
            return self.get_queryset()
        
        # Get projects the user has access to
        user_projects = Project.objects.for_user(user)
        return self.get_queryset().filter(project__in=user_projects).select_related('project', 'project__organization', 'created_by')
    
    def by_status(self, status, user=None):
        """Filter tasks by status with optimized query"""
        base_qs = self.get_queryset()
        
        if user and not user.is_superuser:
            user_projects = Project.objects.for_user(user)
            base_qs = base_qs.filter(project__in=user_projects)
        
        return base_qs.filter(status=status).select_related('project', 'created_by')
    
    def by_priority(self, priority, user=None):
        """Filter tasks by priority with optimized query"""
        base_qs = self.get_queryset()
        
        if user and not user.is_superuser:
            user_projects = Project.objects.for_user(user)
            base_qs = base_qs.filter(project__in=user_projects)
        
        return base_qs.filter(priority=priority).select_related('project', 'created_by')
    
    def by_assignee(self, email, user=None):
        """Filter tasks by assignee email with optimized query"""
        base_qs = self.get_queryset()
        
        if user and not user.is_superuser:
            user_projects = Project.objects.for_user(user)
            base_qs = base_qs.filter(project__in=user_projects)
        
        return base_qs.filter(assignee_email__iexact=email).select_related('project', 'created_by')
    
    def overdue(self, user=None):
        """Get overdue tasks with optimized query"""
        base_qs = self.get_queryset()
        
        if user and not user.is_superuser:
            user_projects = Project.objects.for_user(user)
            base_qs = base_qs.filter(project__in=user_projects)
        
        return base_qs.filter(
            due_date__lt=timezone.now(),
            status__in=['TODO', 'IN_PROGRESS']
        ).select_related('project', 'created_by').order_by('due_date')
    
    def due_soon(self, days=3, user=None):
        """Get tasks due within specified number of days"""
        base_qs = self.get_queryset()
        
        if user and not user.is_superuser:
            user_projects = Project.objects.for_user(user)
            base_qs = base_qs.filter(project__in=user_projects)
        
        due_date = timezone.now() + timedelta(days=days)
        return base_qs.filter(
            due_date__lte=due_date,
            due_date__gte=timezone.now(),
            status__in=['TODO', 'IN_PROGRESS']
        ).select_related('project', 'created_by').order_by('due_date')
    
    def high_priority(self, user=None):
        """Get high priority and urgent tasks with optimized query"""
        base_qs = self.get_queryset()
        
        if user and not user.is_superuser:
            user_projects = Project.objects.for_user(user)
            base_qs = base_qs.filter(project__in=user_projects)
        
        return base_qs.filter(
            priority__in=['HIGH', 'URGENT'],
            status__in=['TODO', 'IN_PROGRESS']
        ).select_related('project', 'created_by').order_by('-priority', 'due_date')
    
    def search(self, query, user=None):
        """Full-text search on tasks with performance optimization"""
        base_qs = self.get_queryset()
        
        if user and not user.is_superuser:
            user_projects = Project.objects.for_user(user)
            base_qs = base_qs.filter(project__in=user_projects)
        
        return base_qs.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query) |
            Q(assignee_email__icontains=query)
        ).select_related('project', 'created_by')
    
    def with_comment_count(self, user=None):
        """Return tasks with comment count using optimized queries"""
        base_qs = self.get_queryset()
        
        if user and not user.is_superuser:
            user_projects = Project.objects.for_user(user)
            base_qs = base_qs.filter(project__in=user_projects)
        
        return base_qs.annotate(
            comment_count=Count('comments', distinct=True)
        ).select_related('project', 'created_by')


class Task(models.Model):
    STATUS_CHOICES = [
        ('TODO', 'To Do'),
        ('IN_PROGRESS', 'In Progress'),
        ('DONE', 'Done'),
        ('CANCELLED', 'Cancelled'),
    ]

    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='TODO')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='MEDIUM')
    assignee_email = models.EmailField(blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_tasks')

    objects = TaskManager()

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Task'
        verbose_name_plural = 'Tasks'

    def __str__(self):
        return f"{self.title} - {self.project.name}"

    def user_has_access(self, user):
        """Check if user has access to this task"""
        return user.is_superuser or self.project.user_has_access(user)


class TaskCommentManager(models.Manager):
    """Manager for TaskComment model with multi-tenancy support and performance optimizations"""
    
    def get_queryset(self):
        return super().get_queryset().select_related('task', 'task__project', 'task__project__organization', 'created_by')
    
    def for_organization(self, organization):
        """Return task comments for a specific organization with optimized query"""
        return self.get_queryset().filter(task__project__organization=organization).select_related('task', 'created_by')
    
    def for_project(self, project):
        """Return task comments for a specific project with optimized query"""
        return self.get_queryset().filter(task__project=project).select_related('task', 'created_by')
    
    def for_task(self, task):
        """Return task comments for a specific task with optimized query"""
        return self.get_queryset().filter(task=task).select_related('created_by').order_by('-timestamp')
    
    def for_user(self, user):
        """Return task comments that the user has access to with optimized query"""
        if user.is_superuser:
            return self.get_queryset()
        
        # Get tasks the user has access to
        user_tasks = Task.objects.for_user(user)
        return self.get_queryset().filter(task__in=user_tasks).select_related('task', 'created_by')
    
    def recent(self, days=7, user=None):
        """Get recent comments within specified number of days"""
        from datetime import timedelta
        
        base_qs = self.get_queryset()
        
        if user and not user.is_superuser:
            user_tasks = Task.objects.for_user(user)
            base_qs = base_qs.filter(task__in=user_tasks)
        
        start_date = timezone.now() - timedelta(days=days)
        return base_qs.filter(
            timestamp__gte=start_date
        ).select_related('task', 'created_by').order_by('-timestamp')
    
    def by_author(self, email, user=None):
        """Filter comments by author email with optimized query"""
        base_qs = self.get_queryset()
        
        if user and not user.is_superuser:
            user_tasks = Task.objects.for_user(user)
            base_qs = base_qs.filter(task__in=user_tasks)
        
        return base_qs.filter(author_email__iexact=email).select_related('task', 'created_by').order_by('-timestamp')
    
    def search(self, query, user=None):
        """Full-text search on task comments with performance optimization"""
        base_qs = self.get_queryset()
        
        if user and not user.is_superuser:
            user_tasks = Task.objects.for_user(user)
            base_qs = base_qs.filter(task__in=user_tasks)
        
        return base_qs.filter(
            Q(content__icontains=query) |
            Q(author_email__icontains=query)
        ).select_related('task', 'created_by').order_by('-timestamp')


class TaskComment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    author_email = models.EmailField()
    timestamp = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='task_comments')

    objects = TaskCommentManager()

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'Task Comment'
        verbose_name_plural = 'Task Comments'

    def __str__(self):
        return f"Comment on {self.task.title} by {self.author_email}"

    def user_has_access(self, user):
        """Check if user has access to this task comment"""
        return user.is_superuser or self.task.user_has_access(user)