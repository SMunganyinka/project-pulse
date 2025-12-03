# Project Pulse

## Project Description

**Project Pulse** is a lightweight project management dashboard designed for small teams to track and manage their projects efficiently.  
It allows users to view projects, track progress, and update project status seamlessly.

**Tech Stack:**
- **Frontend:** React + TypeScript + TailwindCSS + Vite  
- **Backend (assumed):** FastAPI + SQLite  

**Key Features:**
- Display a list of projects with status (Not Started, In Progress, Completed)  
- Add new projects through a form with validation  
- Update project status directly from the dashboard  
- Modern and responsive UI  

---

## Project Structure
```
project-pulse/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── auth.py
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── models.py
│   │   └── schemas.py
│   ├── project_pulse.db
│   ├── requirements.txt
│   └── venv/
│
└── frontend/
    ├── public/
    ├── node_modules/
    └── src/
        ├── api/
        │   ├── auth.ts
        │   ├── client.ts
        │   └── projects.ts
        │
        ├── components/
        │   ├── Alert.tsx
        │   ├── Footer.tsx
        │   ├── Layout.tsx
        │   ├── Navbar.tsx
        │   ├── ProjectBoard.tsx
        │   ├── ProjectCard.tsx
        │   ├── ProjectForm.tsx
        │   ├── ProjectStats.tsx
        │   └── ProtectedRoute.tsx
        │
        ├── contexts/
        │   └── AuthContext.tsx
        │
        ├── pages/
        │   ├── DashboardPage.tsx
        │   ├── FeaturesPage.tsx
        │   ├── LandingPage.tsx
        │   ├── LoginPage.tsx
        │   └── RegisterPage.tsx
        │
        ├── App.tsx
        ├── index.css
        └── main.tsx
```

---

## Application Overview

### Landing Page (/)
- Hero section introducing Project Pulse  
- Call-to-action button linking to dashboard  
- Brief value propositions  

### Features Page (/features)
- List of main features  
- Each includes a title, description, and icon  

### Dashboard (/dashboard)
- Displays total project count  
- Displays all projects  
- Add new projects via  modal  
- Update project status directly  
- Fully responsive interface  

---
# -----------------------------
# Clone the Repository
# -----------------------------
git clone https://github.com/SMunganyinka/project-pulse.git
cd project-pulse


# -----------------------------
# Backend Setup (FastAPI + SQLite)
# -----------------------------
cd backend
python -m venv venv

# Activate virtual environment
# macOS / Linux
source venv/bin/activate
# Windows
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn app.main:app --reload

# Backend URLs
# API: http://127.0.0.1:8000
# Swagger Docs: http://127.0.0.1:8000/docs


# -----------------------------
# Frontend Setup (React + Vite)
# -----------------------------
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Frontend URL: http://127.0.0.1:5173


---
## Technical Choices & Reasoning

FastAPI: Lightweight, fast, async-friendly, and comes with automatic Swagger docs. Ideal for a small dashboard.

SQLite: Zero configuration, lightweight, works seamlessly with SQLAlchemy. Perfect for assessment tasks.

React + Vite + TypeScript: Vite offers fast development, React is component-based, and TypeScript ensures type safety.

Tailwind CSS: Rapid and consistent styling for modern UI.

JWT Authentication: Secure token-based system suitable for small apps.

## Assumptions:

Users are internal team members; no external authentication needed.

Project data is lightweight; SQLite suffices.

Dashboard users require basic CRUD functionality.


---
## Features Implemented

### Frontend
- User authentication (Login & Register)  
- Protected dashboard route  
- Add, update, and view projects  
- Project statistics  
- Responsive design  
- Reusable components (Navbar, Layout, Footer, Alert, etc.)  
- Axios-powered API communication  

### Backend
- JWT authentication  
- CRUD operations for projects  
- SQLite persistent storage  
- Modular FastAPI structure  

---

## Optional Enhancements implemented

- Client-side form validation  
- Delete project functionality  
- Loading states and error handling  
- Mobile responsiveness  
- Deployment on Vercel or Render  
- Basic backend unit tests  

---

## License

This project was created as part of the ***Nexventures Ltd. Full-Stack Software Engineering Internship Technical Assessment***.
