const { default: Stripe } = require('stripe')(process.env.STRIPE_SECRET_KEY)

const getCheckoutSession = async (req, res) => {
  const { orderId } = req.params
  console.log('🚀 ~ getCheckoutSession ~ orderId:', orderId)

  try {
    const session = await Stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: req.user.email,
      client_reference_id: orderId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'T-shirt',
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],

      success_url: `${req.protocol}://${req.get('host')}/`,
      cancel_url: `${req.protocol}://${req.get(
        'host'
      )}/ecommerce/order/${orderId}`,
    })
    res.status(200).json({ status: 'success', session })
  } catch (error) {
    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

module.exports = { getCheckoutSession }
