import { SET_SHOUTS, SET_SHOUT, LOADING_DATA, LIKE_SHOUT, UNLIKE_SHOUT, DELETE_SHOUT,
     LOADING_UI, SET_ERRORS, POST_SHOUT,  CLEAR_ERRORS, STOP_LOADING_UI, SUBMIT_COMMENT, SUBMIT_FIRST_COMMENT} from '../types';
import axios from 'axios';

// Get all shouts 
export const getShouts = () => dispatch => {
    dispatch({ type: LOADING_DATA });
    axios.get('/shouts').then(res => {
        dispatch({
            type: SET_SHOUTS,
            payload: res.data
        })
    })
    .catch(err => {
        dispatch({
            type: SET_SHOUTS,
            payload: []
        })
    })
}

// Get a specific shout 
export const getShout = (shoutID) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    console.log(shoutID);
    axios.get(`/shout/${shoutID}`).then((res) => {
        dispatch({ type: SET_SHOUT, payload: res.data});
        // stop loading
        dispatch({ type: STOP_LOADING_UI });
    })
    .catch(err => console.log(err)); 
}
// Post a shout
export const postShout = (newShout) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post(`/shout`, newShout).then((res) => {
        dispatch({ type: POST_SHOUT, payload: res.data});
        // just to clear any potential erros 
        dispatch(clearErrors());
    })
    .catch((err) => {
        dispatch({ type: SET_ERRORS, payload: err.response.data})
    })
}

// Like a Shout  // Dispatched to dataReducer & userReducer
export const likeShout = (shoutID) => (dispatch) => {
    axios.get(`/shout/${shoutID}/like`).then((res) => {
        console.log('**' + res.data.shoutID);
        dispatch({
            type: LIKE_SHOUT,
            payload: res.data
        })
    })
    .catch((err) => console.log(err));
};

// Unlike a Shout  // Dispatched to dataReducer & userReducer
export const unlikeShout = (shoutID) => (dispatch) => {
    axios.get(`/shout/${shoutID}/unlike`).then((res) => {
        dispatch({
            type: UNLIKE_SHOUT,
            payload: res.data
        });
    })
    .catch((err) => console.log(err));
};

// submit a comment
export const submitComment = (shoutID, commentData) => (dispatch) => {
    axios.post(`/shout/${shoutID}/comment`, commentData)
        .then((res) => {
            dispatch({ type: SUBMIT_COMMENT, payload: res.data });
            dispatch({ type: CLEAR_ERRORS });
        })
        .catch((err) => {
            // giving problems on first comment of a shout for some reason 
            dispatch({ type: SET_ERRORS, payload: err.response.data });
            // console.log(err)
        });
}

export const submitFirstComment = (shoutID, commentData) => (dispatch) => {
    axios.post(`/shout/${shoutID}/comment`, commentData)
        .then((res) => {
            dispatch({ type: SUBMIT_FIRST_COMMENT, payload: res.data });
            dispatch({ type: CLEAR_ERRORS });
        })
        .catch((err) => {
            // giving problems on first comment of a shout for some reason 
            dispatch({ type: SET_ERRORS, payload: err.response.data });
            // console.log(err)
        });
}

export const deleteShout = (shoutID) =>  (dispatch) => {
    axios.delete(`/shout/${shoutID}`).then(() => {
        dispatch({ type: DELETE_SHOUT, payload: shoutID })
    })
    .catch((err) => console.log(err));
}

// get user data, diff from one in user actions
export const getUserData = (userHandle) => dispatch => {
    dispatch({ type: LOADING_DATA });
    axios.get(`/user/${userHandle}`).then((res) => {
        dispatch({ type: SET_SHOUTS, payload: res.data.shouts });
    })
    .catch(()=> {
        dispatch({ type: SET_SHOUTS, payload: null })
    })
}


// clear errors
export const clearErrors = () => dispatch => {
    dispatch({ type: CLEAR_ERRORS })
}