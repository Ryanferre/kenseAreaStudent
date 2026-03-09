import "fastify";
import { ServiceTokenPayload } from "../auth/verifyacesstoken";
import { Redis } from "ioredis"

declare module "fastify" {
  interface FastifyRequest {
    service: ServiceTokenPayload;
  }
}

declare module "fastify" {
  interface FastifyInstance {
    redis: Redis
  }
}