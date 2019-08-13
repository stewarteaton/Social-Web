import React, { Component  } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

// MUI stuff
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
// Redux 
import { connect } from 'react-redux';
import { submitComment, clearErrors, submitFirstComment } from '../../redux/actions/dataActions';

const styles = (theme) => ({
    button: {
        marginTop: 10
    }
})

export class CommentForm extends Component {
    state = {
        body: '',
        errors: {},
        commentCount: {}
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.UI.errors){
            this.setState({errors: nextProps.UI.errors});
        }
        if(!nextProps.UI.errors && !nextProps.UI.loading){
            this.setState({ body: '' })
        }
        
    }
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    handleSubmit = (event) => {
        event.preventDefault();
        // Error in reducer with listing first comment so divided logic here to see if prior comments exist
        if(this.props.commentCount){
            this.props.submitComment(this.props.shoutID, { body: this.state.body });
        }
        // in the case it is the first comment
        else {
            this.props.submitFirstComment(this.props.shoutID, { body: this.state.body });
        }
        // this.props.clearErrors();
    }

    render() {
        const { classes, authenticated, commentCount } = this.props; 
        const errors = this.state.errors;
        console.log('CommentCont')
        console.log(commentCount);

        const commentFormMarkup = authenticated ? (
            <Grid item sm={12} style={{ textAlign: 'center'}}>
                <form onSubmit={this.handleSubmit} >
                    <TextField name='body' type='text' label='Comment on shout' error={errors.comment ? true : false } helperText={errors.comment}
                                value={this.state.body} onChange={this.handleChange} fullWidth className={classes.textField} />
                    <Button type="submit" variant='contained' color='primary' className={classes.button}>Submit</Button>
                </form>
                <hr className={classes.visibleSeparator} />
            </Grid>
        ) : null;
        return commentFormMarkup; 
    }
}

CommentForm.propTypes = {
    clearErrors: PropTypes.func.isRequired,
    submitComment: PropTypes.func.isRequired,
    submitFirstComment: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    shoutID: PropTypes.string.isRequired,
    authenticated: PropTypes.bool.isRequired,
    commentCount: PropTypes.number.isRequired
}
const mapStateToProps = state => ({
    UI: state.UI,
    authenticated: state.user.authenticated,
    commentCount: state.data.shout.comments
})

export default connect(mapStateToProps, { submitComment, clearErrors, submitFirstComment })(withStyles(styles)(CommentForm))
