const test = require('tape')
const Remote = require('..')

class MockSocket extends EventTarget {
  sentMessages = []

  send (message) {
    this.sentMessages.push(message)
  }
}

test('basic', t => {
  t.plan(4)

  const mockSocket = new MockSocket()
  const remote = new Remote(mockSocket)

  // Test requests.

  remote.dns.validate.request.send({
    please: true
  })

  const sentMessage = JSON.parse(mockSocket.sentMessages[0])
  t.strictEquals(sentMessage.type, 'dns.validate.request', 'message type is correct')
  t.strictEquals(sentMessage.please, true, 'message data is correctly set')

  // Test responses.

  remote.dns.validate.response.handler = function (message) {
    t.pass('remote.dns.validate.response handled')
    t.strictEquals(message.ok, true, 'message data is correctly passed to handler')
  }

  mockSocket.dispatchEvent(new MessageEvent('message', {
    data: JSON.stringify({
      type: 'dns.validate.response',
      ok: true
    })
  }))
})
