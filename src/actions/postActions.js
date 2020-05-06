import axios from 'axios'
import {
  FETCH_POSTS_ERROR,
  FETCH_POSTS_SUCCESS,
  FETCH_PAGES_SUCCESS,
  FETCH_PAGES_ERROR,
  FETCH_FIELDS_SUCCESS,
  FETCH_FIELDS_ERROR,
} from './types'

const fetchContent = (params) => (dispatch) => {
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
export default fetchContent
