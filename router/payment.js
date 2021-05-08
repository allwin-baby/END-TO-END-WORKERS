const stripe = require('stripe')(''); #put sectet key here
console.log("#put sectet key here")
const router = require('express').Router();

const YOUR_DOMAIN = 'http://localhost:4242';

router.post('/create-checkout-session', async (req, res) => {

  try{
    const session =  await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Stubborn Attachments',
              images: ['https://i.imgur.com/EHyR2nP.png'],
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success.html`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    })
    console.log(session)
    res.json({ id: session.id });
  } catch(e){
    console.log(e)
  }
});

module.exports = router;
