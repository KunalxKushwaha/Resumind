import { useEffect, useState } from 'react';
import { Link } from 'react-router'
import ScoreCircle from "~/components/ScoreCircle";
import { usePuterStore } from '~/lib/puter';

const ResumeCard = ({ resume }: { resume: Resume }) => {
   const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');

    useEffect(() => {
        const loadResume = async () => {
            const blob = await fs.read(resume.imagePath);
            if(!blob) return;
            let url = URL.createObjectURL(blob);
            setResumeUrl(url);
        }

        loadResume();
    }, [resume.imagePath]);


  return (
    <Link
      to={`/resume/${resume.id}`}
      className='resume-card flex flex-col h-full animate-in fade-in duration-1000'
    >
      <div className='resume-card-header flex justify-between gap-4 min-h-[96px]'>
        <div className='flex flex-col gap-2'>

          {resume.companyName && <h2 className='!text-black font-bold break-words'>
            {resume.companyName}
          </h2>}

          {resume.jobTitle && <h3 className='text-lg text-gray-500 break-words'>
            {resume.jobTitle}
          </h3>}

          {!resume.companyName && !resume.jobTitle && <h2 className="!text-black font-bold">Resume</h2>}

        </div>

        <div className='flex-shrink-0'>
          <ScoreCircle score={resume.feedback.overallScore} />
        </div>
      </div>

      {resumeUrl && (
        <div className='gradient-border flex-1'>
        <img
          src={resumeUrl}
          alt="resume"
          className='w-full h-full object-cover object-top'
        />
      </div>
      )}

      
    </Link>
  )
}

export default ResumeCard
