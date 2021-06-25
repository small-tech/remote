const Remote = require('../../../index.js')

let count = 0

module.exports = function (client, request) {

  const remote = new Remote(client)

  remote.addNumbers.request.handler = message => {
    remote.addNumbers.response.send({
      firstNumber: message.firstNumber,
      secondNumber: message.secondNumber,
      result: message.firstNumber + message.secondNumber
    })
  }

  remote.subtractNumbers.request.handler = message => {
    remote.subtractNumbers.response.send({
      firstNumber: message.firstNumber,
      secondNumber: message.secondNumber,
      result: message.firstNumber - message.secondNumber
    })
  }

  remote.counter.increment.handler = message => {
    count++
    remote.counter.update.send({ count })
  }
}
