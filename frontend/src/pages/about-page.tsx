import { Link } from 'react-router-dom'
import Footer from '../components/layout/footer'
import './about-style.css'

export default function AboutPage() {
  return (
    <div className="about">
      <section className="container about-inner">
        <span className="eyebrow">About</span>
        <h1>About FurnaView</h1>
        <p>
          FurnaView is a school team project: a browser-based 3D room planner. You build a room
          wall by wall with real measurements and see the result instantly in 3D.
        </p>
        <p>
          The frontend is built with React, TypeScript, Vite and Three.js. A .NET API stores the walls.
        </p>
        {/*<div>*/}
        {/*  <Link to="/builder" className="btn btn-primary">Try the builder</Link>*/}
        {/*</div>*/}
      </section>
      <Footer />
    </div>
  )
}
