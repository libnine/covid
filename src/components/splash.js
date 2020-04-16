import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/splash.css'

const Splash = () => {
  return (
    <section className="splash">
      <Link to="/home" className="imgLink">
        <img className="zs" src={require("../assets/images/zs.gif")} alt="" />
        <img className="snoopy" src={require("../assets/images/snoopy.png")} alt="" />
        <h3>a covid-19 state of mind</h3>
      </Link>
    </section>
  )
}

export default Splash
