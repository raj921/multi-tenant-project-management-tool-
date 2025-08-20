"""
Django caching configuration for performance optimization
"""

from django.core.cache.backends.base import BaseCache
from django.core.cache.backends.locmem import LocMemCache
from django.conf import settings
import redis
import json
import logging
from typing import Any, Optional
from datetime import timedelta

logger = logging.getLogger(__name__)


class SmartCache:
    """
    Smart caching system with automatic invalidation and TTL management
    """
    
    def __init__(self, prefix: str = 'pm', default_timeout: int = 300):
        self.prefix = prefix
        self.default_timeout = default_timeout
        self.redis_client = redis.Redis(
            host=getattr(settings, 'REDIS_HOST', 'localhost'),
            port=getattr(settings, 'REDIS_PORT', 6379),
            db=getattr(settings, 'REDIS_DB', 0),
            password=getattr(settings, 'REDIS_PASSWORD', None),
            decode_responses=True
        )
        
    def _make_key(self, key: str) -> str:
        """Generate cache key with prefix"""
        return f"{self.prefix}:{key}"
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        try:
            cache_key = self._make_key(key)
            value = self.redis_client.get(cache_key)
            if value:
                return json.loads(value)
        except Exception as e:
            logger.error(f"Cache get error for key {key}: {e}")
        return None
    
    def set(self, key: str, value: Any, timeout: Optional[int] = None) -> bool:
        """Set value in cache with timeout"""
        try:
            cache_key = self._make_key(key)
            timeout = timeout or self.default_timeout
            serialized_value = json.dumps(value, default=str)
            return self.redis_client.setex(cache_key, timeout, serialized_value)
        except Exception as e:
            logger.error(f"Cache set error for key {key}: {e}")
            return False
    
    def delete(self, key: str) -> bool:
        """Delete value from cache"""
        try:
            cache_key = self._make_key(key)
            return bool(self.redis_client.delete(cache_key))
        except Exception as e:
            logger.error(f"Cache delete error for key {key}: {e}")
            return False
    
    def clear_pattern(self, pattern: str) -> int:
        """Clear all keys matching pattern"""
        try:
            keys = self.redis_client.keys(f"{self.prefix}:{pattern}*")
            if keys:
                return self.redis_client.delete(*keys)
            return 0
        except Exception as e:
            logger.error(f"Cache clear pattern error for pattern {pattern}: {e}")
            return 0
    
    def invalidate_organization(self, organization_id: str) -> None:
        """Invalidate all cache entries for an organization"""
        patterns = [
            f"org:{organization_id}",
            f"projects:org:{organization_id}",
            f"tasks:org:{organization_id}",
            f"comments:org:{organization_id}"
        ]
        for pattern in patterns:
            self.clear_pattern(pattern)
    
    def invalidate_project(self, project_id: str) -> None:
        """Invalidate all cache entries for a project"""
        patterns = [
            f"project:{project_id}",
            f"tasks:project:{project_id}",
            f"comments:project:{project_id}"
        ]
        for pattern in patterns:
            self.clear_pattern(pattern)
    
    def invalidate_task(self, task_id: str) -> None:
        """Invalidate all cache entries for a task"""
        patterns = [
            f"task:{task_id}",
            f"comments:task:{task_id}"
        ]
        for pattern in patterns:
            self.clear_pattern(pattern)


# Global cache instances
org_cache = SmartCache(prefix='pm_org', default_timeout=600)  # 10 minutes
project_cache = SmartCache(prefix='pm_project', default_timeout=300)  # 5 minutes
task_cache = SmartCache(prefix='pm_task', default_timeout=180)  # 3 minutes
comment_cache = SmartCache(prefix='pm_comment', default_timeout=120)  # 2 minutes


def cached_query(cache_instance: SmartCache, key_prefix: str, timeout: Optional[int] = None):
    """
    Decorator for caching query results with automatic invalidation
    """
    def decorator(func):
        def wrapper(*args, **kwargs):
            # Generate cache key based on function name and arguments
            key_parts = [key_prefix, func.__name__]
            key_parts.extend([str(arg) for arg in args])
            key_parts.extend([f"{k}:{v}" for k, v in sorted(kwargs.items())])
            cache_key = ":".join(key_parts)
            
            # Try to get from cache
            cached_result = cache_instance.get(cache_key)
            if cached_result is not None:
                return cached_result
            
            # Execute function and cache result
            result = func(*args, **kwargs)
            cache_instance.set(cache_key, result, timeout)
            return result
        
        return wrapper
    return decorator


def get_cache_stats():
    """Get cache statistics"""
    try:
        info = org_cache.redis_client.info()
        return {
            'used_memory': info.get('used_memory_human', 'N/A'),
            'connected_clients': info.get('connected_clients', 0),
            'total_commands_processed': info.get('total_commands_processed', 0),
            'keyspace_hits': info.get('keyspace_hits', 0),
            'keyspace_misses': info.get('keyspace_misses', 0),
            'hit_rate': round(
                info.get('keyspace_hits', 0) / 
                (info.get('keyspace_hits', 0) + info.get('keyspace_misses', 1)) * 100, 2
            )
        }
    except Exception as e:
        logger.error(f"Error getting cache stats: {e}")
        return {}