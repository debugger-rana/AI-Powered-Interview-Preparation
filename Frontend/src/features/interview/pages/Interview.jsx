import React, { useState, useEffect } from 'react'
import '../style/interview.css'
import { useInterview } from '../hooks/useInterview.js'
import { useParams } from 'react-router'

const NAV_ITEMS = [
    {
        id: 'technical', label: 'Technical', count: null,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
        )
    }, 
    {
        id: 'behavioral', label: 'Behavioral', count: null,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        )
    },
    {
        id: 'roadmap', label: 'Road Map', count: null,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
        )
    },
]

// ── Question Card ─────────────────────────────────────────────────────────────

const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)

    return (
        <div className="qc">
            {/* Question row */}
            <button className="qc__header" onClick={() => setOpen(o => !o)}>
                <span className="qc__num">Q{index + 1}</span>
                <p className="qc__question">{item.question}</p>
                <span className={`qc__toggle ${open ? 'qc__toggle--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </span>
            </button>

            {/* Expanded answer panel */}
            {open && (
                <div className="qc__body">
                    {/* Why they ask */}
                    <div className="qc__block qc__block--why">
                        <div className="qc__block-label">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            Why they ask this
                        </div>
                        <p className="qc__block-text">{item.intention}</p>
                    </div>

                    {/* Model answer */}
                    <div className="qc__block qc__block--answer">
                        <div className="qc__block-label">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            How to answer
                        </div>
                        <p className="qc__block-text">{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

// ── Roadmap Day ───────────────────────────────────────────────────────────────

const RoadMapDay = ({ day, isLast }) => (
    <div className="rm-day">
        <div className="rm-day__timeline">
            <div className="rm-day__dot" />
            {!isLast && <div className="rm-day__line" />}
        </div>
        <div className="rm-day__content">
            <div className="rm-day__header">
                <span className="rm-day__badge">Day {day.day}</span>
                <h3 className="rm-day__focus">{day.focus}</h3>
            </div>
            <ul className="rm-day__tasks">
                {day.tasks.map((task, i) => (
                    <li key={i} className="rm-day__task">
                        <span className="rm-day__check">✓</span>
                        <span>{task}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────

const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if (interviewId) getReportById(interviewId)
    }, [interviewId])

    if (loading || !report) {
        return (
            <main className="loading-screen">
                <div style={{ textAlign: 'center' }}>
                    <div className="spinner" />
                    <p style={{ marginTop: '1rem', color: 'rgba(148,163,184,0.8)', fontSize: '0.9375rem' }}>
                        Loading your interview plan…
                    </p>
                </div>
            </main>
        )
    }

    const scoreColor =
        report.matchScore >= 80 ? 'score--high' :
        report.matchScore >= 60 ? 'score--mid' : 'score--low'

    // attach counts to nav items
    const navWithCounts = NAV_ITEMS.map(n => ({
        ...n,
        count: n.id === 'technical' ? report.technicalQuestions.length
             : n.id === 'behavioral' ? report.behavioralQuestions.length
             : report.preparationPlan.length
    }))

    return (
        <div className="interview-page">
            <div className="interview-layout">

                {/* ── Left nav ──────────────────────────────── */}
                <nav className="interview-nav">
                    <p className="interview-nav__label">Sections</p>

                    {navWithCounts.map(item => (
                        <button
                            key={item.id}
                            className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                            onClick={() => setActiveNav(item.id)}
                        >
                            <span className="interview-nav__icon">{item.icon}</span>
                            <span style={{ flex: 1 }}>{item.label}</span>
                            <span className="interview-nav__count">{item.count}</span>
                        </button>
                    ))}

                    <div className="interview-nav__footer">
                        <button
                            onClick={() => getResumePdf(interviewId)}
                            className="button primary-button"
                            style={{ width: '100%', padding: '0.625rem', fontSize: '0.8125rem' }}
                        >
                            ↓ Download Resume
                        </button>
                    </div>
                </nav>

                {/* ── Content ───────────────────────────────── */}
                <main className="interview-content">

                    {/* Technical */}
                    {activeNav === 'technical' && (
                        <section>
                            <div className="content-header">
                                <h2>Technical Questions</h2>
                                <span className="content-header__count">{report.technicalQuestions.length} questions</span>
                            </div>
                            <div className="q-list">
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Behavioral */}
                    {activeNav === 'behavioral' && (
                        <section>
                            <div className="content-header">
                                <h2>Behavioral Questions</h2>
                                <span className="content-header__count">{report.behavioralQuestions.length} questions</span>
                            </div>
                            <div className="q-list">
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Roadmap */}
                    {activeNav === 'roadmap' && (
                        <section>
                            <div className="content-header">
                                <h2>Preparation Road Map</h2>
                                <span className="content-header__count">{report.preparationPlan.length}-day plan</span>
                            </div>
                            <div className="rm-list">
                                {report.preparationPlan.map((day, i) => (
                                    <RoadMapDay
                                        key={day.day}
                                        day={day}
                                        isLast={i === report.preparationPlan.length - 1}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                {/* ── Sidebar ────────────────────────────────── */}
                <aside className="interview-sidebar">
                    {/* Score */}
                    <div>
                        <p className="match-score__label">Match Score</p>
                        <div className={`match-score__ring ${scoreColor}`}>
                            <span className="match-score__value">{report.matchScore}</span>
                            <span className="match-score__pct">%</span>
                        </div>
                        <p className="match-score__sub">
                            {report.matchScore >= 85 ? '🎯 Strong match' :
                             report.matchScore >= 60 ? '📈 Good — a few gaps' :
                             '⚡ Some work needed'}
                        </p>
                    </div>

                    <div className="sidebar-divider" />

                    {/* Stats */}
                    <div className="sidebar-stats">
                        <div className="sidebar-stat">
                            <span className="sidebar-stat__num">{report.technicalQuestions.length}</span>
                            <span className="sidebar-stat__label">Technical Qs</span>
                        </div>
                        <div className="sidebar-stat">
                            <span className="sidebar-stat__num">{report.behavioralQuestions.length}</span>
                            <span className="sidebar-stat__label">Behavioral Qs</span>
                        </div>
                        <div className="sidebar-stat">
                            <span className="sidebar-stat__num">{report.preparationPlan.length}</span>
                            <span className="sidebar-stat__label">Day Plan</span>
                        </div>
                    </div>

                    <div className="sidebar-divider" />

                    {/* Skill gaps */}
                    <div>
                        <p className="skill-gaps__label">Skill Gaps to Close</p>
                        <div className="skill-gaps__list">
                            {report.skillGaps.map((gap, i) => (
                                <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default Interview