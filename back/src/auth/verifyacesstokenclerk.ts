import { jwtVerify, createRemoteJWKSet } from 'jose'

const JWKS = createRemoteJWKSet(
  new URL('https://enjoyed-husky-33.clerk.accounts.dev/.well-known/jwks.json')
)

export async function authenticate( request: any, reply: any ) {
  const auth = request.headers.authorization
  if (!auth) {
    return reply.status(401).send({ error: 'No token' })
  }

  const token = auth.replace('Bearer ', '')

  const { payload } = await jwtVerify(token, JWKS)

  // 🔥 A LINHA MAIS IMPORTANTE DO SEU BACK
  request.user = payload

  console.log('👤 payload do JWT:', payload)
}