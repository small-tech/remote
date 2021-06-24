import Remote from '@small-tech/remote'

let count = 0

module.exports = (client, request) => {
  client.room = this.setRoom(request)

  let remote = new Remote(client)

  remote.addNumbers.request = message => {
    remote.addNumbers.response.send({ result: message.firstNumber + message+secondNumber })
  }

  remote.subtractNumbers.request = message => {
    remote.subtractNumbers.response.send({ result: message.firstNumber - message.secondNumber })
  }

  remote.counter.increment = message => {
    counter++
    remote.counter.update.send({ count })
  }
}
