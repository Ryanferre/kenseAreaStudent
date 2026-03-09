import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { verifyAccess } from "./verifyacesstoken.js";

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", async (request: any, reply: any) => {
    // libera OPTIONS (CORS preflight)
    if (request.method === "OPTIONS") {
      console.log("passando pelo options");
      return;
    }

    console.log("midlleware chamado com a rota: ", request.url)

    // ignora qualquer rota do Socket.IO
    if (request.url.startsWith("/socket.io/")) {
      console.log("Handshake do Socket.IO ignorando middleware global");
      return;
    }

    console.log("middleware global foi chamado", request.headers);
    const auth = request.headers?.authorization;

    if (!auth?.startsWith("Bearer ")) {
      return reply.status(401).send({ error: "Missing service token" });
    }

    const token = auth.split(" ")[1];

    try {
      // libera rota específica
      if (request.method === "POST" && request.url === "/speakingteste") {
        return;
      }
      if (request.method === "POST" && request.url === "/writingteste") {
        return;
      }

      const payload = verifyAccess(token);
      request.service = payload;

      console.log("resultado de payload:", request.service);
      return;
    } catch {
      return reply.status(403).send({ error: "Invalid service token" });
    }
  });
};

// 🔑 O `fp()` garante que o plugin funcione globalmente
export default fp(authPlugin);