import React from 'react'
import { Route, HashRouter, Switch } from 'react-router-dom'
import Main from './components/Main'
import Signup from './components/Signup'

export default props => (
    <HashRouter>
   
        <Switch>
          <Route exact path='/' component={ Main } />
          <Route exact path='/signup' component={ Signup } />
        </Switch>

    </HashRouter>
  )