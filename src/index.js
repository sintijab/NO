import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { BrowserRouter as Router, Route } from 'react-router-dom'
import configureStore from "./store"
import "./index.css"
import App from "./App"
import About from "./About/About"
import * as serviceWorker from "./serviceWorker"

ReactDOM.render(
  <Provider store={configureStore()}>
    <Router>
      <Route path="/" component={App} />
      <Route path="/about" component={About} />
    </Router>
  </Provider>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
