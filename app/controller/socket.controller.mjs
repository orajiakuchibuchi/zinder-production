
import dotenv from "dotenv";
import bot from "../service/telegram.service.mjs";
import fileDirName from "../../file-dir-name.mjs";
import { SocketService } from "../service/socket.service.mjs";

const { __dirname } = fileDirName(import.meta);

const DBPATH = "/../../db/data/telegram.json";

dotenv.config();


export class SocketController {
  socketservice = new SocketService();
  constructor() {
  }
  // Public method to set save a socket session ID
  init(socket){
    this.socketservice.saveConnection(socket.id);
  }
  connection(socket){
    this.socketservice.saveConnection(socket.id);
  }
}
