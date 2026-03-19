import { jwtVerify, createRemoteJWKSet } from 'jose'

const JWKS = createRemoteJWKSet(
  new URL('https://living-narwhal-12.clerk.accounts.dev/.well-known/jwks.json')
)

export async function authenticateClerck( token: any ) {
  try {
  console.log("token chegou: ", token)
  
  if (!token) {
    console.log("não é um token")
    return ({ error: 'No token' })
  }

  const tokenAcess = token.replace('Bearer ', '')

  const { payload } = await jwtVerify(tokenAcess, JWKS)

  console.log("payload no clerck: ", payload)
  

  // 🔥 A LINHA MAIS IMPORTANTE DO SEU BACK
  return payload
   
  } catch (error: any) {
    console.log("erro ao verificar jwt: ", error)
  }
}