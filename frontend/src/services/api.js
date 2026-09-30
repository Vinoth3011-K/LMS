import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh');
                if (!refreshToken) throw new Error('No refresh token');
                
                const response = await axios.post('http://localhost:8000/api/auth/token/refresh/', {
                    refresh: refreshToken
                });
                
                localStorage.setItem('access', response.data.access);
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return api(originalRequest);
            } catch (err) {
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export const registerUser = (data) => api.post('/api/auth/register/', data);

export const getCourses = (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/api/courses/?${queryString}`);
};
export const getCourseDetails = (id) => api.get(`/api/courses/${id}/`);
export const enrollCourse = (id) => api.post(`/api/courses/${id}/enroll/`);
export const getMyCourses = () => api.get('/api/my-courses/');

export const createCourse = (data) => api.post('/api/courses/', data);
export const deleteCourse = (id) => api.delete(`/api/courses/${id}/`);

export const getModule = (id) => api.get(`/api/modules/${id}/`);
export const createModule = (data) => api.post('/api/modules/', data);
export const deleteModule = (id) => api.delete(`/api/modules/${id}/`);

export const createLesson = (data) => api.post('/api/lessons/', data);
export const deleteLesson = (id) => api.delete(`/api/lessons/${id}/`);

export const getQuiz = (id) => api.get(`/api/quizzes/${id}/`);
export const createQuiz = (data) => api.post('/api/quizzes/', data);
export const updateQuiz = (id, data) => api.put(`/api/quizzes/${id}/`, data);
export const deleteQuiz = (id) => api.delete(`/api/quizzes/${id}/`);

export const createQuestion = (data) => api.post('/api/questions/', data);
export const updateQuestion = (id, data) => api.put(`/api/questions/${id}/`, data);
export const deleteQuestion = (id) => api.delete(`/api/questions/${id}/`);

export const startQuiz = (id) => api.get(`/api/quizzes/${id}/start/`);
export const submitQuiz = (id, data) => api.post(`/api/quizzes/${id}/submit/`, data);
export const getMyResults = () => api.get('/api/my-results/');
export const getQuizAttempts = (id) => api.get(`/api/quizzes/${id}/attempts/`);

export const getAdminAnalytics = () => api.get('/api/admin/analytics/');
export const getInstructorAnalytics = () => api.get('/api/instructor/analytics/');
export const getStudentAnalytics = () => api.get('/api/student/analytics/');

export const getCertificates = () => api.get('/api/certificates/');
export const getCertificate = (id) => api.get(`/api/certificates/${id}/`);
export const generateCertificate = (course_id) => api.post('/api/certificates/generate/', { course_id });
export const verifyCertificate = (id) => api.get(`/api/certificates/verify/?id=${id}`);

export default api;
