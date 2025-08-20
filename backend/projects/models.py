from django .db import models
from django .contrib .auth .models import User
from django .db .models import Case ,When ,IntegerField ,Count ,Q
from organizations .models import Organization


class ProjectManager (models .Manager ):
    """Manager for Project model with multi-tenancy support and performance optimizations"""

    def get_queryset (self ):
        return super ().get_queryset ().select_related ('organization','created_by').prefetch_related ('tasks')

    def for_organization (self ,organization ):
        """Return projects for a specific organization with optimized query"""
        return self .get_queryset ().filter (organization =organization ).select_related ('organization','created_by')

    def for_user (self ,user ):
        """Return projects that the user has access to with optimized query"""
        if user .is_superuser :
            return self .get_queryset ()


        user_organizations =Organization .objects .for_user (user )
        return self .get_queryset ().filter (organization__in =user_organizations ).select_related ('organization','created_by')

    def with_task_stats (self ,user =None ):
        """Return projects with task statistics using optimized queries"""
        base_qs =self .get_queryset ()

        if user and not user .is_superuser :
            user_organizations =Organization .objects .for_user (user )
            base_qs =base_qs .filter (organization__in =user_organizations )

        return base_qs .annotate (
        task_count =Count ('tasks',distinct =True ),
        completed_tasks_count =Count (
        Case (
        When (tasks__status ='DONE',then =1 ),
        output_field =IntegerField (),
        ),
        distinct =True
        ),
        in_progress_tasks_count =Count (
        Case (
        When (tasks__status ='IN_PROGRESS',then =1 ),
        output_field =IntegerField (),
        ),
        distinct =True
        ),
        todo_tasks_count =Count (
        Case (
        When (tasks__status ='TODO',then =1 ),
        output_field =IntegerField (),
        ),
        distinct =True
        ),
        overdue_tasks_count =Count (
        Case (
        When (
        tasks__due_date__lt =models .functions .Now (),
        ~Q (tasks__status__in =['DONE','CANCELLED']),
        then =1
        ),
        output_field =IntegerField (),
        ),
        distinct =True
        ),
        ).select_related ('organization','created_by')

    def search (self ,query ,user =None ):
        """Full-text search on projects with performance optimization"""
        base_qs =self .get_queryset ()

        if user and not user .is_superuser :
            user_organizations =Organization .objects .for_user (user )
            base_qs =base_qs .filter (organization__in =user_organizations )

        return base_qs .filter (
        Q (name__icontains =query )|
        Q (description__icontains =query )
        ).select_related ('organization','created_by')

    def by_status (self ,status ,user =None ):
        """Filter projects by status with optimized query"""
        base_qs =self .get_queryset ()

        if user and not user .is_superuser :
            user_organizations =Organization .objects .for_user (user )
            base_qs =base_qs .filter (organization__in =user_organizations )

        return base_qs .filter (status =status ).select_related ('organization','created_by')

    def due_soon (self ,days =7 ,user =None ):
        """Get projects due within specified number of days"""
        from django .utils import timezone
        from datetime import timedelta

        base_qs =self .get_queryset ()

        if user and not user .is_superuser :
            user_organizations =Organization .objects .for_user (user )
            base_qs =base_qs .filter (organization__in =user_organizations )

        due_date =timezone .now ().date ()+timedelta (days =days )
        return base_qs .filter (
        due_date__lte =due_date ,
        due_date__gte =timezone .now ().date (),
        status__in =['ACTIVE','IN_PROGRESS']
        ).select_related ('organization','created_by').order_by ('due_date')


class Project (models .Model ):
    STATUS_CHOICES =[
    ('ACTIVE','Active'),
    ('COMPLETED','Completed'),
    ('ON_HOLD','On Hold'),
    ('CANCELLED','Cancelled'),
    ]

    organization =models .ForeignKey (Organization ,on_delete =models .CASCADE ,related_name ='projects')
    name =models .CharField (max_length =200 )
    description =models .TextField (blank =True )
    status =models .CharField (max_length =20 ,choices =STATUS_CHOICES ,default ='ACTIVE')
    due_date =models .DateField (null =True ,blank =True )
    created_at =models .DateTimeField (auto_now_add =True )
    updated_at =models .DateTimeField (auto_now =True )
    created_by =models .ForeignKey (User ,on_delete =models .SET_NULL ,null =True ,related_name ='created_projects')

    objects =ProjectManager ()

    class Meta :
        ordering =['-created_at']
        verbose_name ='Project'
        verbose_name_plural ='Projects'

    def __str__ (self ):
        return f"{self .name } - {self .organization .name }"

    @property
    def task_count (self ):
        return self .tasks .count ()

    @property
    def completed_tasks_count (self ):
        return self .tasks .filter (status ='DONE').count ()

    @property
    def completion_rate (self ):
        if self .task_count ==0 :
            return 0
        return (self .completed_tasks_count /self .task_count )*100

    def user_has_access (self ,user ):
        """Check if user has access to this project"""
        return user .is_superuser or self .organization .user_has_access (user )