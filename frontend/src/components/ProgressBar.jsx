const ProgressBar = ({ percentage, completed, total }) => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-800">{percentage}%</span>
                <span className="text-xs font-medium text-slate-500">
                    {completed} / {total} Lessons Completed
                </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div 
                    ref={(el) => { if(el) el.style.width = `${percentage || 0}%`; }}
                    className="progress-bar-fill progress-bar-primary"
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;
