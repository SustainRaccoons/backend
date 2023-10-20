import cors from "cors";
import type { Express } from "express";
import express from "express";
import helmet from "helmet";
import type { Server } from "http";

let expressApp: Express;
let started = false;

export async function startExpress() {
  if (started) {
    return;
  }

  expressApp = express();

  expressApp.set("trust proxy", true);

  expressApp.use(helmet());
  expressApp.use(cors({
    origin: true,
    credentials: true,
  }));
  expressApp.use(express.json());

  expressApp.get("/", (_req, res) => {
    res.json("Hi?");
  });

  const server = await new Promise<Server>(resolve => {
    const server = expressApp.listen(8080, () => resolve(server));
  });

  started = true;
  const address = server.address()!;
  console.log(`Express: Started (port ${typeof address === "string" ? address : address.port})`);
}
