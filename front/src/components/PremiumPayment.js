import React from 'react'
import StripeCheckout from 'react-stripe-checkout'

export default class PremiumPayment extends React.Component {
  onToken = token => {
    fetch('/save-stripe-token', {
      method: 'POST',
      body: JSON.stringify(token)
    }).then(response => {
      response.json().then(data => {
        alert(`We are in business, ${data.email}`)
      })
    })
  }

  // ...

  render() {
    return (
      // ...
      <StripeCheckout
        name="Movielists"
        description="Premium Member"
        amount={4900}
        shippingAddress
        billingAddress={false}
        zipCode={false}
        currency="CAD"
        token={this.onToken}
        stripeKey="pk_test_NMJL3QUg2ovO05Xg4IF9F164"
      >
        <button id="button-premium">BUY NOW</button>
      </StripeCheckout>
    )
  }
}
