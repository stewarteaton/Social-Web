import { SET_USER, SET_AUTHENTICATED, SET_UNAUTHENTICATED, LOADING_USER, LIKE_SHOUT, UNLIKE_SHOUT, MARK_NOTIFICATIONS_READ} from '../types';

// not global state but individual user state
const initialState = {
    authenticated: false,
    loading: false,
    credentials: {},
    likes: [],
    notifications: []
};

export default function(state = initialState, action) {
    switch(action.type){
        case SET_AUTHENTICATED:
            return {
                ...state,  // returns state we already have and change authenticated
                authenticated: true
            };
        case SET_UNAUTHENTICATED:
            return initialState;  // when we logout, returns false no data
        case SET_USER:
            return {
                authenticated: true,
                loading: false,
                ...action.payload   // spread payload bins credetials, likes,etc. to user
            };
        case LOADING_USER: 
            return {
                ...state,
                loading:true
            };
        case LIKE_SHOUT: 
            return {
                // spread state
                ...state,
                likes: [
                    // iterate through existing likes array
                    ...state.likes,
                    {
                        // Add new like from states user handle and return payload shoutID
                        userHandle: state.credentials.handle,
                        shoutID: action.payload.shoutID
                    }
                ]
            }
        case UNLIKE_SHOUT:
            return {
                ...state,
                // filters out the users like that is equal the ID of unliked shout
                likes: state.likes.filter((like) => like.shoutID !== action.payload.shoutID)
            };
        case MARK_NOTIFICATIONS_READ: 
            // need to loop through notifications in state and mark each as read
            state.notifications.forEach(notification => notification.read = true);
            return {
                ...state
            };
        default:
            return state;
    }
}