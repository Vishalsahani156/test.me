import { Link } from 'react-router-dom'
import type { ContactInfo } from '../../types/about'
import { ContactForm } from '../shared/ContactForm'

interface ContactSectionProps {
  contact: ContactInfo
}

export function ContactSection({ contact }: ContactSectionProps) {
  return (
    <section id="contact" className="about-section">
      <h2>Contact Us</h2>
      <p className="about-section-lead">
        Questions, feedback, or partnership inquiries—we would love to hear from you.{' '}
        <Link to="/contact">Visit the full contact page →</Link>
      </p>

      <div className="contact-grid">
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

        <ContactForm variant="compact" idPrefix="about-contact" />
      </div>
    </section>
  )
}
