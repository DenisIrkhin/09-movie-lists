import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

import Spinner from './Spinner'
class Profile extends Component {
  async componentDidMount() {
    try {
      let { data } = await axios({
        method: 'get',
        url: '/api/profiles',
        withCredentials: true
      })
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

  render() {
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
        <React.Fragment>
          <div className="col-md-5 p-5 avatar-container">
            <img src={avatar} alt="" className="avatar-profile w-100" />
            {/* <Link to="/profiles" className="btn btn-light mb-3 float-left">
                Back To Profiles
              </Link> */}
          </div>
          <div className="col-md-7 p-5 text-left">
            <div>
              <strong>Username: </strong>
              {username}
            </div>
            <div>
              <strong>Status: </strong>
              {status}
            </div>
            <div>
              <strong>Bio: </strong>
              {bio}
            </div>
            <div>
              <strong>Website: </strong>
              {website}
            </div>
            <div>
              <strong>Hobbies: </strong>
              {hobbies}
            </div>
            <div>
              <strong>Facebook: </strong>
              {social.facebook}
            </div>
            <div>
              <strong>Instagram: </strong>
              {social.instagram}
            </div>
            <div>
              <strong>Linkedin: </strong>
              {social.linkedin}
            </div>
            <div>
              <strong>Youtube: </strong>
              {social.youtube}
            </div>
          </div>
        </React.Fragment>
      )
    }

    return (
      <div className="profile container-fluid main-container-profile ">
        <div className="container pt-5">
          <div className="row pt-5 holder-profile">{profileContent}</div>
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

let mapStateToProps = state => {
  return {
    email: state.state.email,
    avatar: state.state.avatar,
    profile: state.state.profile,
    isProfileLoaded: state.state.isProfileLoaded
  }
}
export default connect(mapStateToProps)(Profile)
