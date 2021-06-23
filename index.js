//////////////////////////////////////////////////////////////////////
//
// Remote
//
// A little class for messaging with sockets.
//
// Copyright © 2020 Aral Balkan, Small Technology Foundation.
// License: ISC.
//
//////////////////////////////////////////////////////////////////////

const getKeyPath = require('keypather/get')

class Remote {
  constructor (socket) {
    this.socket = socket
    this.keyPath = ''

    socket.addEventListener ('message', event => {
      // Call the correct handler based on the event type key path.
      const message = JSON.parse(event.data)
      const handler = getKeyPath(this, message.type)
      if (typeof handler !== 'function') {
        console.warn(`Remote: Unhandled message (type: ${message.type})`)
      } else {
        handler(message)
      }
    })

    const handler = {
      get: (self, keyPath) => {
        if (self[keyPath] === undefined) {

          // The key doesn’t exist. If this is a request,
          // fire it off. If not, create the key.

          if (keyPath === 'request') {
            return (message) => {
              this.socket.send(JSON.stringify(Object.assign({
                type: `${self.keyPath}.request`
              }, message)))
            }
          }

          self[keyPath] = {}
          self[keyPath].keyPath = self.keyPath === '' ? keyPath : `${self.keyPath}.${keyPath}`
          return new Proxy(self[keyPath], handler)
        }
        return self[keyPath]
      }
    }

    return new Proxy(this, handler)
  }
}
module.exports = Remote
