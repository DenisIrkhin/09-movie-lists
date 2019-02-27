import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

import Spinner from './Spinner'
class Profile extends Component {
  async componentDidMount () {
    try {
      let { data } = await (axios({
        method: 'get',
        url: '/api/profiles',
        withCredentials: true
      }))
      console.log('data', data)
      if (data.success) {
        // Dispatch profile loaded
        const { profile } = data
        this.props.dispatch({
          type: 'get-user-profile',
          payload: profile
        })
      }
    } catch (error) {
      console.log('error.response.data', error.response.data)
      // "There is no profile for this user"
      // Dispatch profile {}
      this.props.dispatch({
        type: 'get-user-profile',
        payload: null
      })
    }
  }

  // componentWillReceiveProps (nextProps) {
  //   // if (nextProps.profile.profile === null && this.props.profile.loading) {
  //   //   this.props.history.push('/not-found');
  //   // }
  // }

  render () {
    console.log('this.props', this.props)
    const { profile, isProfileLoaded, email, avatar } = this.props
    let profileContent

    if (!isProfileLoaded) {
      // Not loaded yet
      profileContent = <Spinner />
    } else if (profile === null) {
      // Profile is not found
      profileContent = (
        <div>
          <div>Create Your Profile</div>
        </div>
      )
    } else {
      // Profile found
      console.log('profile', profile)
      const { username, bio, status, website, hobbies, social } = profile
      profileContent = (
        <div className='mt-5'>
          <div className='row'>
            <div className='col-md-6'>
              <img src={avatar} width='200px' alt='' />
              {/* <Link to="/profiles" className="btn btn-light mb-3 float-left">
                Back To Profiles
              </Link> */}
            </div>
            <div className='col-md-6' >
              <div>Username: {username}</div>
              <div>Status: {status}</div>
              <div>Bio: {bio}</div>
              <div>Website: {website}</div>
              <div>Hobbies: {hobbies}</div>
              <div>Facebook: {social.facebook}</div>
              <div>Instagram: {social.instagram}</div>
              <div>Linkedin: {social.linkedin}</div>
              <div>Youtube: {social.youtube}</div>
            </div>
          </div>
          {/* <ProfileHeader profile={profile} /> */}
          {/* <ProfileAbout profile={profile} /> */}
        </div>
      )
    }

    return (
      <div className='profile'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>{profileContent}</div>
          </div>
        </div>
      </div>
    )
  }

  // render () {
  //   console.log('props', this.props)
  //   return (
  //     <div>
  //       PROFILE
  //     </div>
  //   )
  // }
}

let mapStateToProps = (state) => {
  return {
    email: state.state.email,
    avatar: state.state.avatar,
    profile: state.state.profile,
    isProfileLoaded: state.state.isProfileLoaded
  }
}
export default connect(mapStateToProps)(Profile)
