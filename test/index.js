const test = require('tape')
const Remote = require('..')

class MockSocket extends EventTarget {
  sentMessages = []

  send (message) {
    this.sentMessages.push(message)
  }
}

test('basic', t => {
  t.plan(5)

  const mockSocket = new MockSocket()
  const remote = new Remote(mockSocket)

  // Test requests.

  remote.dns.validate.request({
    please: true
  })

  const sentMessage = JSON.parse(mockSocket.sentMessages[0])
  console.log(sentMessage)
  t.strictEquals(sentMessage.type, 'dns.validate.request', 'message type is correct')
  t.strictEquals(sentMessage.please, true, 'message data is correctly set')

  // Test responses.

  remote.dns.validate.response = function (message) {
    t.pass('remote.dns.validate.response handled')
    t.strictEquals(message.ok, true, 'message data is correctly passed to handler')
  }

  mockSocket.dispatchEvent(new MessageEvent('message', {
    data: JSON.stringify({
      type: 'dns.validate.response',
      ok: true
    })
  }))

  // Message without handler.

  console.warn = function (message) {
    t.strictEquals(message, 'Remote: Unhandled message (type: handler.does.not.exist)')
  }

  mockSocket.dispatchEvent(new MessageEvent('message', {
    data: JSON.stringify({
      type: 'handler.does.not.exist',
    })
  }))
})
