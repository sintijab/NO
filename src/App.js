import React from 'react'
import './App.scss'
import { connect } from 'react-redux'
import Wrapper from './Wrapper/Wrapper'

const App = () => (
  <div className='App'>
    <Wrapper />
  </div>
)
export default connect()(App)
