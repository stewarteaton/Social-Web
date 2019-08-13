// import rce short cut
import React, { Component } from 'react'
// to access global styles for theme later
import withStyles from '@material-ui/core/styles/withStyles';
// built in method with react for type checking, min errors
import PropTypes from 'prop-types';
import AppIcon from '../images/social-icon.png';
import { Link } from 'react-router-dom';

// MUI Stuff // grid layer login page 
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
// REDUX stuff
import { connect } from 'react-redux';  // need to connect login to app
import { loginUser } from '../redux/actions/userActions';
// const styles = (theme) => ({
//     ...theme
// })

const styles = {
      typography: {
        useNextVariants: true
      },
      form: {
        textAlign: 'center'
      },
      image: {
          width:  75,
          height: 85,
          margin: '20px auto 20px auto'
      },
      pageTitle: {
          margin: '10px auto 10px auto'
      },
      textField: {
          margin: '10px auto 10px auto'
      },
      button: {
          marginTop: 20,
          marginBottom: 10,
          position: 'relative'
      },
      customError: {
          color: 'red',
          fontSize: '.8em'
      },
      progress: {
          position: 'absolute'
      }
    }


class login extends Component {
    constructor(){
        super();
        this.state = {
            email: '',
            password: '',
            errors: {}
        };
        // test
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    // gets global ui errors and sets them to local state for ui error message in textfield
    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
            this.setState({ errors: nextProps.UI.errors });
        }
    }
    handleSubmit = (event) => {
        event.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        // functionality set up at bottom where action mapped
        this.props.loginUser(userData, this.props.history);  // passes login data and browser history to reducer
    };

    handleChange = (event) => {
        this.setState({
            // sets the value of email or password field to what the user is typing
            [event.target.name]: event.target.value
        });
    };

    render() {              // from redux mapped
        const { classes, UI: { loading } } = this.props;
        const { errors } = this.state;
        return (
           <Grid container className={classes.form}>
               <Grid item sm />
               <Grid item sm>
                   <img src={AppIcon} alt="App icon" className={classes.image}/>
                    <Typography variant="h2" className={classes.pageTitle}>Login</Typography>
                    {/* will validate through backend  -- helperText shows error or info -- error field makes box red if error*/}
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField id="email" name="email" type="email" label="Email" className={classes.textField} helperText={errors.email}
                            error={errors.email ? true : false} value={this.state.email} onChange={this.handleChange} fullWidth />

                        <TextField id="password" name="password" type="password" label="Password" className={classes.textField} helperText={errors.password}
                            error={errors.password ? true : false} value={this.state.password} onChange={this.handleChange} fullWidth />
                        {/* checks to see if errors with login credentials -- login errors type general declared in backend*/}
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button type="submit" variant="contained" color="primary" className={classes.button} disabled={loading}>
                            Log In {loading && (<CircularProgress size={20} className={classes.progress} />)}
                        </Button>
                        <br />
                        <small>New User ? Create an account <Link to="/signup">HERE</Link></small>
                    </form> 
               </Grid>
               <Grid item sm />

           </Grid>
        )
    }
}

//local component props
login.propTypes = {
    // defines component props as required
    classes: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
}

// export default withStyles(styles)(login)
// connect for redux implementations

// function that takes global state from store and returns what we need, maps to comonent props
const mapStateToProps =  (state) => ({
    user: state.user,
    UI: state.UI
});

const mapActionToProps = {
    loginUser
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(login));

