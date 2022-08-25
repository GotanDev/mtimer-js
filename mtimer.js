'use strict'
/** Timer manager.
 *
 * Override global JS functions setTimeout() & setInterval()
 * to allow management task on them
 *
 * @author Damien Cuvillier <damien@gotan.io>
 * @License MIT
 *
 * Feel free to thanks: https://tinyurl.com/2kh78j52
 * */

// Overriding originals
window.originalSetTimeout = window.setTimeout;
window.originalSetInterval = window.setInterval;
window.originalClearTimeout = window.clearTimeout;
window.originalClearInterval = window.clearInterval;


/** Global repository of all active timers (interval & timeouts)
 * @type [
 * {
 *     id: number,
 *     type: 'interval'|'timeout',
 *     functionName: string,
 *     delay: number,
 *     startTime: Date
 * },
 * ]
 *
 */
window.timers = [];

/** Generic Timer (interval ou timeout representation */
class Timer{
    constructor (id, type, functionName, delay) {
        this.id = id;
        this.type = type;
        this.functionName = functionName;
        this.delay = delay;
        this.startTime = new Date();
    }
}

/** The setTimeout() method of the WindowOrWorkerGlobalScope mixin
 *  sets a timer which executes a function or specified piece of code once the timer expires.
 *
 * Override setTimeout basic function to allow timers management.
 *
 * @param callbackFunction Function to callback after delay
 * @param delay Delay in ms
 * @param args As many arguments as your need
 * @returns number timeoutId of created timeout
 */
window.setTimeout = function(callbackFunction, delay, ...args) {
    let cmd = 'window.originalSetTimeout(func,delay'
    for (let i = 0; i < arguments.length ; i ++) {
        cmd += ", args[" + i + "]";
    }
    cmd += ');';
    /* We use deprecated eval syntax to deal with ...arguments syntax
     * Otherwise, it sends an args[] array.
     */
    const id = eval (cmd);

    window.originalSetTimeout(clearTimer, delay, id);
    window.timers.push(new Timer(id, 'timeout', callbackFunction.name, delay));
    return id;
};
/** The setInterval() method, offered on the Window and Worker interfaces
 * repeatedly calls a function or executes a code snippet, with a fixed time delay between each call.
 * It returns an interval ID which uniquely identifies the interval, so you can remove it later by calling clearInterval().
 * This method is defined by the WindowOrWorkerGlobalScope mixin.
 *
 * @param callbackFunction
 * @param delay Delay in ms
 * @param args As many arguments as your need
 * @returns number intervalId of created interval
 */
window.setInterval = function(callbackFunction, delay, ...args) {
    let cmd = 'window.originalSetInterval(func,delay'
    for (let i = 0; i < args.length ; i ++) {
        cmd += ", arguments[" + i + "]";
    }
    cmd += ');';
    /* We use deprecated eval syntax to deal with ...arguments syntax
    * Otherwise, it sends an args[] array.
    */
    const id = eval(cmd);
    window.timers.push(new Timer(id, 'interval', callbackFunction.name, delay));
    return id;
};

/** Clear specific timeout from its ID
 * (created by setTimeout function)
 * @param timeoutId
 */
window.clearTimeout = function(timeoutId) {
    clearTimer(timeoutId);
    window.originalClearTimeout(timeoutId);
};
/** Clear specific interval from its intervalId
 * (created by setInterval function)
 * @param intervalId
 */
window.clearInterval = function(intervalId) {
    clearTimer(intervalId);
    window.originalClearInterval(intervalId);
};

/** Clear a timer from its id
 * @param timerId (either created by setInterval ou setTimeout functions)
 */
window.clearTimer = function(timerId)  {
    let searchTimer = window.timers.filter(t => t.id === timerId);

    if (searchTimer.length > 0) {
        if (searchTimer[0].type === 'timeout') {
            window.originalClearTimeout(searchTimer[0].id);
        } else if (searchTimer[0].type === 'interval') {
            window.originalClearInterval(searchTimer[0].id);
        }
        const idx = window.timers.indexOf(searchTimer[0]);
        window.timers.splice(idx,1);
    }
};

/** Reset all known active timers (timeouts and intervals)
 *
 * @param type (optional): interval|timeout
 *  you can specify either timeout or interval
 *  default: both
 * @returns number how many timers have been erased
 */
window.clearTimers = function (type) {
    let timers;
    if (type == null) {
        timers = window.timers;
    } else {
        timers = window.timers.filters(t => t.type === type);
    }
    const count = timers.length;
    timers.forEach(t => window.clearTimer(t.id));
    return count;
};