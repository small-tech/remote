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

const keyd = require('keyd')

class Remote {
  constructor (socket) {
    this.socket = socket
    this.keyPath = ''

    socket.addEventListener ('message', event => {
      // Call the correct handler based on the event type key path.
      console.log('Got message', event.data)
      const message = JSON.parse(event.data)
      const handler = keyd(this).get(`${message.type}.handler`)
      if (typeof handler === 'function') {
        handler(message)
      }
    })

    const handler = {
      get: (self, keyPath) => {
        if (self[keyPath] === undefined) {

          // The key doesn’t exist. If this is a request,
          // fire it off. If not, create the key.

          if (keyPath === 'send') {
            return (message) => {
              this.socket.send(JSON.stringify(Object.assign({
                type: self.keyPath
              }, message)))
            }
          }

          self[keyPath] = {}
          self[keyPath].keyPath = self.keyPath === '' ? keyPath : `${self.keyPath}.${keyPath}`
        }
        return new Proxy(self[keyPath], handler)
      }
    }

    return new Proxy(this, handler)
  }
}
module.exports = Remote
