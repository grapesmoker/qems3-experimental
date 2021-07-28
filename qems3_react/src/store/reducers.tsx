import { combineReducers } from "redux";
import { User, State, Action, Category } from '../models';
import * as actions from './actions';


const initialState: State = {
    user: null,
    login: {
        password: null,
        username: null,
        email: null
    },
    categories: {}
}

function user(state = initialState.user, action: Action) {
    switch(action.type) {
        case actions.LOGIN_SUCCESS:
            return action.payload.user
        case actions.UPDATE_USER:
            return action.payload.user
        default:
            return state
    }
}

function login(state = initialState.login, action: Action) {
    switch(action.type) {
        case actions.UPDATE_USERNAME:
            return {...state, username: action.payload.username }
        case actions.UPDATE_PASSWORD:
            return {...state, password: action.payload.password }
        case actions.UPDATE_EMAIL:
            return {...state, email: action.payload.email }
        default:
            return state
    }
}

function categories(state = initialState.categories, action: Action) {
    switch(action.type) {
        case actions.LOAD_CATEGORIES:
            let categories_by_id: {[id: number]: Category} = {}
            action.payload.categories.forEach((category: Category) => {
                categories_by_id[category.id] = category
            })
            return categories_by_id
        case actions.ADD_CATEGORY:
            const newCategory = action.payload.category
            const parent = state[newCategory.parent_category]
            parent.subcategories.push(newCategory.id)
            return {...state, [parent.id]: parent, [newCategory.id]: newCategory}
        default:
            return state
    }
}


export default combineReducers({ login, user, categories })