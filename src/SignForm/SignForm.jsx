import React from 'react'
import { connect } from 'react-redux'
import { getCookie } from '../functions'
import { signInAction } from '../actions/signActions'

const Cosmic = require('cosmicjs')()

class SignForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: !!(getCookie('val')),
      email: '',
      password: '',
      message: null,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    const { target } = event
    const { value, name } = target
    this.setState({
      [name]: value,
    })
  }

  handleSubmit(event) {
    event.preventDefault()

    const { email, password } = this.state
    Cosmic.authenticate({
      email,
      password,
    }).then((data) => {
      this.setState({
        loggedIn: true,
        password: '',
        email: '',
      })
      // eslint-disable-next-line
      this.props.signInAction(data, email)
    })
      .catch((err) => {
        this.setState({
          loggedIn: false,
          message: err.message,
        })
      })
  }

  render() {
    const {
      loggedIn,
      email,
      password,
      message,
    } = this.state
    let signInMessageClassName = ''
    if (!loggedIn && !!message) {
      signInMessageClassName = 'NO__warning'
    } else if (loggedIn) {
      signInMessageClassName = 'NO__success'
    }
    return (
      <div>
        {!loggedIn
          && (
          <form className='NO__signForm' onSubmit={this.handleSubmit}>
            <div className='NO__form-group'>
              <input
                id='email'
                type='email'
                name='email'
                className='NO__form-control'
                placeholder='Email'
                value={email}
                onChange={this.handleChange}
              />
            </div>
            <div className='NO__form-group'>
              <input
                id='password'
                type='password'
                name='password'
                className='NO__form-control'
                placeholder='Password'
                value={password}
                onChange={this.handleChange}
              />
            </div>
            <div className='NO__form-group'>
              <button className='btn btn-info' type='submit'>Sign In</button>
            </div>
            {!!message
              && (
                <div className='NO__form-group'>
                  <span className={signInMessageClassName}>{message}</span>
                </div>
              )}
          </form>
          )}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  error: state.error,
  signType: state.signInStatus.type,
  userData: state.signInStatus.uData,
})

export default connect(mapStateToProps, { signInAction })(SignForm)
