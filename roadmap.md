# Roadmap for Building the Dashboard using React and Node.js

## Phase 1: Project Setup
### 1. Initialize Backend (Node.js, Express, MongoDB)
- Set up a new Node.js project: `mkdir backend && cd backend && npm init -y`
- Install required dependencies: `npm install express mongoose dotenv cors jsonwebtoken bcryptjs`
- Set up an Express server (`server.js`)
- Configure MongoDB connection using Mongoose

### 2. Initialize Frontend (React, Tailwind, ShadcnUI)
- Create a React project: `npx create-react-app frontend`
- Install dependencies: `npm install react-router-dom axios tailwindcss @shadcn/ui`
- Configure Tailwind CSS

## Phase 2: Authentication System (JWT-based)
### 3. Backend Authentication Setup
- Create user schema in MongoDB with email & password
- Implement JWT-based authentication (Signup/Login APIs)
- Hash passwords using bcryptjs

### 4. Frontend Authentication
- Create authentication pages (Login & Signup)
- Implement JWT storage in localStorage
- Set up protected routes using React Router
- Auto logout on token expiration

## Phase 3: Dashboard & Google Sheets Integration
### 5. Create Dashboard UI
- Implement a protected dashboard route
- Add a "Create Table" button
- Allow users to define table structure (columns, data types)

### 6. Google Sheets Integration
- Set up Google Sheets API in Google Cloud Console
- Implement backend API to fetch Google Sheets data
- Display fetched data in a dynamic table

## Phase 4: Real-time Updates & Dynamic Column Addition
### 7. Real-time Data Sync
- Use WebSockets or Firebase for real-time updates
- Ensure minimal API calls for efficiency

### 8. Dynamic Column Addition
- Allow users to add columns dynamically in the frontend
- Ensure these columns persist only on the frontend

## Phase 5: Deployment & Documentation
### 9. Deployment
- Deploy frontend on Vercel
- Deploy backend on Render/Heroku

### 10. Documentation & Submission
- Write a clear README with setup instructions
- Record an explainer video (Loom)

