phuture
--------

A future utility to manipulate javascript timers, because:

- setTimeout and setInterval has callBack as the first parameter, painful to work with
- makes it easier to cancel timer
- makes it easier to readjust timer
- wrap any async function with timeout 
- easy loop

## Installation

    npm install phuture

## Examples
    
    var future = require("phuture")
    
    var onceTask = future.once( 1000, runCb)  // 1 sec in the future
    
    onceTask.cancel();  // cancel timer, will not ever run
    onceTask.finish();  // if not yet run, run immediately then cancel timer, if already run, no affect
    onceTask.result();  // whatever runCb() returned
     
    var manyTask = future.interval( msInterval, runCb)
    
    manyTask.cancel();  // cancel timer, will not ever run
    manyTask.finishAfter(n);  // run n more times, then stop timer
    manyTask.result();        // whatever most recent runCb() returned
    manyTask.resetInterval(msInterval/2)  // run twice faster!
    
    // async loop twice, delay 1s in between
    future.loop(1000, (i, next)=>{
      if (i<2) next();
    })
    
    
See test/test.coffee for more examples.
    
    
     
    
    
