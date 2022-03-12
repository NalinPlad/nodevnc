const http = require('http');
const path = require('path');
const robot = require("robotjs");
const fs = require("fs");

function scale (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            
            var x,_y,y,screenWidth,screenHeight;

            var obj = JSON.parse(body);
            console.log(obj);
            switch(obj.name){
                case 'mouseMovement':
                    x = obj.value[0];
            
                    _y = obj.value[1];  
                    y = scale(_y,0,1536,0,1600);
                    robot.moveMouse(x,y);
                    break;
                case 'click':
                    robot.mouseClick('left');
                    
                    break;
            }

            // screenWidth = obj.value[0];
            // screenHeight = obj.value[1];
            res.end('ok');
        });
    }
    else {
        fs.readFile('web/index.html', 'utf8' , (err, data) => {
            if (err) {
              console.error(err)
              return
            }

            res.end(data);

          })
    }
});
server.listen(3000);