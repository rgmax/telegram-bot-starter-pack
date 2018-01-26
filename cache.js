const redis = require("redis").createClient()
const Promise = require('bluebird')
const _ = require('lodash')

const {telegram} = require("./config/configs")

const cache = {
  setState (id, state) {
    const stateKey = `${telegram.botName}:${id}:state`
    return cache.set(stateKey, state)
  },
  getState (id) {
    const stateKey = `${telegram.botName}:${id}:state`
    return cache.get(stateKey)
  },
  clearState (id) {
    const stateKey = `${telegram.botName}:${id}:state`
    return cache.delete(stateKey)
      .catch(err => {
        return true
      })
  },
  addToState (id, data) {
    return cache.getState(id)
      .then(state => {
        if(state)
          data = _.merge(state, data)
        return cache.setState(id, data)
      })
  },
  set(key ,data) {
    return new Promise((resolve, reject) => {
      redis.set(key, JSON.stringify(data), (err, reply) => {
        if(err || !reply) {
          reject('data not saved')
        }
        return resolve(reply)
      })
    })
  },
  get(key) {
    return new Promise((resolve, reject) => {
      redis.get(key,  (err, reply) => {
        if(err) {
          return reject(err)
        }
        if(!reply)
          return resolve(false)
        const data = JSON.parse(reply)
        return resolve(data)
      })
    })
  },
  delete(key) {
    return new Promise((resolve, reject) => {
      redis.del(key,  (err, reply) => {
        if(err || !reply) {
          return reject('deleting data failed')
        }
        const data = JSON.parse(reply)
        return resolve(data)
      })
    })
  },
}

module.exports = {cache}