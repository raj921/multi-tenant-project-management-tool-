# Generated migration for performance optimization

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0001_initial'),
    ]

    operations = [
        # Add composite indexes for frequently queried fields
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_project_org_status ON projects_project (organization_id, status, created_at);",
            "DROP INDEX CONCURRENTLY IF EXISTS idx_project_org_status;"
        ),
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_project_org_created ON projects_project (organization_id, created_at);",
            "DROP INDEX CONCURRENTLY IF EXISTS idx_project_org_created;"
        ),
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_project_due_date ON projects_project (due_date);",
            "DROP INDEX CONCURRENTLY IF EXISTS idx_project_due_date;"
        ),
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_project_status_created ON projects_project (status, created_at);",
            "DROP INDEX CONCURRENTLY IF EXISTS idx_project_status_created;"
        ),
        # Add GIN index for full-text search on project names and descriptions
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_project_name_search ON projects_project USING gin(to_tsvector('english', name));",
            "DROP INDEX CONCURRENTLY IF EXISTS idx_project_name_search;"
        ),
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_project_desc_search ON projects_project USING gin(to_tsvector('english', description));",
            "DROP INDEX CONCURRENTLY IF EXISTS idx_project_desc_search;"
        ),
    ]