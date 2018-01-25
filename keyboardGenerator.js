const _ = require('lodash')

const keyboardGenerator = (data, keysPerRow = 3) => {
  const keys = []
  _.each(data, (text, callback_data) => {
    keys.push({
      text, callback_data
    })
  })
  return _.chunk(keys, keysPerRow)
}

module.exports = {keyboardGenerator}
