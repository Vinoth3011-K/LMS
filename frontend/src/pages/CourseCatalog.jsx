import { useState, useEffect } from 'react';
import { getCourses } from '../services/api';
import CourseCard from '../components/CourseCard';
import { Search, Filter } from 'lucide-react';

const CourseCatalog = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    
    
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
       
        const timeoutId = setTimeout(() => {
            fetchCourses();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, category, difficulty]);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (category) params.category = category;
            if (difficulty) params.difficulty = difficulty;
            
            const { data } = await getCourses(params);
            if (data && data.results) {
                setCourses(data.results);
            } else if (Array.isArray(data)) {
                setCourses(data);
            } else {
                setCourses([]);
            }
        } catch (err) {
            console.error('Error fetching courses', err);
            if (err.response?.status === 401) {
                setError('You need to log in to view premium courses.');
            } else {
                setError('Failed to fetch courses. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 p-4">
            <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Explore Courses</h1>
            <p className="text-lg text-slate-500 mb-8">Discover your next skill from our wide range of courses.</p>

            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search for courses..." 
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <select 
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-700 cursor-pointer w-full"
                        >
                            <option value="">All Categories</option>
                            <option value="Programming">Programming</option>
                            <option value="Design">Design</option>
                            <option value="Business">Business</option>
                            <option value="Marketing">Marketing</option>
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>

                    <div className="relative w-full sm:w-auto">
                        <select 
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-700 cursor-pointer w-full"
                        >
                            <option value="">All Levels</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center font-medium">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1,2,3,4].map(n => (
                        <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-100 shadow-sm flex flex-col">
                            <div className="h-40 bg-slate-200 rounded-t-2xl"></div>
                            <div className="p-5 flex-1 flex flex-col gap-3">
                                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                                <div className="h-4 bg-slate-200 rounded w-full mt-auto"></div>
                            </div>
                        </div>
                    ))}

                    
                </div>
            ) : courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}


                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <Search className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-slate-800">No courses found</h3>
                    <p className="text-slate-500 mt-2">Try adjusting your search or filters to find what you're looking for.</p>
                </div>
            )}
        </div>
    );
};

export default CourseCatalog;
