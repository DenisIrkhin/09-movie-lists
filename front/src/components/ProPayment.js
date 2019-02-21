import React from 'react'
import StripeCheckout from 'react-stripe-checkout'
import axios from 'axios'

export default class ProPayment extends React.Component {
  onToken = token => {
    console.log('token ', token)
    axios({
      url:'/api/pmnts',
      method: 'post',
      data: token,
      withCredentials: true
    })
    .then(res => {
      console.log('data ',res.data)
        alert(`We are in business, ${res.data.email}`)
      })
    }

  // ...

  render() {
    return (
      // ...
      <StripeCheckout
        name="Movielists"
        description="Pro Member"
        shippingAddress
        billingAddress={false}
        zipCode={false}
        amount={3500}
        currency="CAD"
        token={this.onToken}
        stripeKey="pk_test_TEntmgKHBcxtwIn7yqNwExZs"
      >
        <button id="button-premium">BUY NOW</button>
      </StripeCheckout>
    )
  }
}
