import { SET_SHOUTS, SET_SHOUT, LIKE_SHOUT, UNLIKE_SHOUT, LOADING_DATA, DELETE_SHOUT, POST_SHOUT, SUBMIT_COMMENT, SUBMIT_FIRST_COMMENT } from '../types';

const initialState = {
    shouts: [],
    shout: {},
    loading: false
};

export default function(state = initialState, action){
    switch(action.type){
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            }
        case SET_SHOUTS:
            return {
                ...state,
                shouts: action.payload,
                loading: false
            }
        case SET_SHOUT: 
            return {
                ...state,
                shout: action.payload
            };
        case LIKE_SHOUT:
        case UNLIKE_SHOUT:
            // both like shout and unlike shout use this
            // like and unlike payload returns the new modified shout post
            // we find the index of the shout and replace it with the new shout
                let index = state.shouts.findIndex((shout) => shout.shoutID === action.payload.shoutID);
                state.shouts[index] = action.payload;
                // when like is clicked in extended dialog, must be updated 
                if(state.shout.shoutID === action.payload.shoutID){
                    state.shout.likeCount = action.payload.likeCount;
                }
                return {
                    ...state
                };
        case DELETE_SHOUT: 
            // delete on local state instead of calling get shouts again and using exta db call
            let index1 = state.shouts.findIndex((shout) => shout.shoutID === action.payload);
            // splice removes elements of array starting with 'index'
            state.shouts.splice(index1, 1);
            return {
                ...state
            };
        case POST_SHOUT:
            return {
                ...state,
                shouts: [
                    // places the new shout at top of list
                    action.payload,
                    ...state.shouts
                ]
            };
        case SUBMIT_COMMENT: 
            return{
                ...state,
                shout: {
                    ...state.shout,
                    // places most recent comment on top of list 
                    // Gives error if ...state.shout.comments (existing comments is empty);
                    comments: [action.payload, ...state.shout.comments]
                }
            }
        case SUBMIT_FIRST_COMMENT: 
            return{
                ...state,
                shout: {
                    ...state.shout,
                    comments: [action.payload]
                }
            }
        default:
            return state;
    }
}