const test = require('tape')
const Remote = require('..')

class MockSocket extends EventTarget {
  sentMessages = []
  listeners = []

  addEventListener(event, handler) {
    this.listeners.push({event, handler})
    super.addEventListener(event, handler)
  }

  removeEventListener(event, handler) {
    this.listeners = this.listeners.filter(listener => {
      return !(listener.event === event && listener.handler === handler)
    })
    super.removeEventListener(event, handler)
  }

  send (message) {
    this.sentMessages.push(message)
    this.dispatchEvent(new MessageEvent('message', { data: message }))
  }
}

test('basic', async t => {
  t.plan(10)

  const mockSocket = new MockSocket()
  const remote = new Remote(mockSocket)

  t.strictEquals(mockSocket.listeners.length, 1, 'initial message listener is added')

  // Test requests.

  remote.dns.validate.request.send({
    please: true
  })

  const sentMessage = JSON.parse(mockSocket.sentMessages[0])
  t.strictEquals(sentMessage.type, 'dns.validate.request', 'message type is correct')
  t.strictEquals(sentMessage.please, true, 'message data is correctly set')

  // Test regular responses.

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

  // Test await
  const promise = remote.some.request.await()

  t.strictEquals(mockSocket.listeners.length, 2, 'await listener is added')

  // Schedule mock response.
  const originalMessage = JSON.parse(mockSocket.sentMessages[1])
  setTimeout(() => {
    remote.some.request.respond(originalMessage, {ok: true})
  }, 100)

  const response = await promise

  t.strictEquals(mockSocket.listeners.length, 1, 'await listener is removed')

  t.strictEquals(response.type, originalMessage.type, 'awaited response type is correct')
  t.strictEquals(response.__id, originalMessage.__id, 'awaited response __id is correct')
  t.strictEquals(response.ok, true, 'awaited response custom value is correct')
})
