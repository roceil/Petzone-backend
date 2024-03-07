const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const getCheckoutSession = async (req, res) => {
  const { orderId } = req.params

  const orderDetail = JSON.parse(JSON.stringify(req.body))
  const orderListArray = orderDetail.body.order.products

  const newOrderListArray = orderListArray.map((item) => {
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.photos,
          description: item.description,
        },

        unit_amount: item.price * 100,
      },
      quantity: item.qty,
    }
  })

  try {
    const session = await stripe.checkout.sessions.create({
      client_reference_id: orderId,
      line_items: newOrderListArray,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/`,
      cancel_url: `${process.env.CLIENT_URL}/ecommerce/order/${orderId}`,
    })

    res.json({ url: session.url })
  } catch (error) {
    console.log('🚀 ~ getCheckoutSession ~ error:', error)

    res.status(500).json({ message: '請檢查API格式或參數是否有誤' })
  }
}

module.exports = { getCheckoutSession }
