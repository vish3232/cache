import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from './components/pages/Home'
import Loading from './components/pages/Loading'
import ProtectedRoutes from './components/pages/ProtectedRoutes'
import Socialauth from './components/pages/Socialauth'

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Loading} />
        <ProtectedRoutes exact path='/home' component={Home} />
        <ProtectedRoutes exact path="/auth" component={Socialauth} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
