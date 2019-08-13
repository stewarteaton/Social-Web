
// check input
const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) return true;
    else return false;
};

const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
}

// function that takes data 
exports.validateSignupData = (data) => {
    let errors = {};

    if (isEmpty(data.email)) {
        errors.email = "Must not be empty";
    } else if(!isEmail(data.email)) {
        errors.email = "Email address isn't valid";
    } 

    if (isEmpty(data.password)) errors.password = "Must not be empty";
    if (data.password != data.confirmPassword) errors.confirmPassword = "Passwords don't match";
    if (isEmpty(data.handle)) errors.handle = "Must not be empty";

    // returns true if there is no errors 
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false 
    }
}

exports.validateLoginData = (data) => {
    let errors = {};

        if (isEmpty(data.email)) errors.email = "Must not be empty";
        if (isEmpty(data.password)) errors.password = "Must not be empty";
    
        return {
            errors,
            valid: Object.keys(errors).length === 0 ? true : false 
        };
};

exports.reduceUserDetails = (data) => {
    let userDetails = {};
    console.log('****'); console.log(data);

    if(!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
    if(!isEmpty(data.website.trim())) {
        // checks to see if https:// is included by user
        if(data.website.trim().substring(0,4) !== 'http'){
            userDetails.website = `http://${data.website.trim()}`;
        } else userDetails.website = data.website;
    }

    if(!isEmpty(data.location.trim())) userDetails.location = data.location;

    return userDetails;

}