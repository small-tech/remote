# @small-tech/remote

A little class for messaging with sockets.

## Usage

```js
import Remote from '@small-tech/remote'

// e.g., In the browser (you can also use it in Node)
const socket = new WebSocket('wss://my.socket/')
const remote = new Remote(socket)

// Handle messages of type my.fancy.response
remote.my.fancy.response.handler = message => {
  console.log('I got a fancy response', message)
}

// Handle messages of type my.fancy.progress
remote.my.fancy.progress.handler = message => {
  console.log('Progress: ', message.progress)
}

// Send a message of type my.fancy.request
remote.my.fancy.request.send({
  please: true
})

// You can also send and handle the same message type.

// Handle messages of type 'chat'.
remote.chat.handler = message => {
  console.log('Received message:', message.from, message.body)
}

// Send a message of type 'chat'.
remote.chat.send({
  from: 'Aral',
  body: 'Hello!'
})
```

Messages are sent as JSON strings and received messages are parsed from JSON strings.

__Note:__ `send` is a special method used when sending a message. Similarly, `handler` is a special method used to handle received messages.

Otherwise, there is nothing special about the path segments that make up the event name and the Remote class will create the object hierarchies defined by them automatically.

## Test

```shell
npm run test
```

Note: the tests use `EventTarget` and require Node 16. The module itself should work on Node LTS (14.x as of this writing) and browsers.

## Coverage

```shell
npm run coverage
```

## Like this? Fund us!

[Small Technology Foundation](https://small-tech.org) is a tiny, independent not-for-profit.

We exist in part thanks to patronage by people like you. If you share [our vision](https://small-tech.org/about/#small-technology) and want to support our work, please [become a patron or donate to us](https://small-tech.org/fund-us) today and help us continue to exist.

## Copyright

&copy; 2021-present [Aral Balkan](https://ar.al), [Small Technology Foundation](https://small-tech.org).

## License

[ISC](./LICENSE)
