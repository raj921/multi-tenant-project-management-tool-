import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      name: 'Jane Smith',
    },
  })

  const user3 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob Wilson',
    },
  })

  // Create organizations
  const org1 = await prisma.organization.create({
    data: {
      name: 'Acme Corp',
      slug: 'acme-corp',
      contactEmail: 'contact@acme.com',
      ownerId: user1.id,
    },
  })

  const org2 = await prisma.organization.create({
    data: {
      name: 'Tech Startup',
      slug: 'tech-startup',
      contactEmail: 'hello@tech.com',
      ownerId: user2.id,
    },
  })

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Complete redesign of the company website',
      status: 'ACTIVE',
      dueDate: new Date('2024-12-31'),
      organizationId: org1.id,
      createdBy: user1.id,
      taskCount: 10,
      completedTasksCount: 7,
      completionRate: 70,
    },
  })

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App Development',
      description: 'Develop a new mobile application for iOS and Android',
      status: 'ACTIVE',
      dueDate: new Date('2024-11-30'),
      organizationId: org1.id,
      createdBy: user2.id,
      taskCount: 15,
      completedTasksCount: 5,
      completionRate: 33,
    },
  })

  const project3 = await prisma.project.create({
    data: {
      name: 'Marketing Campaign',
      description: 'Q4 marketing campaign for product launch',
      status: 'ON_HOLD',
      dueDate: new Date('2024-12-15'),
      organizationId: org2.id,
      createdBy: user3.id,
      taskCount: 8,
      completedTasksCount: 2,
      completionRate: 25,
    },
  })

  // Create tasks
  await prisma.task.create({
    data: {
      title: 'Design homepage layout',
      description: 'Create wireframes and mockups for the homepage redesign',
      status: 'DONE',
      priority: 'HIGH',
      assigneeEmail: 'john@example.com',
      dueDate: new Date('2024-12-15'),
      projectId: project1.id,
      createdBy: user1.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Implement user authentication',
      description: 'Set up login, registration, and password reset functionality',
      status: 'IN_PROGRESS',
      priority: 'URGENT',
      assigneeEmail: 'jane@example.com',
      dueDate: new Date('2024-12-10'),
      projectId: project1.id,
      createdBy: user2.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Setup database schema',
      description: 'Design and implement the database structure for the mobile app',
      status: 'TODO',
      priority: 'MEDIUM',
      assigneeEmail: 'bob@example.com',
      dueDate: new Date('2024-12-20'),
      projectId: project2.id,
      createdBy: user3.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Create API endpoints',
      description: 'Develop RESTful API endpoints for mobile app functionality',
      status: 'TODO',
      priority: 'HIGH',
      assigneeEmail: 'alice@example.com',
      dueDate: new Date('2024-12-18'),
      projectId: project2.id,
      createdBy: user1.id,
    },
  })

  // Create some comments
  const task1 = await prisma.task.findFirst({
    where: { title: 'Design homepage layout' }
  })

  if (task1) {
    await prisma.taskComment.create({
      data: {
        content: 'This task is progressing well. The wireframes look great!',
        taskId: task1.id,
        authorId: user1.id,
      },
    })

    await prisma.taskComment.create({
      data: {
        content: 'I\'ve reviewed the designs and they meet our requirements.',
        taskId: task1.id,
        authorId: user2.id,
      },
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`📊 Created: ${await prisma.user.count()} users`)
  console.log(`🏢 Created: ${await prisma.organization.count()} organizations`)
  console.log(`📁 Created: ${await prisma.project.count()} projects`)
  console.log(`✅ Created: ${await prisma.task.count()} tasks`)
  console.log(`💬 Created: ${await prisma.taskComment.count()} comments`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })