import React, { Component } from 'react';
// withStyles is a way to pass on a theme through different components
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';
import DeleteShout from './DeleteShout';
import ShoutDialog from './ShoutDialog';
import LikeButton from './LikeButton';
// MUI stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
// icons
import ChatIcon from '@material-ui/icons/Chat';


// redux
import { connect } from 'react-redux';

dayjs.extend(relativeTime);

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20
    },
    image: {
        minWidth: 200
    },
    content: {
        padding: 25,
        // prevents image from being stetched/ warped
        objectFit: 'cover'
    }

}

class Shout extends Component {

    render() {
        dayjs.extend(relativeTime);
        // same as - const classes = this.props.classes; -> destructuring
        //setting classes = this.props.calsses
        const { classes , 
                shout: { body, createdAt, userImage, userHandle, shoutID, likeCount, commentCount },
                user: { authenticated, credentials: { handle } }} = this.props;

        // delete button // only renders if user authenticate and if shout belongs to user
        const deleteButton = authenticated && userHandle === handle ? (
            <DeleteShout shoutID={shoutID} />
        ) : null;

        return (
            <Card className={classes.card}>
                <CardMedia image={userImage} title="Profile Image" className={classes.image} />
                <CardContent className={classes.content}>
                    <Typography variant="h5" component={Link} to={`users/${userHandle}`} color="primary">{userHandle}</Typography>
                    { deleteButton }
                    <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
                    <Typography variant="body1">{body}</Typography>
                    <LikeButton shoutID={shoutID} />
                    <span>{likeCount} Likes</span>
                    <MyButton tip="comments">
                        <ChatIcon color="primary" />
                    </MyButton>
                    <span>{commentCount} comments</span>
                    {/* open dialog only true when used for notifications */}
                    <ShoutDialog shoutID={shoutID} userHandle={userHandle} openDialog={this.props.openDialog}/>
                </CardContent>
            </Card>
        )
    }
}


const mapStateToProps = (state) => ({
    user: state.user
});


Shout.propTypes = {
    user: PropTypes.object.isRequired,
    shout: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    openDialog: PropTypes.bool
}

export default connect(mapStateToProps)(withStyles(styles)(Shout));
