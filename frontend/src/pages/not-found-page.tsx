import { Link } from 'react-router-dom'
import './about-style.css'

export default function NotFoundPage() {
  return (
    <div className="about">
      <section className="container about-inner">
        <span className="eyebrow">404</span>
        <h1>This page doesn't exist</h1>
        <p>The link may be broken, or the page was moved.</p>
        <div>
          <Link to="/" className="btn btn-primary">Back to home</Link>
        </div>
      </section>
    </div>
  )
}
