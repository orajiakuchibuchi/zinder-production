// Doc : https://www.npmjs.com/package/json-server
// Doc 2: https://github.com/passageidentity/example-node/blob/main/02-Login-With-Profile/index.js

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import compression from "compression";
import {Server} from "socket.io";
import fileDirName from './file-dir-name.mjs';
import crons from "./app/cron/index.mjs";
import bot from "./app/service/telegram.service.mjs";
import { SocketService } from "./app/service/socket.service.mjs";
import { SocketController } from "./app/controller/socket.controller.mjs";
dotenv.config();
const SEC_PORT = '7001';
const NODE_ENV_PORT = process.env.PORT || process.env.NODE_ENV;
const PORT = NODE_ENV_PORT || SEC_PORT;
const { __dirname } = fileDirName(import.meta);
const app = express();
const server = http.createServer(app);
// where '/dist/admin' is the final built directory
const staticRoot = __dirname + '/public/';

app.set('port', PORT);

const io = new Server(server,  {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  })

// Compression middleware
app.use(compression());
/* other middleware */

// For Every Client Connection, This Event is triggered.
// A new socketcontroller object is created and with the socket instance via the `init` method.
io.on('connection', (socket) =>{
  const socketcontroller = new SocketController();
  socketcontroller.init(socket);
  socket.on('fetchContactRequest', ()=>socketcontroller.getContacts(socket));
  socket.on('new_message', ()=>socketcontroller.newMessage(socket));
});

/* place any backend routes you have here */

// Contact Api
app.get('contact',(req, res)=>{
  return
})

/* end of backend routes */
app.use(function(req, res, next) {

    //if the request is not html then move along
    var accept = req.accepts('html', 'json', 'xml');
    if (accept !== 'html') {
        return next();
    }

    // if the request has a '.' assume that it's for a file, move along
    var ext = path.extname(req.path);
    if (ext !== '') {
        return next();
    }

    fs.createReadStream(staticRoot + 'index.html').pipe(res);

});

app.use(express.static(staticRoot));

// app.listen wont work as it creates a new app!!
server.listen(app.get('port'), function() {
    console.log('app running on port', app.get('port'));
});
