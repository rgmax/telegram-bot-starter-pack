"use strict"
const {telegram} = require("./config/configs")
const {handlers} = require("./handlers")
const {cache} = require("./cache")

const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(telegram.token, {polling: true})


const privates = {
  stateDispatcher (bot, message) {
    cache.getState(message.chat.id)
      .then(state => {
        if(!state)
          return handlers[telegram.defaultCommand](bot, message)
        if(state.nextHandler)
          return handlers[state.nextHandler](bot, message)
      })
      .catch(err => {
        console.log(err)
      })
  }
}

const commandRegex = new RegExp(`\/`)
bot.onText(commandRegex, message => {
  const command = message.text.split(' ')[0].split('/')[1]
  const params = message.text.split(' ').splice(1)
  if(telegram.commands.indexOf(command) >= 0)
    handlers[command](bot, message, params)
})

bot.on('callback_query', query => {
  const command = query.data.split(' ')[0]
  const params = query.data.split(' ').splice(1)
  bot.answerCallbackQuery(query.id)
    .then(() => {
      handlers[command](bot, query.message, params)
    })
})

bot.on('message', message => {
  if(message.text && message.text.indexOf('/') === 0) return
  privates.stateDispatcher(bot, message)
})
