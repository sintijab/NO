import axios from 'axios'
import { getCookie } from '../functions'

import {
  FETCH_POSTS_ERROR,
  FETCH_POSTS_SUCCESS,
  FETCH_PAGES_SUCCESS,
  FETCH_PAGES_ERROR,
  FETCH_FIELDS_SUCCESS,
  FETCH_FIELDS_ERROR,
  ADD_POST_SUCCESS,
  ADD_POST_ERROR,
  ADD_POST_REQUEST,
  FETCH_SOUNDS_SUCCESS,
  FETCH_SOUNDS_ERROR,
} from './types'

export const fetchContent = (params) => (dispatch) => {
  let successType
  let errorType
  switch (params) {
    case 'posts':
      successType = FETCH_POSTS_SUCCESS
      errorType = FETCH_POSTS_ERROR
      break
    case 'pages':
      successType = FETCH_PAGES_SUCCESS
      errorType = FETCH_PAGES_ERROR
      break
    case 'fields':
      successType = FETCH_FIELDS_SUCCESS
      errorType = FETCH_FIELDS_ERROR
      break
    case 'sounds':
      successType = FETCH_SOUNDS_SUCCESS
      errorType = FETCH_SOUNDS_ERROR
      break
    default:
  }

  axios.get(`https://api.cosmicjs.com/v1/${process.env.BUCKET_ID}/objects`, {
    params: {
      type: params,
      read_key: process.env.READ_KEY,
    },
  })
    .then((response) => {
      if (!response.data.objects) {
        dispatch({
          type: errorType,
        })
      }
      if (response.data.objects && response.data.objects.length) {
        dispatch({
          type: successType,
          payload: response.data.objects,
        })
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

export const requestContent = () => (dispatch) => {
  dispatch({
    type: ADD_POST_REQUEST,
    isLoading: true,
  })
}

export const addContent = (params) => (dispatch) => {
  const Cosmic = require('cosmicjs')({ //eslint-disable-line
    token: getCookie('val'), // optional
  })
  Cosmic.getBuckets()
    .then((data) => {
      const bucket = Cosmic.bucket({
        slug: data.buckets[0].slug,
        write_key: process.env.WRITE_KEY,
      })

      bucket.addObject(params)
        .then((response) => {
          if (!response.object) {
            dispatch({
              type: ADD_POST_ERROR,
              isLoading: false,
            })
          }
          if (response.object) {
            dispatch({
              type: ADD_POST_SUCCESS,
              payload: response.object,
              isLoading: false,
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    })
    .catch((err) => {
      console.log(err)
    })
}
