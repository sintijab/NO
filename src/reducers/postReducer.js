const initialState = {
  posts: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_POSTS_SUCCESS':
      return {
        type: action.type,
        posts: action.payload,
      }
    case 'FETCH_POSTS_ERROR':
      return {
        ...state,
        error: true,
        posts: null,
      }
    default:
      return state
  }
}
