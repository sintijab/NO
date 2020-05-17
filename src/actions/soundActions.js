import {
  FETCH_SC_SUCCESS,
  FETCH_SC_ERROR,
  FETCH_SC_TRACKS_SUCCESS,
  FETCH_SC_TRACKS_ERROR,
  SOUND_STARTED,
  SOUND_FINISHED,
  SET_SOUND_SRC,
} from './types'

import SC from '../sc'

export const fetchSCCollection = (url) => (dispatch) => {
  const startIndex = url.indexOf('soundcloud.com/') + 'soundcloud.com/'.length

  let modifiedLink = url.slice(startIndex, url.length) //eslint-disable-line
  let author = modifiedLink.slice(0, modifiedLink.indexOf('/')) //eslint-disable-line
  SC.init({
    clientId: process.env.SC_CLIENT,
    cors: true,
  })
  SC.get('search', {
    q: author,
  }).then((result) => dispatch({
    type: FETCH_SC_SUCCESS,
    payload: result.collection,
  })).catch((err) => dispatch({
    type: FETCH_SC_ERROR,
    payload: err,
  }))
}

export const getSCMusic = (id) => (dispatch) => {
  const urlParams = `users/${id}/tracks`
  SC.get(urlParams).then((result) => dispatch({
    type: FETCH_SC_TRACKS_SUCCESS,
    payload: result.collection,
  })).catch((err) => dispatch({
    type: FETCH_SC_TRACKS_ERROR,
    payload: err,
  }))
}

export const soundStartedAction = () => (dispatch) => {
  dispatch({
    type: SOUND_STARTED,
  })
}

export const soundFinishedAction = () => (dispatch) => {
  dispatch({
    type: SOUND_FINISHED,
  })
}

export const setAudioSource = (url) => (dispatch) => {
  dispatch({
    type: SET_SOUND_SRC,
    payload: url,
  })
}
