const Promise = require('bluebird')
const _ = require('lodash')

const {services} = require('./services')
const {telegram, messages, defaults} = require("./config/configs")
const {keyboardGenerator} = require("./keyboardGenerator")
const {cache} = require("./cache")

const handlers = {
  start (bot, message, params) {
    bot.sendMessage(message.chat.id, 'Hello telegramer!')
    cache.setState(message.chat.id,{
      nextHandler: 'greeting'
    })
  },
  greeting (bot, message) {
    bot.sendMessage(message.chat.id, `how are you?`, {
      reply_markup: {
        inline_keyboard: keyboardGenerator({
          greeting: 'Greeting again!',
          start: 'Say Hi!'
        }, 2)
      }
    })
    cache.clearState(message.chat.id)
  }
}

module.exports = {handlers}
