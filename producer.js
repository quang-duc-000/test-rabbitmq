require("dotenv").config()
const ampq = require('amqplib')

async function sendQueue(message) {
  try {
    /* Queue name */
    const queue = "hello_queue"

    /* Create connection */
    const connect = await ampq.connect(process.env.BASE_URL, {})

    /* Create channel */
    const channel = await connect.createChannel()

    /* Create queue */
    await channel.assertQueue(queue, {

      /* 
        Durable
        If `true`, when the server is shutdown or any reason it is turned off, the queue is still alive
        If `false`, then vice versa, the queue will not exist
      */
      durable: false,
    })

    /* Send queue */
    channel.sendToQueue(queue, Buffer.from(message), {
      /*
        Expiration
        The amount of time a message is allowed to remain in a queue
      */
      expiration: 10 * 1000, // miniseconds

      /* 
        Persistent
        It will save messages even if the server is turned off
        (It will only work if the queue is also turned on durable)
      */
      persistent: true,
    })
  } catch (error) {
    console.error(error);
  }
}

sendQueue("Hello guys")

module.exports = {
  sendQueue
}