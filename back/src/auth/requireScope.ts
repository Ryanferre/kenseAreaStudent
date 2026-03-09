import { FastifyRequest, FastifyReply } from "fastify";

export function requireScope(scope: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    console.log("📦 scopes no token:", request.service.scope);
    const payload = request.service;

    const authorized = payload.scope?.includes(scope);

    if (!authorized) {
        console.log("verificando escopo: ", authorized)
      return reply.status(403).send({
        information: "Forbidden"
      });
    }else{
        console.log("✅ acesso autorizado")
    }
  };
}