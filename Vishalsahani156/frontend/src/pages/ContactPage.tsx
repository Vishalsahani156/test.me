import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { mockAboutData } from '../data/mockAboutData'
import { FaqSection } from '../components/contact/FaqSection'
import { ContactForm } from '../components/shared/ContactForm'

export function ContactPage() {
  const { isAuthenticated } = useAuth()
  const { contact } = mockAboutData

  return (
    <div className="about-page contact-page">
      <header className="about-nav">
        <div className="about-nav-inner">
          <Link to="/" className="about-brand">
            Career Toolkit
          </Link>

          <nav className="about-anchor-links">
            <Link to="/about" className="about-anchor-btn about-nav-link">
              About
            </Link>
            <Link to="/contact" className="about-anchor-btn about-nav-link about-nav-link--active">
              Contact
            </Link>
          </nav>

          <Link to={isAuthenticated ? '/dashboard' : '/login'} className="btn-secondary btn-sm btn-link">
            {isAuthenticated ? 'Go to app' : 'Sign in'}
          </Link>
        </div>
      </header>

      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Get in touch</h1>
          <p>We are here to help with product questions, support requests, and partnership ideas.</p>
        </div>
      </section>

      <main className="about-main">
        <div className="contact-page-grid">
          <ContactForm variant="full" idPrefix="page-contact" title="Contact form" />

          <aside className="contact-sidebar">
            <h2>Quick info</h2>
            <div className="contact-info-cards">
              <div className="contact-info-card">
                <strong>Email</strong>
                <span>{contact.email}</span>
              </div>
              <div className="contact-info-card">
                <strong>Phone</strong>
                <span>{contact.phone}</span>
              </div>
              <div className="contact-info-card">
                <strong>Address</strong>
                <span>{contact.address}</span>
              </div>
              <div className="contact-info-card">
                <strong>Hours</strong>
                <span>{contact.hours}</span>
              </div>
            </div>
            <p className="contact-sidebar-note">
              Logged-in users have name and email pre-filled automatically.
            </p>
          </aside>
        </div>

        <FaqSection />
      </main>

      <footer className="about-footer">
        <p>© {new Date().getFullYear()} Career Toolkit. All rights reserved.</p>
        <div className="about-footer-links">
          <Link to="/login">Sign in</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </footer>
    </div>
  )
}
