import graphene
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from django.contrib.auth.models import User
from organizations.models import Organization
from projects.models import Project
from tasks.models import Task, TaskComment

class UserType(DjangoObjectType):

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'date_joined')

class OrganizationType(DjangoObjectType):

    class Meta:
        model = Organization
        fields = '__all__'
        filter_fields = {'name': ['exact', 'icontains', 'istartswith'], 'slug': ['exact'], 'contact_email': ['exact', 'icontains']}
        interfaces = (graphene.relay.Node,)

class ProjectType(DjangoObjectType):
    task_count = graphene.Int()
    completed_tasks_count = graphene.Int()
    completion_rate = graphene.Float()

    class Meta:
        model = Project
        fields = '__all__'
        filter_fields = {'name': ['exact', 'icontains', 'istartswith'], 'status': ['exact'], 'organization': ['exact'], 'organization__slug': ['exact']}
        interfaces = (graphene.relay.Node,)

    def resolve_task_count(self, info):
        return self.task_count

    def resolve_completed_tasks_count(self, info):
        return self.completed_tasks_count

    def resolve_completion_rate(self, info):
        return self.completion_rate

class TaskType(DjangoObjectType):

    class Meta:
        model = Task
        fields = '__all__'
        filter_fields = {'title': ['exact', 'icontains', 'istartswith'], 'status': ['exact'], 'priority': ['exact'], 'project': ['exact'], 'project__organization': ['exact'], 'assignee_email': ['exact', 'icontains']}
        interfaces = (graphene.relay.Node,)

class TaskCommentType(DjangoObjectType):

    class Meta:
        model = TaskComment
        fields = '__all__'
        filter_fields = {'task': ['exact'], 'author_email': ['exact', 'icontains']}
        interfaces = (graphene.relay.Node,)

