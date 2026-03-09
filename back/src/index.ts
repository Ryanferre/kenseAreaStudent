import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import { Server as SocketIOServer } from "socket.io";
import authPlugin from "./auth/middleware.js";
import dotenv from "dotenv";
dotenv.config();

import { filaspeakingteste } from "./features/routes/routeSpeaking/workerspeaking.js";
import urlspeaking from "./features/routes/routeSpeaking/edpointSpeakint.js";
import urlsoket from "./features/routes/routerAutSoket/autsoket.js";
import urllistenig from "./features/routes/routerListening/edpointListening.js"
import urlWriting from "./features/routes/routerWriting/edpointWriting.js"
import { filawritingteste } from "./features/routes/routerWriting/workerListening.js";

const fastify = Fastify({ logger: true });

// plugins
await fastify.register(cors, { origin: "*" });
await fastify.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } });
await fastify.register(authPlugin);

// rotas
fastify.route(urlspeaking);
fastify.route(urlsoket);
fastify.route(urllistenig)
fastify.route(urlWriting)

// socket.io
let io: SocketIOServer;

fastify.register(async (instance) => {
  io = new SocketIOServer(instance.server, {
    cors: {
      origin: ["http://localhost:5174", "http://localhost:3000"],
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket conectado:", socket.id);

    const { token, userId } = socket.handshake.auth;

    if (token !== process.env.SERVICE_SECRET) {
      socket.disconnect();
      return;
    }
    //inicia sala de speaking
    socket.on("speaking:join", () => {
      socket.join(`speaking:${userId}`);
    });
    //inicia sala de listening
    socket.on("listening:join", () => {
      socket.join(`listening:${userId}`);
    });
    //iniciar sala de writinig
    socket.on("writing:join", () => {
      socket.join(`writing:${userId}`);
    });
  });
});

// 🚀 sobe o servidor
const PORT = Number(process.env.PORT) || 4000;
await fastify.listen({ port: PORT, host: "0.0.0.0" });

console.log("🚀 Fastify online");

// ⏱️ inicia worker FORA do lifecycle do Fastify
setImmediate(() => {
  console.log("🔥 Iniciando worker speaking");
  filaspeakingteste(io).catch(console.error);
  filawritingteste(io).catch(console.error);
});