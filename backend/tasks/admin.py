from django.contrib import admin
from .models import Task, TaskComment

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'status', 'priority', 'assignee_email', 'due_date', 'created_by']
    list_filter = ['status', 'priority', 'project__organization', 'created_at']
    search_fields = ['title', 'description', 'assignee_email']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (('Basic Information', {'fields': ('title', 'description', 'project')}), ('Task Details', {'fields': ('status', 'priority', 'assignee_email', 'due_date', 'created_by')}), ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}))

@admin.register(TaskComment)
class TaskCommentAdmin(admin.ModelAdmin):
    list_display = ['task', 'author_email', 'timestamp', 'created_by']
    list_filter = ['timestamp', 'task__project__organization']
    search_fields = ['content', 'author_email', 'task__title']
    readonly_fields = ['timestamp']
    fieldsets = (('Comment Information', {'fields': ('task', 'content', 'author_email', 'created_by')}), ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}))