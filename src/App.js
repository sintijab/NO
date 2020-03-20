import React from 'react'
import './App.scss'
import { connect } from 'react-redux'
import Welcome from './Welcome/Welcome'

const App = () => (
  <div className='App'>
    <Welcome />
  </div>
)
export default connect()(App)
