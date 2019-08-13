import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI, SET_UNAUTHENTICATED, LOADING_USER, MARK_NOTIFICATIONS_READ } from '../types';
import axios from 'axios';

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/login', userData).then((res) => {
        setAuthorizationHeader(res.data.token) // calls helper function defined at bottom
        dispatch(getUserData());
        dispatch({ type: CLEAR_ERRORS });
        // this.props.history.push('/');  can use just history because imported at top
        history.push('/');
    })
    .catch((err) => {
        dispatch({
            // will do to global state
            type: SET_ERRORS,
            payload: err.response.data
        })
    });
}

export const signupUser = (newUserData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/signup', newUserData).then((res) => {
        setAuthorizationHeader(res.data.token) // calls helper function defined at bottom
        dispatch(getUserData());
        dispatch({ type: CLEAR_ERRORS });
        // this.props.history.push('/');  can use just history because imported at top
        history.push('/');
    })
    .catch((err) => {
        dispatch({
            // will do to global state
            type: SET_ERRORS,
            payload: err.response.data
        })
    });
}

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('FBIdToken');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: SET_UNAUTHENTICATED });
}

export const getUserData = () => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.get('/user').then(res => {
        dispatch({
            type: SET_USER,
            // payload is date we send to reducer which then does something with it
            payload: res.data
        })
    })
    .catch(err => console.log(err));
}

export const uploadImage = (formData) => (dispatch) => {
    // call user loading user action
    dispatch({ type: LOADING_USER })
    axios.post('/user/image', formData).then(res => {
        dispatch(getUserData());
    })
    .catch(err => console.log(err));
}

export const editUserDetails = (userDetails) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.post('/user', userDetails).then(() => {
        dispatch(getUserData());
    })
    .catch((err) => console.log(err));
};

export const markNotificationsRead = (notificationsIDs) => dispatch => {
    axios.post('/notifications', notificationsIDs).then((res => {
        dispatch({ type: MARK_NOTIFICATIONS_READ });
    }))
    .catch(err => console.log(err)) 
}
//helper function for repeated code in login and signup user
const setAuthorizationHeader = (token) => {
        // result.data bc axios // should print user token
        console.log(token);
        // saves login token to local storage incase user refreshes page etc./ 
        localStorage.setItem('FBIdToken', `Bearer ${token}`);            
    
        const FBIdToken = `Bearer ${token}`;
        // In github docs, automatically sets headers with this format with all routes
        axios.defaults.headers.common['Authorization'] = FBIdToken;
}