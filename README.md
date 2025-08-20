# Project Management System

A modern, multi-tenant project management system built with Django + GraphQL backend and React + TypeScript frontend.

## 🚀 Features

- **Multi-tenant** architecture with organization-based data isolation
- **GraphQL API** with efficient queries and mutations
- **Modern UI** with responsive design and real-time updates
- **Task Management** with Kanban-style board
- **Project Dashboard** with progress tracking
- **Real-time Comment System**

## 🛠️ Technology Stack

### Backend
- Django 4.x with GraphQL (Graphene)
- PostgreSQL
- Django REST Framework
- Graphene-Django

### Frontend
- Next.js 15 with TypeScript
- Apollo Client
- Tailwind CSS + shadcn/ui
- React Hook Form + Zod

### Frontend UI
 DASHBOARD
 ![alt text](image.png)
 new project setup 
 ![alt text](image-1.png)
 Task  Management
 ![alt text](image-2.png)


## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- PostgreSQL 12+ (or use a cloud provider)

### 1. Clone and Setup

```bash
git clone <repository-url>
cd project-management-system
```

### 2. PostgreSQL Setup

Choose one of these options to set up your PostgreSQL database:

#### Option 1: Using the Setup Script (Recommended)

Run the interactive setup script:

```bash
node setup-postgresql.js
```

Follow the prompts to set up with:
- 🐘 ElephantSQL (Free tier available)
- 🔥 Supabase (Free tier available)
- 🚀 Render (Free tier available)
- ✨ Neon (Free tier available)
- Or use a custom connection string

#### Option 2: Manual Setup

1. Create a PostgreSQL database
2. Copy `.env.example` to `.env`
3. Update the `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/your_database
   ```

### 3. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate
python manage.py createsuperuser
```

### 4. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

### 5. Start the Development Servers

In separate terminal windows:

```bash
# Backend
cd backend
python manage.py runserver

# Frontend
cd frontend
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 📦 Deployment

### Docker (Recommended for Production)

```bash
docker-compose up --build
```

## 🌟 Features in Detail

### Project Management
- Create and manage projects
- Track progress with status indicators
- Organize tasks in Kanban view

### Task Management
- Drag-and-drop interface
- Assign tasks to team members
- Set due dates and priorities

### Real-time Collaboration
- Live comments on tasks
- Activity feed
- User mentions

## 📚 Documentation

For detailed documentation, please refer to the [docs](./docs) directory.
   python manage.py runserver
   ```

The GraphQL API will be available at `http://localhost:8000/graphql/`

### Frontend Setup

1. **Navigate to the project root**
   ```bash
   cd ..
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

