import React from "react"
import "./App.css"
import Welcome from "./Welcome/Welcome"
import { connect } from "react-redux"

function App() {
  return (
    <div className="App">
      <Welcome />
    </div>
  )
}

export default connect()(App)
