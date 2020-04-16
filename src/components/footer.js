import React from 'react' 
import { useLocation } from 'react-router-dom'
import '../styles/header.css'

const Footer = () => {
  if (useLocation().pathname === "/" ) return null

  return (
    <section className="footer">
      <img className="github" src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt=""></img>
      <p>data from <a href="https://github.com/nychealth/coronavirus-data" target="_blank">nychealth</a></p>
    </section>
  )
}

export default Footer
