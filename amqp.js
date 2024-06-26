/** Require rabbitmq */
const { rabbitmq } = require('../env')
//Required For Proccessing new order
const { host, port } = require('./vars');
/** Require amqp callback api */
var amqp = require('amqplib/callback_api')
/** rabbitmq connection url */
const CONN_URL = `amqp://${rabbitmq.username}:${rabbitmq.password}@${rabbitmq.url}`
/** require newProcessOrder from order management */
const { newProcessOrder } = require('../business/order-management')
/** require createNewOrder from orders logic */
const { createNewOrder } = require('../business/orders-logic')
const { addQueueCart } = require('../business/carts-logic');
/** Rabbitmq method for consuming order data */
exports.getConnection = (connCallBack) => {
    amqp.connect(CONN_URL, function (err, conn) {
      if (err) {
        throw new Error(err)
      }
      if (conn) {
        conn.createChannel(function (err, ch) {
          if (err) {
            throw new Error(err)
          } else {
            ch.consume(rabbitmq.ORDERQUEUE, function (msg) {
                const data1 = msg.content.toString()
                createNewOrder(data1, (data) => {
                  const orderToProcess = data.orders.find(x => {
                    return !(!!x && !!x.workflow && !!x.workflow.transition && !!(x.workflow.transition.length > 0))
                  })
                  if (orderToProcess) {
                    const orderTrans = orderToProcess.workflow.transition ? orderToProcess.workflow.transition : []
                    newProcessOrder(`${host}:${port}`,orderToProcess._id, orderTrans, (data) => {})
                  }
                })
            }, { noAck: true }
            );
            ch.consume(rabbitmq.CARTQUEUE, function (msg) {
              const data1 = msg.content.toString();
              addQueueCart(data1, (err)=>{
                if(err){
                  throw new Error(err);
                }
              })
          }, { noAck: true }
          )
          }
        })
        connCallBack(conn);
      }
    })
}