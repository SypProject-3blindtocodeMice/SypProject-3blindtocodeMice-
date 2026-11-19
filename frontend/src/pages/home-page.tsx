import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/layout/footer'
import './home-style.css'

const RoomPreview = lazy(() => import('../components/home/room-preview'))

const steps = [
  { title: 'Add a wall', text: 'Give it a name and set its start and end point, height and thickness in metres.' },
  { title: 'Shape it', text: 'Move it with the arrow keys, turn it, tilt it, or type exact values into the form.' },
  { title: 'Connect it', text: 'Join wall endpoints together so connected walls move as one.' },
]

const features = [
  { icon: 'M4 20h16M6 16l6-12 6 12', title: 'Exact measurements', text: 'Every wall is defined in real metres, so what you see matches the real room.' },
  { icon: 'M12 3v18M3 12h18', title: 'Keyboard control', text: 'Arrow keys move a wall in 0.25 m steps. Hold Shift to turn or tilt it.' },
  { icon: 'M8 12h8M5 8a4 4 0 0 0 0 8M19 8a4 4 0 0 1 0 8', title: 'Connected walls', text: 'Link endpoints so corners stay together while you rearrange the room.' },
  { icon: 'M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0M12 7v5l3 2', title: 'Live 3D view', text: 'Orbit, pan and zoom around your layout while you build it.' },
]

export default function HomePage() {
  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="eyebrow">3D room planner</span>
            <h1>Plan your room in 3D, wall by wall.</h1>
            <p className="hero-lead">
              FurnaView lets you sketch a room with real measurements and see it in 3D right away.
              No installs, no CAD skills needed.
            </p>
            <div className="hero-actions">
              <Link to="/builder" className="btn btn-primary btn-lg">Start building</Link>
              <a href="#how-it-works" className="btn btn-lg">How it works</a>
            </div>
          </div>

          <div className="hero-preview">
            <Suspense fallback={<div className="hero-preview-fallback" />}>
              <RoomPreview />
            </Suspense>
            <span className="hero-preview-badge">Live preview</span>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How it works</span>
            <h2>From empty grid to room in three steps</h2>
          </div>
          <ol className="steps">
            {steps.map((step, index) => (
              <li key={step.title} className="step" >
                <span className="step-number">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Features</span>
            <h2>Everything you need to block out a room</h2>
          </div>
          <div className="features">
            {features.map((feature) => (
              <article key={feature.title} className="feature">
                <span className="feature-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={feature.icon} />
                  </svg>
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta">
            <h2>Ready to build your first wall?</h2>
            <p>Open the builder and start with an empty grid.</p>
            <Link to="/builder" className="btn btn-primary btn-lg">Open the builder</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
