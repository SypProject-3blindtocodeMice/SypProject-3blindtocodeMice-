import { Link, NavLink, useLocation } from 'react-router-dom'
import Logo from './logo'
import './navbar-style.css'

export default function NavBar() {
  const { pathname } = useLocation()
  const onBuilder = pathname.startsWith('/builder')

  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo" aria-label="FurnaView home">
        <Logo />
      </Link>

      <nav className="navbar-links" aria-label="Main">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/builder">Builder</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>

      {/*<div className="navbar-actions">*/}
      {/*  {!onBuilder && <Link to="/builder" className="btn btn-primary">Start building</Link>}*/}
      {/*</div>*/}
    </header>
  )
}
