const express = require("express");
const cors = require('cors');
const http = require("http");
const https = require("https");
const fs = require("fs")

var privateKey  = fs.readFileSync('public/key.pem', 'utf8');
var certificate = fs.readFileSync('public/server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

const port = 8080;

const app = express();
app.use(express.static(__dirname + "/public"));
app.use(cors());

const appS = express();
appS.use(express.static(__dirname + "/public"));
appS.use(cors());


const server = http.createServer(app);
const httpsServer = https.createServer(credentials, appS);
const io = require("socket.io")(server);
const ioHTTPS = require("socket.io")(httpsServer);

io.sockets.on("error", e => console.log(e));
ioHTTPS.sockets.on("error", e => console.log(e));
server.listen(port, () => console.log(`Server is running on port number ${port}`));
httpsServer.listen(8443, () => console.log(`Server is running on port 8443`));

let broadcaster;

io.sockets.on("connection", socket => {
    socket.on("broadcaster", () => {
        broadcaster = socket.id;
        socket.broadcast.emit("broadcaster");
    });
    socket.on("watcher", () => {
        socket.to(broadcaster).emit("watcher", socket.id);
    });
    socket.on("disconnect", () => {
        socket.to(broadcaster).emit("disconnectPeer", socket.id);
    });
    socket.on("offer", (id, message) => {
        socket.to(id).emit("offer", socket.id, message);
    });
    socket.on("answer", (id, message) => {
        socket.to(id).emit("answer", socket.id, message);
    });
    socket.on("candidate", (id, message) => {
        socket.to(id).emit("candidate", socket.id, message);
    });
});

ioHTTPS.sockets.on("connection", socket => {
    socket.on("broadcaster", () => {
        broadcaster = socket.id;
        socket.broadcast.emit("broadcaster");
    });
    socket.on("watcher", () => {
        socket.to(broadcaster).emit("watcher", socket.id);
    });
    socket.on("disconnect", () => {
        socket.to(broadcaster).emit("disconnectPeer", socket.id);
    });
    socket.on("offer", (id, message) => {
        socket.to(id).emit("offer", socket.id, message);
    });
    socket.on("answer", (id, message) => {
        socket.to(id).emit("answer", socket.id, message);
    });
    socket.on("candidate", (id, message) => {
        socket.to(id).emit("candidate", socket.id, message);
    });
});