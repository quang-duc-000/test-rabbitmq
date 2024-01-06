require("dotenv").config()
const ampq = require('amqplib')

async function resiveQueue() {
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

    /* Resive queue */
    channel.consume(queue, (message) => {
      console.log("Content: ", message.content.toString());
    }, {
      /*
        noAck
        If `true`, that means it has received the message and  it will clear that message's queue
        If `false`, that is it will still receive the message but it will not delete the message from the queue
      */
      noAck: false,
    })
  } catch (error) {
    console.error(error);
  }
}

resiveQueue()

module.exports = {
  resiveQueue
}