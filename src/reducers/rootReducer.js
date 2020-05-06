import { combineReducers } from 'redux'
import signReducer from './signReducer'
import postReducer from './postReducer'
import archivesReducer from './archivesReducer'

const rootReducer = combineReducers({
  signInStatus: signReducer,
  postsData: postReducer,
  pagesData: archivesReducer,
})

const initialState = rootReducer({}, {})

export default (state = initialState, action) => rootReducer(state, action)
