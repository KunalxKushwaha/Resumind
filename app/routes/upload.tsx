import React, { useState, type FormEvent } from 'react'
import FileUploader from '~/components/FileUploader';
import Navbar from '~/components/Navbar'

const Upload = () => {

    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;
        const formData = new FormData(form);

        const comapnyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

       console.log({comapnyName, jobTitle, jobDescription, file});
    }
    
  return (
   <main className="bg-[url('/images/bg-main.svg')] bg-cover">

    <Navbar />

    <section className="main-section">
        <div className='page-heading py-16'>
            <h1>Smart Feedback for your Dream Job.</h1>
            {isProcessing ? (
                <>
                <h2>{statusText}</h2>
                <img src="/images/resume-scan.gif"  className='mx-auto w-[70%] sm:w-[50%] md:w-[40%] max-w-[360px] h-auto' />
                </>
            ): (
                <h2>Drop your Resume for an ATS score and Improvement Tips..</h2>
            )}

            {!isProcessing && (
                <form id='upload-form' onSubmit={handleSubmit} className='flex flex-col gap-4 mt-8'>
                    <div className='form-div'>
                        <label htmlFor="company-name">Company Name</label>
                        <input type="text" name='company-name' placeholder='Company Name' id='company-name' />
                    </div>
                    <div className='form-div'>
                        <label htmlFor="jobb-title">Job Title</label>
                        <input type="text" name='job-title' placeholder='Job Title' id='job-title' />
                    </div>
                    <div className='form-div'>
                        <label htmlFor="job-description">Job Description</label>
                        <textarea rows={5}name='job-description' placeholder='Job Description' id='job-description' />
                    </div>
                    <div className='form-div'>
                        <label htmlFor="uploader">Upload Resume</label>
                        <FileUploader onFileSelect={handleFileSelect}/>
                    
                    </div>
                     <button className='primary-button' type='submit'>Analyze Resume</button>
                    
                </form>
            )}

        </div>
    </section>
    </main>
  )
}

export default Upload
