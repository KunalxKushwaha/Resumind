import { Link } from 'react-router'
import ScoreCircle from "~/components/ScoreCircle";

const ResumeCard = ({ resume }: { resume: Resume }) => {
  return (
    <Link
      to={`/resume/${resume.id}`}
      className='resume-card flex flex-col h-full animate-in fade-in duration-1000'
    >
      <div className='resume-card-header flex justify-between gap-4 min-h-[96px]'>
        <div className='flex flex-col gap-2'>
          <h2 className='!text-black font-bold break-words'>
            {resume.companyName}
          </h2>
          <h3 className='text-lg text-gray-500 break-words'>
            {resume.jobTitle}
          </h3>
        </div>

        <div className='shrink-0'>
          <ScoreCircle score={resume.feedback.overallScore} />
        </div>
      </div>

      <div className='gradient-border flex-1'>
        <img
          src={resume.imagePath}
          alt="resume"
          className='w-full h-full object-cover object-top'
        />
      </div>
    </Link>
  )
}

export default ResumeCard
