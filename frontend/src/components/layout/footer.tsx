import { Link } from 'react-router-dom'
import Logo from './logo'
import './footer-style.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Logo size="sm" />
          <p>Plan your room in 3D, wall by wall.</p>
        </div>

        <nav className="footer-links" aria-label="Footer">
          <Link to="/">Home</Link>
          <Link to="/builder">Builder</Link>
          <Link to="/about">About</Link>
        </nav>

        <p className="footer-meta">Made by 3BlindToCodeMice · {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}
