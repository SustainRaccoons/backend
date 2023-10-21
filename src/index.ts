import crypto from "crypto";
import { Server, WebSocket } from "ws";

const server = new Server({
  port: 8080,
});

interface Game {
  id: string,
  state: string,
  isHostWhite: boolean,
  host: WebSocket,
  player?: WebSocket,
}

let games: Game[] = [];
server.on("connection", (socket: WebSocket) => {
  console.log("conn");

  socket.on("message", (e: Buffer) => {
    const msg = e.toString("utf-8");
    console.log(msg);
    if (msg === "host") {
      const id = crypto.randomBytes(3).toString("hex");
      const white = Math.random() > .5;
      games.push({
        id,
        state: "",
        isHostWhite: white,
        host: socket,
        player: undefined,
      });

      socket.send(`id:${id}`);
      socket.send(`side:${white ? "white" : "black"}`);
      return;
    }

    if (msg.startsWith("join:")) {
      const id = msg.substring(5);
      const game = games.find(v => v.id === id);
      if (!game) {
        socket.send("join:fail");
      } else {
        game.player = socket;
        socket.send("join:success");
        game.host.send("join:success");
        socket.send(`state:${game.state}`);
        socket.send(`side:${game.isHostWhite ? "black" : "white"}`);
      }
      return;
    }

    if (msg.startsWith("state:")) {
      const state = msg.substring(6);
      const game = games.find(v => v.host === socket || v.player === socket);
      if (!game) {
        socket.send("state:fail");
        return;
      }
      game.state = state;
      if (game.host === socket) {
        if (game.player) {
          game.player.send(`state:${state}`);
        }
      } else {
        game.host.send(`state:${state}`);
      }
    }
  });

  socket.on("close", () => {
    const game = games.find(v => v.host === socket || v.player === socket);
    games = games.filter(v => v != game);

    if (!game) {
      return;
    }

    if (game.host === socket) {
      if (game.player) {
        game.player.send("close");
      }
    } else {
      game.host.send("close");
    }
  });
});
