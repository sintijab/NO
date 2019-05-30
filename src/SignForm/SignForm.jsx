import React from 'react';
import { getCookie } from '../functions.js';
import { connect } from 'react-redux';
import { signInAction } from '../actions/signActions.js';

const Cosmic = require('cosmicjs')();


class SignForm extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: !!(getCookie('val')),
      email: '',
      password: '',
      message: null,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
        this.setState({
            [name]: value
        });
    }

  handleSubmit(event) {
    event.preventDefault();

    const { email, password } = this.state;
    Cosmic.authenticate({
      email: email,
      password: password,
    }).then(data => {
      console.log(data)
      this.setState({
        loggedIn: true,
        password: '',
        email: '',
      })
      this.props.signInAction(data, email);
    })
    .catch(err => {
      console.log(err)
      this.setState({
        loggedIn: false,
        message: err.message,
      })
    })
  }

  render() {
    const { loggedIn, email, password, message } = this.state;
    const signInMessageClassName = !loggedIn && !!message ? 'NO__warning' : loggedIn ? 'NO__success' : '';
      return (
        <div>
        {!loggedIn &&
          <form className='NO__signForm' onSubmit={this.handleSubmit}>
            <div className="NO__form-group">
              <input id="email" type="email" name="email" className="NO__form-control" placeholder="Email" value={email} onChange={this.handleChange}/>
            </div>
            <div className="NO__form-group">
              <input id="password" type="password" name="password" className="NO__form-control" placeholder="Password" value={password} onChange={this.handleChange}/>
              </div>
            <div className="NO__form-group">
              <button className="btn btn-info">Sign In</button>
            </div>
            {!!message && <div className="NO__form-group">
              <span className={signInMessageClassName}>{message}</span>
            </div>}
          </form>
        }
        </div>
      );
    }
  }

  const mapStateToProps = state => ({
    error: state.error,
   	signType: state.signInStatus.type,
    userData: state.signInStatus.uData,
  })

export default connect(mapStateToProps, { signInAction })(SignForm);
