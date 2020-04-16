import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Compa from './compa'
import Compb from './compb'
import Compc from './compc'
import Compd from './compd'
import Compe from './compe'
import '../styles/home.css'

const Home = () => {
  return (
    <section className="comps">
      <Switch>
        <Route path="/(home|cases)" component={Compa} />
        <Route path="/(boro|boros|borough|boroughs)" component={Compb} />
        <Route path="/(age|ages)" component={Compc} />
        <Route path="/(zip|zcta)" component={Compd} />
        <Route path="/(sex|gender)" component={Compe} />
      </Switch>
    </section>
  )
}

export default Home
