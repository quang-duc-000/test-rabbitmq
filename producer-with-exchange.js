require("dotenv").config()
const ampq = require('amqplib')

async function sendQueue(message) {
  try {
    /* Exchange name */
    const exchange = "hello_exchange"

    /* Create connection */
    const connect = await ampq.connect(process.env.BASE_URL, {})

    /* Create channel */
    const channel = await connect.createChannel()

    /* Create Exchange */
    await channel.assertExchange(exchange, 'fanout', {

      /* 
        Durable
        If `true`, when the server is shutdown or any reason it is turned off, the queue is still alive
        If `false`, then vice versa, the queue will not exist
      */
      durable: false,
    })

    /* Create publish */
    channel.publish(exchange, '', Buffer.from(message))

    setTimeout(() => {
      process.exit(0)
    }, 2000);
  } catch (error) {
    console.error(error);
  }
}

sendQueue("Hello guys")

module.exports = {
  sendQueue
}