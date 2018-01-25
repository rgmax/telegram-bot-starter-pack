# Telegram bot starter pack

## Quick start
Add your bot token in `config/telegram.json` and run `npm start` and start chatting with your bot.

## State
Bot decides to do next action based on received command or any non-command message.
If command is received, handler with same name will be called to handle logic. If non-command message
is received, bot should know which handler should be called to handle logic. So at the end of
each handler function, next handler function's name should be saved in state so bot can find it at next message.
If next handler will be fired by command, just add `cache.clearState(message.chat.id)` at the end of current handler's logic.
If next handler will be fired by non-command message, set next handler name to state.
For example if your next handler's name is `greeting`, add `cache.setState(message.chat.id, {nextHandler: "greeting"})`
to the end of current handler's logic.

## Keyboard generator
Example:
```javascript
const {keyboardGenerator} = require('./keyboardGenerator')

const keys = {
  "addNewProduct": "Add new product",
  "back": "back to previouse step"
}

const keyboard = keyboardGenerator(keys, 1)
```

## Service
To integrate with your backend APIs, add required info on `config/service.json` file.
For example if you have an API with name `myBackend` on `maybackend.com` which has an endpoint
`GET /users/{userKey}` to get a user's info and authenticated by `myToken`, config is:
```javascript
[
  {
    "config": {
      "name": "myBackend",
      "base": "maybackend.com",
      "authHeaders": {
        "authorization": "myToken"
      }
    },
    "endpoints": {
      "users": {
        "getDetails": "GET /users/{userKey}"
      }
    }
  }
]
```
in your handlers you can call `services.myBackend.users.getDetails("someUserKey")` to get info
of user with key `someUserKey`.
To integrate with multiple APIs, add new config object to the config array. For example:
```javascript
[
  {
    "config": {
      "name": "myBackend",
      "base": "maybackend.com",
      "authHeaders": {
        "authorization": "myToken"
      }
    },
    "endpoints": {
      "users": {
        "getDetails": "GET /users/{userKey}",
        "create": "POST /users"
      }
    }
  },
  {
    "config": {
      "name": "anotherBackend",
      "base": "another-backend.com",
      "authHeaders": {
        "apiKey": "someKey"
      }
    },
    "endpoints": {
      "sellers": {
        "create": "POST /v1/sellers"
      }
    }
  }
]

```

## Allowed commands
To enable bot users to call commands, allowed commands should be added to `config/telegram.json` file.
By default only `start` command is added to the config. Also default command can be set to be handled if
any issue causes cache to be deleted.
