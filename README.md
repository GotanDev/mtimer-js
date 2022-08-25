# MTimer JS

Managed Timers (interval & timemout) for Javascript

Override default `setInterval` and `setTimeout` functions 
to allow better management. 

Allows to list, stop, clear any launched timer. 

## Setup

* NPM  
```bash
npm i mtimer-js
```
* Bower  
```bash
bower install --save git@github.com:GotanDev/mtimer-js.git
```

## Documentation

* Just use `setTimeout` & `setInterval`, `clearInterval`, `clearTimeout` functions as usual
* `window.timers` global variable includes now all active timers details.  
Each items has the following structure:  
```js
{
    id: Number,
    type: 'interval'|'timeout',
    functionName: String,
    delay: Number,
    startTime: Date
}
```
* Additionally on overrided basic functions , you can also get 2 additionnal functions:
  * `clearTimer(timerId:number)`:  
  Clear a timer from its id  
  (either created by setInterval ou setTimeout functions)
  * `clearTimers(typeFilter: 'interval'|'timeout')`:  
  Reset all known active timers (timeouts and intervals)
    You can specify either timeout or interval   
    Default value: both

## Sample

[CodePen](https://codepen.io/damiencuvillier/pen/RwMmGPW)

## Licence 

[MIT](https://opensource.org/licenses/MIT)
