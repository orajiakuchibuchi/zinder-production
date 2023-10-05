import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import bot from "./telegram.service.mjs";
import fileDirName from "./../../file-dir-name.mjs";
const { __dirname } = fileDirName(import.meta);

const DBPATH = "/../../db/connections.json";
const DB = path.normalize(__dirname + DBPATH);

dotenv.config();
export class SocketService{
  MASTERCHATID = process.env.TELEGRAM_MASTERGROUPCHATID;
    constructor(){}

    saveConnection(id){
        const now = Date.now();
        const newConnect = {
          id,
          created_at: now,
          updated_at: now,
        }
        this._updateDb(newConnect);
        const dbJson = fs.readFileSync(path.join(DB));
        const connections = JSON.parse(dbJson);
        bot.sendMessage(this.MASTERCHATID, `New visitor(#${id}) connected to zinder. Total visitors now: ${connections.length}`)
    }
    _updateDb(connection){
      const dbJson = fs.readFileSync(path.join(DB));
      const connections = JSON.parse(dbJson);
      connections.unshift(connection);
      return fs.writeFileSync(path.join(
          path.normalize(__dirname + DBPATH)
      ), JSON.stringify(connections, null, 2));
  }

}
