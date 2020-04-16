import React from 'react'
import { useLocation } from 'react-router-dom'
import '../styles/header.css'

const Header = () => {
  if (useLocation().pathname === "/" ) return null
  
  return (
    <section className="header"> 
      <h4 className="wordCarousel">
        <div>
          <ul className="flip4"> 
            <li>COVID-19</li>
            <li>Coronavirus</li>
            <li>WuFlu</li> 
            <li>SARS-CoV-2</li>
          </ul>
        </div>
      </h4>
    </section>
  )
}

export default Header
