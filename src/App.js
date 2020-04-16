import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Footer from './components/footer';
import Header from './components/header';
import Home from './components/home'
import Splash from './components/splash'
import Subheader from './components/sub-header';
import './App.css'

const App = ({ history }) => {
  return (
    <Router history={history}>
      <section className="app">
        <Header />
        <Subheader />
        <Switch>
          <Route exact path="/" component={Splash} />
          <Route path="*" component={Home} />
        </Switch>
        <Footer />
      </section>
    </Router>
  )
}

export default App
