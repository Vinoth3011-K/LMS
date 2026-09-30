import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CourseCatalog = lazy(() => import('./pages/CourseCatalog'));
const CourseDetails = lazy(() => import('./pages/CourseDetails'));
const MyCourses = lazy(() => import('./pages/MyCourses'));
const LearningPage = lazy(() => import('./pages/LearningPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const QuizResult = lazy(() => import('./pages/QuizResult'));
const MyResults = lazy(() => import('./pages/MyResults'));
const InstructorDashboard = lazy(() => import('./pages/instructor/InstructorDashboard'));
const ManageCourses = lazy(() => import('./pages/instructor/ManageCourses'));
const CreateCourse = lazy(() => import('./pages/instructor/CreateCourse'));
const ManageModules = lazy(() => import('./pages/instructor/ManageModules'));
const ManageLessons = lazy(() => import('./pages/instructor/ManageLessons'));
const QuizManagement = lazy(() => import('./pages/instructor/QuizManagement'));
const CreateQuiz = lazy(() => import('./pages/instructor/CreateQuiz'));
const ManageQuestions = lazy(() => import('./pages/instructor/ManageQuestions'));
const QuizResults = lazy(() => import('./pages/instructor/QuizResults'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminCourses = lazy(() => import('./pages/admin/AdminCourses'));
const AdminCertificates = lazy(() => import('./pages/admin/AdminCertificates'));
const MyCertificates = lazy(() => import('./pages/MyCertificates'));
const CertificateView = lazy(() => import('./pages/CertificateView'));
const VerifyCertificate = lazy(() => import('./pages/VerifyCertificate'));

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
      <div className="font-inter bg-background min-h-screen text-slate-800">
        <Navbar />

        <main className="max-w-7xl mx-auto p-4">
          <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>}>
            <Routes>
              <Route path="/" element={
                <div className="text-center py-24">
                  <h2 className="text-5xl font-extrabold mb-6 tracking-tight">Master New Skills Today</h2>
                  <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">Join millions of learners on the most premium platform for modern education.</p>
                  <Link to="/catalog" className="bg-primary text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-secondary transition-all shadow-lg hover:-translate-y-1 inline-block">
                    Browse Courses
                  </Link>
                </div>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/catalog" element={<CourseCatalog />} />
              <Route path="/courses/:id" element={<CourseDetails />} />
              
                
              <Route path="/my-courses" element={<ProtectedRoute roles={['STUDENT', 'ADMIN', 'INSTRUCTOR']}><MyCourses /></ProtectedRoute>} />
              <Route path="/courses/:id/learn" element={<ProtectedRoute roles={['STUDENT', 'ADMIN', 'INSTRUCTOR']}><LearningPage /></ProtectedRoute>} />
              <Route path="/quizzes/:id" element={<ProtectedRoute roles={['STUDENT', 'ADMIN', 'INSTRUCTOR']}><QuizPage /></ProtectedRoute>} />
              <Route path="/quizzes/results/:id" element={<ProtectedRoute roles={['STUDENT', 'ADMIN', 'INSTRUCTOR']}><QuizResult /></ProtectedRoute>} />
              <Route path="/my-results" element={<ProtectedRoute roles={['STUDENT', 'ADMIN', 'INSTRUCTOR']}><MyResults /></ProtectedRoute>} />
              <Route path="/my-certificates" element={<ProtectedRoute roles={['STUDENT', 'ADMIN', 'INSTRUCTOR']}><MyCertificates /></ProtectedRoute>} />
              <Route path="/certificates/:id" element={<ProtectedRoute roles={['STUDENT', 'ADMIN', 'INSTRUCTOR']}><CertificateView /></ProtectedRoute>} />
              <Route path="/verify" element={<VerifyCertificate />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                
              <Route path="/instructor" element={<ProtectedRoute roles={['INSTRUCTOR', 'ADMIN']}><InstructorDashboard /></ProtectedRoute>} />
              <Route path="/instructor/courses" element={<ProtectedRoute roles={['INSTRUCTOR', 'ADMIN']}><ManageCourses /></ProtectedRoute>} />
              <Route path="/instructor/courses/create" element={<ProtectedRoute roles={['INSTRUCTOR', 'ADMIN']}><CreateCourse /></ProtectedRoute>} />
              <Route path="/instructor/courses/:courseId/modules" element={<ProtectedRoute roles={['INSTRUCTOR', 'ADMIN']}><ManageModules /></ProtectedRoute>} />
              <Route path="/instructor/modules/:moduleId/lessons" element={<ProtectedRoute roles={['INSTRUCTOR', 'ADMIN']}><ManageLessons /></ProtectedRoute>} />
              

              <Route path="/instructor/quizzes" element={<ProtectedRoute roles={['INSTRUCTOR', 'ADMIN']}><QuizManagement /></ProtectedRoute>} />
              <Route path="/instructor/courses/:courseId/quizzes" element={<ProtectedRoute roles={['INSTRUCTOR', 'ADMIN']}><QuizManagement /></ProtectedRoute>} />
              <Route path="/instructor/quizzes/create" element={<ProtectedRoute roles={['INSTRUCTOR', 'ADMIN']}><CreateQuiz /></ProtectedRoute>} />
              <Route path="/instructor/quizzes/:quizId/questions" element={<ProtectedRoute roles={['INSTRUCTOR', 'ADMIN']}><ManageQuestions /></ProtectedRoute>} />
              <Route path="/instructor/quizzes/:quizId/results" element={<ProtectedRoute roles={['INSTRUCTOR', 'ADMIN']}><QuizResults /></ProtectedRoute>} />
              
              <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute roles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/courses" element={<ProtectedRoute roles={['ADMIN']}><AdminCourses /></ProtectedRoute>} />
              <Route path="/admin/certificates" element={<ProtectedRoute roles={['ADMIN']}><AdminCertificates /></ProtectedRoute>} />
            </Routes>
          </Suspense>
        </main>
      </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
