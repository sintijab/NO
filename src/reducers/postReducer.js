import {
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_ERROR,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_POST_ERROR,
} from '../actions/types'

const initialState = {
  posts: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_POSTS_SUCCESS:
      return {
        type: action.type,
        posts: action.payload,
      }
    case FETCH_POSTS_ERROR:
      return {
        ...state,
        error: true,
        posts: null,
      }
    case ADD_POST_REQUEST:
      return {
        ...state,
        post: null,
        isLoading: action.isLoading,
      }
    case ADD_POST_SUCCESS:
      return {
        ...state,
        error: true,
        post: action.payload,
        isLoading: false,
      }
    case ADD_POST_ERROR:
      return {
        ...state,
        error: true,
        post: null,
        isLoading: false,
      }
    default:
      return state
  }
}
