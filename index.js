const assert = require('assert');

const is = require('is');
const ms = require('ms');
const debug = require('debug')('maybe:gc');

const defaultRate = 10 * 60 * 1000; // 10 minutes
const queue = [];
let intervalTimes = 0;
let realRate = 0;

/**
 * gc
 *
 * @param {object} instance
 * @param {function} instance.gc
 * @param {string} instance.gcType
 * @param {number|string} interval
 */
function gc(instance = {}, interval = defaultRate, rate = defaultRate) {
  assert(is.function(instance.gc), 'instance.gc must be a function');

  if (is.string(interval)) {
    interval = ms(interval);
  }

  queue.push(() => {
    const num = Math.floor(interval / realRate);
    if (intervalTimes % num !== 0) {
      return;
    }
    debug(`run gc, type: ${instance.gcType || 'unknown'}`);
    instance.gc();
  });

  if (realRate === 0) {
    realRate = is.string(rate) ? ms(rate) : rate;
    const timer = setInterval(() => {
      intervalTimes += 1;
      queue.forEach(gcQueueHandle => gcQueueHandle());
    }, realRate);
    timer.unref();
  }
}

module.exports = gc;
