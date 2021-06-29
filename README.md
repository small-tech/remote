# @small-tech/remote

Remote is a tiny (< 100 lines of code), expressive, and elegant isomorphic JavaScript WebSocket interface.

## Installation

```shell
npm install @small-tech/remote
```

## Usage

### Initialisation

```js
import Remote from '@small-tech/remote'

// Works in the browser and Node.js (use, e.g., ws module on the latter)
const socket = new WebSocket('wss://my.socket/')
const remote = new Remote(socket)
```

### Regular messaging

```js
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
```

### Request/response via await

First node:

```js
// Request
const response = remote.my.fancy.request.await({ optional: data })
```

Second node:

```js
// Response
remote.my.fancy.request.handler = message => {
  remote.my.fancy.request.respond(message, { optional: data })
}
```

### Handling and sending the same message type

```js
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

## How it works

Messages are sent as JSON strings and received messages are parsed from JSON strings.

The syntax of Remote is as follows:

__`remote`__`.some.custom.message.type.`__`action`__

Calls start with a reference to the `Remote` instance and ends with an action. Anything in between the two comprises the message type.

So `remote.my.fancy.message.type.send()` sends a message of type `my.fancy.message.type`.

Valid actions are:

  - `send`: _(function)_ sends a message.
  - `respond`: _(function)_ like send but takes a reference to the original message and replies using its ID. Used in conjuction with `await` on the other node.
  - `await`: _(function)_ returns a promise that resolves once the other node as responded to the message.
  - `handler`: _(property)_ used to define a message handler.

Note that Remote automatically creates the object hierarchy defined by the message type (thanks to the magic of proxies).

## Important note: don’t pass references to Remote instances to child components

On the client, you might feel the need to pass references to Remote instance to child components in your interface.

Don’t.

Remember that each Remote instance keeps its own list of event handlers. If you pass a reference to a Remote instance to a child component (e.g., using a SvelteKit property) and define an event handler there that was already defined on the parent (or a sibling) component, you will end up overwriting it.

Instead, pass references to the original socket and create a new Remote instance in each component that you want to make use of the Remote interface.

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
