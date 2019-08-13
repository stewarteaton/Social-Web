// import rce short cut
import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

import Shout from '../components/shout/Shout.js'
import Profile from '../components/profile/Profile';
import ShoutSkeleton from '../util/ShoutSkeleton';

import { connect } from 'react-redux';
import { getShouts } from '../redux/actions/dataActions';

class home extends Component {
    state = {
        shouts: null,
    }
    componentDidMount(){
       this.props.getShouts();
    }

    render() {
        const { shouts, loading } = this.props.data 
        // check if we have shouts in state // ternary operator to check if has loaded
        // let recentShoutsMarkup = this.state.shouts ?(
        //                                     //When looping in React each element needs a key
        //     this.state.shouts.map(shout => <Shout key={shout.shoutID} shout={shout}/>)
        // ) : <p>Loading...</p>
        let recentShoutsMarkup = !loading ? (
            shouts.map((shout) => <Shout key={shout.shoutID} shout={shout}/>)
        ) : ( <ShoutSkeleton />);

        return (
            //Grid is material ui component // spacing gives padding for columns
            <Grid container spacing={2}>
                <Grid item sm={8} xs={12}>
                    {recentShoutsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <Profile />
                </Grid>
            </Grid>
        )
    }
}

home.propTypes = {
    getShouts: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    data: state.data
})

export default connect(mapStateToProps, { getShouts })(home);
