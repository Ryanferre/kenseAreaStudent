import fp from "fastify-plugin"
import {Redis} from "ioredis"
import { FastifyInstance } from "fastify"

async function redisPlugin(fastify: FastifyInstance) {
  const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  })

  redis.on("connect", () => {
    fastify.log.info("🟥 Redis connected")
  })

  redis.on("error", (err: any) => {
    fastify.log.error("Redis error:", err)
  })

  // 🔗 disponibiliza em todo o app
  fastify.decorate("redis", redis)
}

export default fp(redisPlugin)