const { EventEmitter } = require('events');

const eventEmitter = new EventEmitter();
global.eventEmitter = eventEmitter;

module.exports = eventEmitter;

