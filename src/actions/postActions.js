import axios from 'axios'
import {
  FETCH_POSTS_ERROR,
  FETCH_POSTS_SUCCESS,
  FETCH_PAGES_SUCCESS,
  FETCH_PAGES_ERROR,
} from './types'

const fetchContent = (params) => (dispatch) => {
  const successType = params === 'posts' ? FETCH_POSTS_SUCCESS : FETCH_PAGES_SUCCESS
  const errorType = params === 'posts' ? FETCH_POSTS_ERROR : FETCH_PAGES_ERROR

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
