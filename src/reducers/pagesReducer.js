import { FETCH_PAGES_SUCCESS, FETCH_PAGES_ERROR } from '../actions/types'

const initialState = {
  pages: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PAGES_SUCCESS:
      return {
        type: action.type,
        pages: action.payload,
      }
    case FETCH_PAGES_ERROR:
      return {
        ...state,
        error: true,
        pages: null,
      }
    default:
      return state
  }
}
