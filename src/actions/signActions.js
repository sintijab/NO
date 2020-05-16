import { LOGGED_IN, LOGGED_OUT } from './types'
import { setCookie, eraseCookie, getCookie } from '../functions'

export const signInAction = () => (dispatch) => {
  const Cosmic = require('cosmicjs')() //eslint-disable-line
  Cosmic.authenticate({
    email: process.env.UNAME,
    password: process.env.UPW,
  }).then((data) => {
    setCookie('val', data.token, 1)
    setCookie('uId', process.env.UNAME, 1)
    const userData = {
      email: process.env.UNAME,
      token: data.token,
    }
    dispatch({
      type: LOGGED_IN,
      payload: userData,
    })
  })
    .catch((err) => {
      console.error(err)
    })
}

export const signOutAction = () => (dispatch) => {
  eraseCookie('val')
  dispatch({
    type: LOGGED_OUT,
  })
}

export const signStatusAction = () => (dispatch) => {
  const hasLoggedIn = !!getCookie('val')
  const userId = getCookie('uId')
  const userData = {
    uEmail: userId,
  }

  if (hasLoggedIn) {
    dispatch({
      type: LOGGED_IN,
      payload: userData,
    })
  } else {
    dispatch({
      type: LOGGED_OUT,
    })
  }
}
