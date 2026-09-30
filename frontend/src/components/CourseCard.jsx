import { Link } from 'react-router-dom';
import { Clock, BarChart } from 'lucide-react';

const CourseCard = ({ course }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all flex flex-col">
            <div className="h-48 w-full bg-slate-200 relative">
                {(course.thumbnail_url || course.thumbnail) ? (
                    <img src={course.thumbnail_url || course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                        <span className="text-sm font-semibold">No Image Available</span>
                    </div>
                )}
                <span className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-semibold text-primary shadow">
                    {course.category}
                </span>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-xl text-slate-800 mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-slate-500 mb-4 flex-grow">By {course.instructor_name}</p>
                
                <div className="flex items-center justify-between text-sm text-slate-600 mb-6">
                    <div className="flex items-center space-x-1">
                        <BarChart size={16} />
                        <span className="capitalize">{course.difficulty_level}</span>
                    </div>


                    <div className="flex items-center space-x-1">
                        <Clock size={16} />
                        <span>{course.duration} mins</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-lg text-slate-800">
                        {course.price > 0 ? `$${course.price}` : 'Free'}
                    </span>
                    <Link to={`/courses/${course.id}`} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors font-medium">
                        View Details
                    </Link>
                </div>

                
            </div>
        </div>
    );
};

export default CourseCard;
