import React from "react"
import { NavLink, Outlet, useLocation, useNavigate, useParams } from "react-router"
import { useAuth } from "../features/auth/hooks/useAuth"

const AppShell = () => {
    const { loading, handleLogout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const { interviewId } = useParams()
    const isHomePage = location.pathname === "/"

    const handleUserLogout = async () => {
        await handleLogout()
        navigate("/login")
    }

    const navLinkClass = ({ isActive }) =>
        `app-nav-link${isActive ? " active" : ""}`

    return (
        <div className="app-shell">

            {/* ── Floating navbar ─────────────────────────── */}
            <div className="app-header-wrap animate-enter">
                <header className="app-header">

                    {/* Logo */}
                    <button type="button" className="app-logo-btn" onClick={() => navigate("/")}>
                        <span className="app-logo-orb">
                            <span className="app-logo-dot" />
                        </span>
                        <span className="app-logo-text">
                            <span className="app-logo-eyebrow">Final Year Project</span>
                            <span className="app-logo-name">Interview AI</span>
                        </span>
                    </button>

                    {/* Nav */}
                    <nav className="app-nav">
                        <NavLink to="/" end className={navLinkClass}>Home</NavLink>

                        {interviewId && (
                            <NavLink to={`/interview/${interviewId}`} className={navLinkClass}>
                                Current Report
                            </NavLink>
                        )}

                        <a href="#about" className="app-nav-link">About</a>

                        {!isHomePage && (
                            <button
                                type="button"
                                className="app-nav-link"
                                onClick={() => navigate("/")}
                            >
                                New Strategy
                            </button>
                        )}
                    </nav>

                    {/* Logout */}
                    <button
                        type="button"
                        className="button primary-button"
                        style={{ padding: "0.5rem 1.125rem", fontSize: "0.875rem" }}
                        onClick={handleUserLogout}
                        disabled={loading}
                    >
                        {loading ? "…" : "Logout"}
                    </button>
                </header>
            </div>

            {/* ── Page content ────────────────────────────── */}
            <div className="app-content animate-enter-delay-2">
                <Outlet />
            </div>
        </div>
    )
}

export default AppShell
