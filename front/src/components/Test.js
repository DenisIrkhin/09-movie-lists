import React, { Component } from 'react'
import axios from 'axios'

class Test extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tests: []
    }
  }
  async componentDidMount () {
    let data = await (await axios.get('/tests')).data
    if (data.success) {
      this.setState({ tests: data.tests }, () => console.log(this.state.tests))
    }
  }

  render () {
    // return <div />
    return (
      <div>
        {this.state.tests.map(test => (
          <ul key='test._id' style={ulTest}>
            <li>id: {test._id}</li>
            <li>name: {test.name}</li>
            <li>surname: {test.surname}</li>
          </ul>
        ))}
      </div>
    )
  }
}

const ulTest = {
  listStyleType: 'none',
  fontSize: '1.2em'
}
export default Test
