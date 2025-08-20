from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.db import connection
from django.core.cache import cache


@require_GET
def health_check(request):
    """Health check endpoint for monitoring"""
    try:
        # Check database connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    # Check cache
    try:
        cache.set('health_check', 'OK', 1)
        cache_status = "healthy"
    except Exception as e:
        cache_status = f"unhealthy: {str(e)}"
    
    status = "healthy" if db_status == "healthy" and cache_status == "healthy" else "unhealthy"
    
    return JsonResponse({
        "status": status,
        "database": db_status,
        "cache": cache_status,
        "timestamp": str(__import__('datetime').datetime.now())
    }, status=200 if status == "healthy" else 503)