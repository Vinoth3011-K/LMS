import api from './api';

export const getCourseProgress = (courseId) => api.get(`/api/courses/${courseId}/progress/`);
export const getMyProgress = () => api.get('/api/my-progress/');
export const markLessonComplete = (lessonId) => api.post(`/api/lessons/${lessonId}/complete/`);
export const removeLessonCompletion = (lessonId) => api.delete(`/api/lessons/${lessonId}/complete/`);
