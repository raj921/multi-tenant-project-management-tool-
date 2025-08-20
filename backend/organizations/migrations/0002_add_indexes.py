# Generated migration for performance optimization

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('organizations', '0001_initial'),
    ]

    operations = [
        # Add composite indexes for frequently queried fields
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_org_owner_created ON organizations_organization (owner_id, created_at);",
            "DROP INDEX CONCURRENTLY IF EXISTS idx_org_owner_created;"
        ),
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_org_name_slug ON organizations_organization (name, slug);",
            "DROP INDEX CONCURRENTLY IF EXISTS idx_org_name_slug;"
        ),
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_org_contact_email ON organizations_organization (contact_email);",
            "DROP INDEX CONCURRENTLY IF EXISTS idx_org_contact_email;"
        ),
        # Add GIN index for full-text search on organization names
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_org_name_search ON organizations_organization USING gin(to_tsvector('english', name));",
            "DROP INDEX CONCURRENTLY IF EXISTS idx_org_name_search;"
        ),
    ]