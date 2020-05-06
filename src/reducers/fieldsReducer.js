import { FETCH_FIELDS_SUCCESS, FETCH_FIELDS_ERROR } from '../actions/types'

const initialState = {
  fields: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FIELDS_SUCCESS:
      return {
        type: action.type,
        fields: action.payload,
      }
    case FETCH_FIELDS_ERROR:
      return {
        ...state,
        error: true,
        fields: null,
      }
    default:
      return state
  }
}
