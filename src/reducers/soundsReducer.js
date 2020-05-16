import {
  FETCH_SOUNDS_SUCCESS,
  FETCH_SOUNDS_ERROR,
  FETCH_SC_SUCCESS,
  FETCH_SC_ERROR,
  FETCH_SC_TRACKS_SUCCESS,
  FETCH_SC_TRACKS_ERROR,
} from '../actions/types'

const initialState = {
  sounds: [],
  collection: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SOUNDS_SUCCESS:
      return {
        type: action.type,
        sounds: action.payload,
      }
    case FETCH_SOUNDS_ERROR:
      return {
        ...state,
        error: true,
        sounds: null,
      }
    case FETCH_SC_SUCCESS:
      return {
        ...state,
        type: action.type,
        collection: action.payload,
      }
    case FETCH_SC_ERROR:
      return {
        ...state,
        error: true,
        collection: null,
      }
    case FETCH_SC_TRACKS_SUCCESS:
      return {
        ...state,
        type: action.type,
        sc_sounds: action.payload,
      }
    case FETCH_SC_TRACKS_ERROR:
      return {
        ...state,
        error: true,
        sc_sounds: null,
      }
    default:
      return state
  }
}
