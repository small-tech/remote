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
const { v4: uuid } = require('uuid')

class Remote {
  constructor (socket) {
    this.socket = socket
    this.keyPath = ''

    socket.addEventListener ('message', event => {
      // Call the correct handler based on the event type key path.
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
            return (message = {}) => {
              this.socket.send(JSON.stringify(Object.assign({
                type: self.keyPath
              }, message)))
            }
          }

          // These two methods are used for RPC-style request/response
          // messages that you can await.

          if (keyPath === 'respond') {
            return (originalMessage, response = {}) => {
              this.socket.send(JSON.stringify(Object.assign({
                type: self.keyPath,
                __id: originalMessage.__id
              }, response)))
            }
          }

          if (keyPath === 'await') {
            return async (message = {}) => {
              const __id = uuid()
              this.socket.send(JSON.stringify(Object.assign({
                type: self.keyPath,
                __id
              }, message)))
              return new Promise((resolve, reject) => {
                const listener = (event => {
                  const message = JSON.parse(event.data)
                  if (message.__id === __id) {
                    this.socket.removeEventListener('message', listener)
                    if (message.error) {
                      reject(message)
                    } else {
                      resolve(message)
                    }
                  }
                }).bind(this)
                this.socket.addEventListener('message', listener)
              })
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