class Query(graphene.ObjectType):
    node = graphene.relay.Node.Field()
    me = graphene.Field(UserType)
    users = graphene.List(UserType)
    organization = graphene.Field(OrganizationType, slug=graphene.String())
    organizations = graphene.List(OrganizationType)
    my_organizations = graphene.List(OrganizationType)
    organizations_with_stats = graphene.List(OrganizationType)
    search_organizations = graphene.List(OrganizationType, query=graphene.String())
    project = graphene.relay.Node.Field(ProjectType)
    projects = DjangoFilterConnectionField(ProjectType)
    projects_by_organization = graphene.List(ProjectType, organization_slug=graphene.String())
    my_projects = graphene.List(ProjectType)
    projects_with_stats = graphene.List(ProjectType)
    search_projects = graphene.List(ProjectType, query=graphene.String())
    projects_by_status = graphene.List(ProjectType, status=graphene.String())
    projects_due_soon = graphene.List(ProjectType, days=graphene.Int())
    task = graphene.relay.Node.Field(TaskType)
    tasks = DjangoFilterConnectionField(TaskType)
    tasks_by_project = graphene.List(TaskType, project_id=graphene.ID())
    my_tasks = graphene.List(TaskType)
    tasks_by_status = graphene.List(TaskType, status=graphene.String())
    tasks_by_priority = graphene.List(TaskType, priority=graphene.String())
    tasks_by_assignee = graphene.List(TaskType, email=graphene.String())
    overdue_tasks = graphene.List(TaskType)
    tasks_due_soon = graphene.List(TaskType, days=graphene.Int())
    high_priority_tasks = graphene.List(TaskType)
    search_tasks = graphene.List(TaskType, query=graphene.String())
    tasks_with_comment_count = graphene.List(TaskType)
    task_comment = graphene.relay.Node.Field(TaskCommentType)
    task_comments = DjangoFilterConnectionField(TaskCommentType)
    comments_by_task = graphene.List(TaskCommentType, task_id=graphene.ID())
    recent_comments = graphene.List(TaskCommentType, days=graphene.Int())
    comments_by_author = graphene.List(TaskCommentType, email=graphene.String())
    search_comments = graphene.List(TaskCommentType, query=graphene.String())

    def resolve_me(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        return user

    def resolve_users(self, info):
        user = info.context.user
        if user.is_anonymous or not user.is_superuser:
            raise Exception('Permission denied!')
        return User.objects.all()

    def resolve_organization(self, info, slug):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        try:
            organization = Organization.objects.get(slug=slug)
            if not organization.user_has_access(user):
                raise Exception('Permission denied!')
            return organization
        except Organization.DoesNotExist:
            return None

    def resolve_organizations(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        if user.is_superuser:
            return Organization.objects.all()
        return Organization.objects.for_user(user)

    def resolve_my_organizations(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        return Organization.objects.for_user(user)

    def resolve_projects_by_organization(self, info, organization_slug):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        try:
            organization = Organization.objects.get(slug=organization_slug)
            if not organization.user_has_access(user):
                raise Exception('Permission denied!')
            return Project.objects.for_organization(organization)
        except Organization.DoesNotExist:
            return []

    def resolve_my_projects(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        return Project.objects.for_user(user)

    def resolve_tasks_by_project(self, info, project_id):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        try:
            project = Project.objects.get(id=project_id)
            if not project.user_has_access(user):
                raise Exception('Permission denied!')
            return Task.objects.for_project(project)
        except Project.DoesNotExist:
            return []

    def resolve_my_tasks(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        return Task.objects.for_user(user)

    def resolve_comments_by_task(self, info, task_id):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        try:
            task = Task.objects.get(id=task_id)
            if not task.user_has_access(user):
                raise Exception('Permission denied!')
            return TaskComment.objects.for_task(task)
        except Task.DoesNotExist:
            return []

    def resolve_organizations_with_stats(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        return Organization.objects.with_stats(user)

    def resolve_search_organizations(self, info, query):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        return Organization.objects.search(query, user)

    def resolve_projects_with_stats(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        return Project.objects.with_task_stats(user)

    def resolve_search_projects(self, info, query):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        return Project.objects.search(query, user)

    def resolve_projects_by_status(self, info, status):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        return Project.objects.by_status(status, user)

    def resolve_projects_due_soon(self, info, days=7):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        return Project.objects.due_soon(days, user)

    def resolve_tasks_by_status(self, info, status):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        return Task.objects.by_status(status, user)

    def resolve_tasks_by_priority(self, info, priority):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        return Task.objects.by_priority(priority, user)

    def resolve_tasks_by_assignee(self, info, email):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        return Task.objects.by_assignee(email, user)

    def resolve_overdue_tasks(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        return Task.objects.overdue(user)

    def resolve_tasks_due_soon(self, info, days=3):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        return Task.objects.due_soon(days, user)

    def resolve_high_priority_tasks(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        return Task.objects.high_priority(user)

    def resolve_search_tasks(self, info, query):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        return Task.objects.search(query, user)

    def resolve_tasks_with_comment_count(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        return Task.objects.with_comment_count(user)

    def resolve_recent_comments(self, info, days=7):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        return TaskComment.objects.recent(days, user)

    def resolve_comments_by_author(self, info, email):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        return TaskComment.objects.by_author(email, user)

    def resolve_search_comments(self, info, query):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        return TaskComment.objects.search(query, user)

class OrganizationInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    slug = graphene.String()
    contact_email = graphene.String(required=True)

class ProjectInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    description = graphene.String()
    status = graphene.String()
    due_date = graphene.types.datetime.Date()
    organization_id = graphene.ID(required=True)

class TaskInput(graphene.InputObjectType):
    title = graphene.String(required=True)
    description = graphene.String()
    status = graphene.String()
    priority = graphene.String()
    assignee_email = graphene.String()
    due_date = graphene.types.datetime.DateTime()
    project_id = graphene.ID(required=True)

class TaskCommentInput(graphene.InputObjectType):
    content = graphene.String(required=True)
    author_email = graphene.String(required=True)
    task_id = graphene.ID(required=True)

class CreateOrganization(graphene.Mutation):

    class Arguments:
        input = OrganizationInput(required=True)
    organization = graphene.Field(OrganizationType)

    def mutate(self, info, input):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        organization = Organization.objects.create(name=input.name, slug=input.slug or input.name.lower().replace(' ', '-'), contact_email=input.contact_email, owner=user)
        organization.members.add(user)
        return CreateOrganization(organization=organization)

class UpdateOrganization(graphene.Mutation):

    class Arguments:
        id = graphene.ID(required=True)
        input = OrganizationInput(required=True)
    organization = graphene.Field(OrganizationType)

    def mutate(self, info, id, input):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        try:
            organization = Organization.objects.get(id=id)
            if not organization.user_has_access(user) or organization.owner != user:
                raise Exception('Permission denied!')
        except Organization.DoesNotExist:
            raise Exception('Organization not found!')
        organization.name = input.name
        organization.contact_email = input.contact_email
        if input.slug:
            organization.slug = input.slug
        organization.save()
        return UpdateOrganization(organization=organization)

class CreateProject(graphene.Mutation):

    class Arguments:
        input = ProjectInput(required=True)
    project = graphene.Field(ProjectType)

    def mutate(self, info, input):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        try:
            organization = Organization.objects.get(id=input.organization_id)
            if not organization.user_has_access(user):
                raise Exception('Permission denied!')
        except Organization.DoesNotExist:
            raise Exception('Organization not found!')
        project = Project.objects.create(name=input.name, description=input.description or '', status=input.status or 'ACTIVE', due_date=input.due_date, organization=organization, created_by=user)
        return CreateProject(project=project)

class UpdateProject(graphene.Mutation):

    class Arguments:
        id = graphene.ID(required=True)
        input = ProjectInput(required=True)
    project = graphene.Field(ProjectType)

    def mutate(self, info, id, input):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        try:
            project = Project.objects.get(id=id)
            if not project.user_has_access(user):
                raise Exception('Permission denied!')
        except Project.DoesNotExist:
            raise Exception('Project not found!')
        project.name = input.name
        project.description = input.description or project.description
        project.status = input.status or project.status
        project.due_date = input.due_date or project.due_date
        project.save()
        return UpdateProject(project=project)

class CreateTask(graphene.Mutation):

    class Arguments:
        input = TaskInput(required=True)
    task = graphene.Field(TaskType)

    def mutate(self, info, input):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        try:
            project = Project.objects.get(id=input.project_id)
            if not project.user_has_access(user):
                raise Exception('Permission denied!')
        except Project.DoesNotExist:
            raise Exception('Project not found!')
        task = Task.objects.create(title=input.title, description=input.description or '', status=input.status or 'TODO', priority=input.priority or 'MEDIUM', assignee_email=input.assignee_email or '', due_date=input.due_date, project=project, created_by=user)
        return CreateTask(task=task)

class UpdateTask(graphene.Mutation):

    class Arguments:
        id = graphene.ID(required=True)
        input = TaskInput(required=True)
    task = graphene.Field(TaskType)

    def mutate(self, info, id, input):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        try:
            task = Task.objects.get(id=id)
            if not task.user_has_access(user):
                raise Exception('Permission denied!')
        except Task.DoesNotExist:
            raise Exception('Task not found!')
        task.title = input.title
        task.description = input.description or task.description
        task.status = input.status or task.status
        task.priority = input.priority or task.priority
        task.assignee_email = input.assignee_email or task.assignee_email
        task.due_date = input.due_date or task.due_date
        task.save()
        return UpdateTask(task=task)

class AddTaskComment(graphene.Mutation):

    class Arguments:
        input = TaskCommentInput(required=True)
    comment = graphene.Field(TaskCommentType)

    def mutate(self, info, input):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')
        try:
            task = Task.objects.get(id=input.task_id)
            if not task.user_has_access(user):
                raise Exception('Permission denied!')
        except Task.DoesNotExist:
            raise Exception('Task not found!')
        comment = TaskComment.objects.create(content=input.content, author_email=input.author_email, task=task, created_by=user)
        return AddTaskComment(comment=comment)

class Mutation(graphene.ObjectType):
    create_organization = CreateOrganization.Field()
    update_organization = UpdateOrganization.Field()
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    add_task_comment = AddTaskComment.Field()
schema = graphene.Schema(query=Query, mutation=Mutation)