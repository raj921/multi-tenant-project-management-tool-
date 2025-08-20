# Generated migration for performance optimization

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0001_initial'),
    ]

    operations = [
        # Add composite indexes for frequently queried fields
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_task_project_status ON tasks_task (project_id, status, created_at);",
            "DROP INDEX CONCURRENTLY IF EXISTS idx_task_project_status;"
        ),
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_task_project_priority ON tasks_task (project_id, priority, status);",
            "DROP INDEX CONCURRENTLY IF EXISTS idx_task_project_priority;"
        ),
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_task_assignee_email ON tasks_task (assignee_email);",
            "DROP INDEX CONCURRENTLY IF EXISTS idx_task_assignee_email;"
        ),
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_task_due_date ON tasks_task (due_date);",
            "DROP INDEX CONCURRENTLY IF EXISTS idx_task_due_date;"
        ),
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_task_status_created ON tasks_task (status, created_at);",
            "DROP INDEX CONCURRENTLY IF EXISTS idx_task_status_created;"
        ),
        # Add GIN index for full-text search on task titles and descriptions
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_task_title_search ON tasks_task USING gin(to_tsvector('english', title));",
            "DROP INDEX CONCURRENTLY IF EXISTS idx_task_title_search;"
        ),
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_task_desc_search ON tasks_task USING gin(to_tsvector('english', description));",
            "DROP INDEX CONCURRENTLY IF EXISTS idx_task_desc_search;"
        ),
        # Index for task comments
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_task_comment_task_timestamp ON tasks_taskcomment (task_id, timestamp);",
            "DROP INDEX CONCURRENTLY IF EXISTS idx_task_comment_task_timestamp;"
        ),
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_task_comment_author ON tasks_taskcomment (author_email);",
            "DROP INDEX CONCURRENTLY IF EXISTS idx_task_comment_author;"
        ),
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_task_comment_timestamp ON tasks_taskcomment (timestamp);",
            "DROP INDEX CONCURRENTLY IF EXISTS idx_task_comment_timestamp;"
        ),
        # Add GIN index for full-text search on comment content
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_task_comment_content_search ON tasks_taskcomment USING gin(to_tsvector('english', content));",
            "DROP INDEX CONCURRENTLY IF EXISTS idx_task_comment_content_search;"
        ),
    ]