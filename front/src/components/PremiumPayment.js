import React from 'react'
import StripeCheckout from 'react-stripe-checkout'
import axios from 'axios'

export default class PremiumPayment extends React.Component {
  onToken = async token => {
    console.log('token ', token)

    // With axios we should use try/catch. In case of res.code=400 axios retrun reject of the promise and it falls to catch branch
    // Standard fetch() always return resolved promise
    try {
      // Destruct data from axios responce
    let {data} = await(
      axios({
        url:'/api/pmnts/premium',
        method: 'post',
        data: token,
        withCredentials: true
      })
    ) 
    console.log('data ',data)
    // We have already success here by code return(browser), but we make Double check
      if(data.success) {
        // TODO: pop-up success
        alert(`Success, ${data.email}`)
      } 
      // else {
      //   // NOTE: handle some real situations here
      // }
    } catch (error) {
      console.log(error.response)
      
      // In axios case  our data is inside error.response object. It's usefull for handling specific error return by backend
      let {data} = error.response
      alert(`Check You data please, ${data.error}`)
      // TODO: parse error message and redirect to appropriate page
      // Can't find user => Login page
      // Can't process the card - just msg: Check your card data
      // In real app back could return more specific info delivered by Stripe. Like, not enough money on the account.
    }
    
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
        stripeKey="pk_test_TEntmgKHBcxtwIn7yqNwExZs"
      >
        <button id="button-premium">BUY NOW</button>
      </StripeCheckout>
    )
  }
}
