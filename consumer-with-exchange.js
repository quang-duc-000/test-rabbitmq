require("dotenv").config()
const ampq = require('amqplib')

async function resiveQueue() {
  try {
    /* Queue name */
    const exchange = "hello_exchange"

    /* Create connection */
    const connect = await ampq.connect(process.env.BASE_URL, {})

    /* Create channel */
    const channel = await connect.createChannel()

    /* Create exchange */
    await channel.assertExchange(exchange, 'fanout', {

      /* 
        Durable
        If `true`, when the server is shutdown or any reason it is turned off, the queue is still alive
        If `false`, then vice versa, the queue will not exist
      */
      durable: false,
    })

    /* Get quene name */
    const { queue } = await channel.assertQueue('', {
      /* 
        Exclusive
        If `true`, it will automatically delete the queue if the consumer disconnects
      */
      exclusive: true,
    })
    console.log("Queue name: ", queue);

    /* Binding */
    await channel.bindQueue(queue, exchange, '')

    channel.consume(queue, (message) => {
      console.log(message.content.toString());
    })
  } catch (error) {
    console.error(error);
  }
}

resiveQueue()

module.exports = {
  resiveQueue
}