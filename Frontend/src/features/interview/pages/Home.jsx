import React, { useState, useRef } from 'react'
import "../style/home.css"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'

const Home = () => {
    const { loading, generateReport, reports } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [error, setError] = useState("")
    const [selectedFileName, setSelectedFileName] = useState("")
    const resumeInputRef = useRef()
    const navigate = useNavigate()

    const handleGenerateReport = async () => {
        setError("")
        if (!jobDescription.trim()) {
            setError("Job description is required. Please enter the target job description.")
            return
        }
        const resumeFile = resumeInputRef.current.files[0]
        if (!resumeFile && !selfDescription.trim()) {
            setError("Please either upload a resume or provide a self-description.")
            return
        }
        try {
            const data = await generateReport({ jobDescription, selfDescription, resumeFile })
            if (data) navigate(`/interview/${data._id}`)
        } catch (err) {
            setError(err.response?.data?.message || "Failed to generate interview report. Please try again.")
        }
    }

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0]
        if (file) setSelectedFileName(file.name)
    }

    if (loading) {
        return (
            <main className='loading-screen'>
                <div className='text-center space-y-3'>
                    <div className='mx-auto h-10 w-10 rounded-full border-2 border-brand border-t-transparent animate-spin' />
                    <h1 className='text-lg font-semibold text-slate-300'>Generating your interview plan…</h1>
                    <p className='text-sm text-slate-500'>This usually takes around 30 seconds</p>
                </div>
            </main>
        )
    }

    return (
        <div className='home-page'>

            {/* ── Hero ──────────────────────────────────────── */}
            <header className='page-header'>
                <div className='inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-semibold text-brand mb-4'>
                    <span className='h-1.5 w-1.5 rounded-full bg-brand animate-pulse' />
                    AI-Powered Interview Preparation
                </div>
                <h1>Ace Your Next Interview with a<br /><span className='highlight'>Personalized Strategy</span></h1>
                <p>Paste the job description and upload your resume. Our AI analyzes both to build a custom interview plan, complete with questions and a study roadmap.</p>
            </header>

            {/* ── Error ─────────────────────────────────────── */}
            {error && (
                <div className='mx-auto flex w-full max-w-5xl items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3.5 text-sm text-red-200 animate-enter-delay-1'>
                    <span className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white'>!</span>
                    <span>{error}</span>
                    <button onClick={() => setError("")} className='ml-auto text-red-300/60 hover:text-red-200 transition-colors'>✕</button>
                </div>
            )}

            {/* ── Form card ─────────────────────────────────── */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left panel — Job description */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                </svg>
                            </span>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <textarea
                            onChange={(e) => setJobDescription(e.target.value)}
                            value={jobDescription}
                            className='panel__textarea'
                            placeholder={`Paste the full job description here…\ne.g. "Senior Frontend Engineer at Stripe requires React, TypeScript, and system design experience…"`}
                            maxLength={5000}
                        />
                        <div className='char-counter'>{jobDescription.length} / 5000</div>
                    </div>

                    <div className='panel-divider' />

                    {/* Right panel — Profile */}
                    <div className='panel'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                            <h2>Your Profile</h2>
                        </div>

                        <div className='upload-section'>
                            <label className='section-label'>
                                Upload Resume
                                <span className='badge badge--best'>Best Results</span>
                            </label>
                            <label className='dropzone group' htmlFor='resume'>
                                <span className='dropzone__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="16 16 12 12 8 16" />
                                        <line x1="12" y1="12" x2="12" y2="21" />
                                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                                    </svg>
                                </span>
                                {selectedFileName ? (
                                    <>
                                        <p className='dropzone__title'>{selectedFileName}</p>
                                        <p className='dropzone__subtitle'>Click to replace</p>
                                    </>
                                ) : (
                                    <>
                                        <p className='dropzone__title'>Click to upload or drag & drop</p>
                                        <p className='dropzone__subtitle'>PDF or DOCX · Max 5 MB</p>
                                    </>
                                )}
                                <input ref={resumeInputRef} onChange={handleFileSelect} hidden type='file' id='resume' name='resume' accept='.pdf,.docx' />
                            </label>
                        </div>

                        <div className='or-divider'><span>or</span></div>

                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                            <textarea
                                onChange={(e) => setSelfDescription(e.target.value)}
                                id='selfDescription'
                                name='selfDescription'
                                value={selfDescription}
                                className='panel__textarea panel__textarea--short'
                                placeholder="Briefly describe your skills, experience level, and tech stack if you don't have a resume handy…"
                            />
                        </div>

                        <div className='info-box'>
                            <span className='info-box__icon'>i</span>
                            <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate your personalized plan.</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className='interview-card__footer'>
                    <span className='footer-info'>⚡ AI-Powered · Approx 30 seconds</span>
                    <button onClick={handleGenerateReport} disabled={loading} className='generate-btn'>
                        {loading ? 'Generating…' : 'Generate My Interview Strategy →'}
                    </button>
                </div>
            </div>

            {/* ── Recent reports ─────────────────────────────── */}
            {reports.length > 0 && (
                <section className='space-y-5 animate-enter-delay-2'>
                    <div>
                        <h2 className='text-2xl font-black text-white'>Recent Plans</h2>
                        <p className='mt-1 text-sm text-slate-400'>Continue where you left off.</p>
                    </div>
                    <ul className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                        {reports.map(report => (
                            <li
                                key={report._id}
                                className='report-item hover-lift'
                                onClick={() => navigate(`/interview/${report._id}`)}
                            >
                                <div className='flex items-start justify-between gap-3'>
                                    <h3 className='line-clamp-2 flex-1'>{report.title || 'Untitled Position'}</h3>
                                    <span className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold ring-1 ${
                                        report.matchScore >= 80
                                            ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30'
                                            : report.matchScore >= 60
                                            ? 'bg-amber-500/15 text-amber-300 ring-amber-500/30'
                                            : 'bg-rose-500/15 text-rose-300 ring-rose-500/30'
                                    }`}>
                                        {report.matchScore}%
                                    </span>
                                </div>
                                <p className='report-meta'>Generated {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className='mt-3 text-xs leading-5 text-slate-500'>
                                    Open to review questions, preparation roadmap, and your tailored resume.
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* ── Footer ─────────────────────────────────── */}
            <footer className='page-footer'>
                <a href='#'>Privacy Policy</a>
                <a href='#'>Terms of Service</a>
                <a href='#'>Help Center</a>
            </footer>
        </div>
    )
}

export default Home