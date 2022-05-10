const https = require('https')
const http = require('http')
const fs = require('fs')
const express = require('express')
const cors = require('cors')

const port = 9000;

const app = express();
app.use(express.static('public'));

const server = http.createServer(app)

server.listen(process.env.PORT || port, () => console.log(`Server is running on port ${port}`))