"use strict"
const request = require('request')
const _       = require('lodash')
const Promise = require('bluebird')

const {services: servicesConfig} = require('./config/configs')

const privates = {
  parse (endpoint, params) {
    let parsed = endpoint
    _.each(params, (item, key) => {
      parsed = parsed.replace(key, item)
    })
    parsed = parsed.split(' ')
    return { method: parsed[0], path: parsed[1] }
  },
  params (endpoint, args) {
    const paramNames = endpoint.match(/{[^}]+}/g) || []
    const params = {}
    if(paramNames.length > args.length){
      let message = ''
      _.each(paramNames, name => {
        message += `\n- ${name}`
      })
      throw new Error(`Wrong arguments. Following arguments should be passed in order:${message}`)
    }
    _.each(paramNames, (name, i) => {
      params[name] = args[i]
    })
    return params
  },
  send (endpoint, args, config) {
    const params = privates.params(endpoint, args)
    let parsedEndpoint = privates.parse(endpoint, params)
    let data = null
    if(parsedEndpoint.method != 'GET' && args.length > _.keys(params).length)
      data = args[args.length - 1]
    const options = {
      method: parsedEndpoint.method,
      url: `${config.base}${parsedEndpoint.path}`,
      headers: config.authHeaders
    }
    if(data && parsedEndpoint.method != 'GET') {
      options.body = JSON.stringify(data)
      options.headers['Content-Type'] = 'application/json'
    }
    return new Promise((resolve, reject) => {
      request(options, (err, response, body) => {
        if(err) return reject(err)
        body = (body) ? JSON.parse(body) : {}
        if(response.statusCode > 299) return reject(body)
        resolve(body.data)
      })
    })
  },
  makeFunction (endpoint, config) {
    if(typeof endpoint == 'object') {
      const methods = {}
      _.each(endpoint, (subEndpoint, name) => {
        methods[name] = privates.makeFunction(subEndpoint, config)
      })
      return methods
    }
    return function () {
      return privates.send(endpoint, arguments, config)
    }
  }
}
const services = {}
_.each(servicesConfig, service => {
  services[service.config.name] = privates.makeFunction(service.endpoints, service.config)
})
module.exports = {services}
