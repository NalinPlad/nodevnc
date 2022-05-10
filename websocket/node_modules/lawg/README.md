lawg
--------

An onomatopoeia on "log".

Sample code
  
    var log = require("lawg")
    
    log( 1, " word ", new Error("err"), [1,2], { x : 1, y: {a : 2}})
    
Outputs
 
    [Jan 09 2015 13:39:42.786 GMT+0800] 1 word [Error: err][ 1, 2 ]{ x: 1, y: { a: 2 } }
     

If the "NODE_DEBUG" environment variable is set, the source code location is printed 
immediately after timestamp.  Output looks like:

    [Jan 09 2015 13:39:42.786 GMT+0800](lawg/index.js:60:10) 1 word [Error: err][ 1, 2 ]{ x: 1, y: { a: 2 } }
    
 
    