import { combineReducers } from 'redux';

import auth from './authReducer';
import category from './categoryReducer';
import subcategory from './subcategoryReducer';
import course from './CourseReducer';
import cart from './cartReducer';
import ratings from './ratingsReducer';
import chapter from './chapterReducer';

export default combineReducers({ auth, category, subcategory, course, cart, ratings, chapter });