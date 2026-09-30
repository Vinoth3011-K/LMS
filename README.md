# LMS Platform (Learning Management System)

A modern, production-ready Full Stack Learning Management System built with React.js and Django REST Framework.

## Features

* **User Authentication**: Secure JWT-based authentication with role-based access control (Admin, Instructor, Student).
* **Course Management**: Instructors can draft, publish, and manage courses, modules, and video lessons.
* **Student Learning Environment**: A distraction-free video learning interface with real-time progress tracking.
* **Quiz & Assessment System**: Instructors can build interactive quizzes; students receive auto-evaluated instant results.
* **Certificate Generation**: (Implemented in earlier phases) Secure PDF generation and verification.
* **Analytics Dashboard**: Comprehensive data visualizations and metrics for Admins, Instructors, and Students.
* **Advanced Search**: Filter courses by category, difficulty, and keyword search.

## Tech Stack

* **Frontend**: React.js, Vite, React Router, Tailwind CSS, Axios, Lucide React
* **Backend**: Python, Django, Django REST Framework, SimpleJWT
* **Database**: PostgreSQL (currently configured to SQLite for rapid local development)

## Installation Steps

### Prerequisites
* Python 3.10+
* Node.js v18+

### Backend Setup

1. Open a terminal and navigate to the `backend` directory.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py makemigrations users lms_core
   python manage.py migrate
   ```
5. Create a superuser (Admin):
   ```bash
   python manage.py createsuperuser
   ```
6. Start the server:
   ```bash
   python manage.py runserver
   ```
   *The API will run at http://localhost:8000*

### Frontend Setup

1. Open a second terminal and navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The UI will run at http://localhost:5173*

## Deployment Instructions

### Backend (Django to Render/Railway)

1. Ensure `psycopg2-binary` and `gunicorn` are in your `requirements.txt`.
2. Install `dj-database-url` and `django-cors-headers`.
3. In `settings.py`, configure `DATABASES` to parse the `DATABASE_URL` environment variable.
4. Set `ALLOWED_HOSTS = ['*']` or specify your production domain.
5. Set `CORS_ALLOWED_ORIGINS` to include your frontend's production URL.
6. Push to GitHub and connect to your hosting provider.

### Frontend (React to Vercel/Netlify)

1. In your `frontend/src/services/api.js`, update the `baseURL` to point to your live Django API URL instead of `localhost:8000`. 
   *(Alternatively, use environment variables like `import.meta.env.VITE_API_URL`)*
2. Push your code to GitHub.
3. Import the repository into Vercel or Netlify.
4. The build command is `npm run build` and the output directory is `dist`.

## Final Polish & Optimizations

* **Lazy Loading**: Implemented `React.lazy()` and `<Suspense>` in `App.jsx` to drastically reduce the initial bundle size and improve load times.
* **Responsive Design**: Ensured all dashboards, grids, and the video learning sidebar are fully responsive on Mobile, Tablet, and Desktop.
* **Optimistic UI Updates**: Buttons like "Mark as Completed" instantly update the UI while syncing with the server in the background.
* **Loading States**: Introduced Skeleton loaders across the catalog to prevent UI pop-in.

---
*Built as a Full Stack LMS System.*
