import {
  FETCH_SOUNDS_SUCCESS,
  FETCH_SOUNDS_ERROR,
  FETCH_SC_SUCCESS,
  FETCH_SC_ERROR,
  FETCH_SC_TRACKS_SUCCESS,
  FETCH_SC_TRACKS_ERROR,
  SOUND_STARTED,
  SOUND_FINISHED,
  SET_SOUND_SRC,
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
    case SOUND_STARTED:
      return {
        ...state,
        is_playing: true,
      }
    case SOUND_FINISHED:
      return {
        ...state,
        is_playing: false,
      }
    case SET_SOUND_SRC:
      return {
        ...state,
        sc_source: action.payload,
      }
    default:
      return state
  }
}
