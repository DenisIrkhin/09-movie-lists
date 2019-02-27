import React, { Component } from 'react'
import { connect } from 'react-redux'

class Profile extends Component {
  render () {
    console.log('props', this.props)
    return (
      <div>
        PROFILE
      </div>
    )
  }
}

let mapStateToProps = (state) => {
  return {
    email: state.state.email
  }
}
export default connect(mapStateToProps)(Profile)
