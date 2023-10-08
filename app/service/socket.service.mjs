import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import bot from "./telegram.service.mjs";
import fileDirName from "./../../file-dir-name.mjs";
import { ContactService } from "./contact.service.mjs";
const { __dirname } = fileDirName(import.meta);

const DBPATH = "/../../db/connections.json";
const DB = path.normalize(__dirname + DBPATH);

dotenv.config();
export class SocketService {
  MASTERCHATID = process.env.TELEGRAM_MASTERGROUPCHATID;
  contactService = new ContactService();
  constructor() {}

  async saveConnection(id, socket) {
    const now = Date.now();
    const newConnect = {
      id,
      created_at: now,
      updated_at: now,
    };
    await this._updateDb(newConnect, (connections)=>{
      bot.sendMessage(
        this.MASTERCHATID,
        `New visitor(#${id}) connected to zinder. Total visitors now: ${connections.length}`
      );
      this.newuserjoined$(newConnect, socket);
    });
  }
  newuserjoined$(newConnect, socket){
    socket.emit("newuserjoined", newConnect);
    console.log("newConnect");
    console.log(newConnect);

  }
  getChatContact$(socket){
    socket.emit("fetchChatContacts", this.contactService.chatDB);

  }
  newMessage$(socket){
    socket.emit("fetchChatContacts", this.contactService.chatDB);

  }
  async _updateDb(connection, callback) {
    const dbJson = fs.readFileSync(path.join(DB));
    const connections = JSON.parse(dbJson);
    // console.log(connections)
    connections.unshift(connection);
    // console.log(connections)
    return fs.writeFile(
      path.join(path.normalize(__dirname + DBPATH)),
      JSON.stringify(connections, null, 2),
      (err)=>{
        // console.log(err);
        callback(connections);
      }
    );
  }
}
