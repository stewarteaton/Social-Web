// THIS component is just to serve as a loading skeleton for the expected data 
import React, { Fragment } from 'react';
import noImg from '../images/no-img.png';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
// MUI 
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';

const styles = theme => ({
    card: {
        display: 'flex',
        marginBottom: 20,
    },
    cardContent: {
        width: '100%',
        flexDirection: 'column',
        padding: 25,
    },
    cover: {
        minWidth: 200,
        objectFit: 'cover'
    },
    handle: {
        width: 60,
        height: 18,
        backgroundColor: theme.palette.primary.main,
        marginBottom: 7
    },
    date: {
        height: 15,
        width: 100,
        backgroundColor: 'grey',
        marginBottom: 10
    },
    fullLine: {
        height: 15,
        width: '90%',
        backgroundColor: 'black',
        marginBottom: 10
    },
    halfLine: {
        height: 15,
        width:'50%',
        backgroundColor: 'black',
        marginBottom:10
        
    }
})

// functional component bc we dont need to manage any state
const ShoutSkeleton = (props) => {
    const {classes} = props;

    const content = Array.from({ length: 5 }).map((item, index) => (
        <Card className={classes.card} key={index}>
            <CardMedia className={classes.cover} image={noImg}/>
            <CardContent className={classes.cardContent} >
                <div className={classes.handle} />
                <div className={classes.date} />
                <div className={classes.fullLine} />
                <div className={classes.fullLine} />
                <div className={classes.halfLine} />

            </CardContent>

        </Card>
    ))
    return <Fragment>{content}</Fragment>
}

ShoutSkeleton.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ShoutSkeleton);