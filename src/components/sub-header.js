import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/header.css'

const Subheader = () => {
  if (useLocation().pathname === "/" ) return null

  return (
    <section className="subheader">
      <span className="brackets">[</span>
        <nav className="cl-effect-9">
          <Link to="/cases"><span>Cases</span><span>By Date</span></Link>
          <Link to="/boro"><span>Boroughs</span><span>By Borough</span></Link>
          <Link to="/age"><span>Age</span><span>By Age Group</span></Link>
          <Link to="/zip"><span>Zip</span><span>By Zip Code</span></Link>
          {/* <Link to="/sex"><span>Sex</span><span>By Sex</span></Link> */}
        </nav>
      <span className="brackets">]</span>
    </section>
  )
}

export default Subheader
