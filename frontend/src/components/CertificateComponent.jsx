import React from 'react';

const CertificateComponent = React.forwardRef(({ certificate }, ref) => {
  if (!certificate) return null;

  return (
    <div 
      ref={ref}
      className="bg-white relative text-slate-800 flex flex-col items-center justify-between font-sans print:shadow-none overflow-hidden"
      style={{ 
        width: '1056px', 
        height: '816px', 
        boxSizing: 'border-box',
        padding: '60px'
      }}
    >
   
      <div className="absolute inset-0 m-[20px] border-[4px] border-slate-300 pointer-events-none"></div>
      <div className="absolute inset-0 m-[28px] border-[2px] border-primary pointer-events-none"></div>
      
    
      <div className="flex flex-col items-center mt-4">
        <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-extrabold shadow-lg mb-6">
          LMS
        </div>
        <h1 className="text-6xl font-serif text-slate-800 uppercase tracking-[0.15em] font-black text-center">
          Certificate of Completion
        </h1>
      </div>

   
      <div className="flex flex-col items-center w-full mt-2">
        <p className="text-2xl text-slate-500 italic font-serif mb-8">This is to proudly certify that</p>
        
        <h2 className="text-6xl font-extrabold text-primary border-b-[4px] border-slate-200 pb-4 mb-8 w-3/4 max-w-[800px] whitespace-nowrap overflow-hidden text-ellipsis px-8 text-center">
          {certificate.student_name}
        </h2>
        
        <p className="text-2xl text-slate-500 italic font-serif mb-8">has successfully completed the course</p>
        
        <h3 className="text-5xl font-bold text-slate-800 max-w-[850px] leading-tight text-center px-8 line-clamp-2">
          {certificate.course_title}
        </h3>
      </div>

   
      <div className="w-full flex justify-between items-end px-12 mb-4">
        
        <div className="flex flex-col items-center w-64">
          <div className="border-b-[3px] border-slate-400 w-full text-center pb-2 text-2xl font-bold text-slate-700">
            {new Date(certificate.issued_date).toLocaleDateString()}
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-3">Date</p>
        </div>
        
       
        <div className="flex flex-col items-center justify-center -mb-4">
          <div className="w-40 h-40 rounded-full border-[6px] border-primary/20 flex items-center justify-center bg-primary/5 shadow-inner relative">
            <div className="absolute inset-2 border-[2px] border-primary/30 rounded-full border-dashed"></div>
            <span className="text-xl font-black text-primary/80 uppercase tracking-widest rotate-[-15deg]">Verified</span>
          </div>
          <p className="text-xs text-slate-400 mt-4 font-mono font-medium">ID: {certificate.certificate_number}</p>
        </div>

   
        <div className="flex flex-col items-center w-64">
          <div className="border-b-[3px] border-slate-400 w-full text-center pb-2 font-signature text-4xl text-slate-700">
            Instructor
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-3">Signature</p>
        </div>
      </div>
    </div>
  );
});

CertificateComponent.displayName = 'CertificateComponent';
export default CertificateComponent;
