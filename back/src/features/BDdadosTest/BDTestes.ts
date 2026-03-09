import {Redis} from "ioredis";
const redis = new Redis();

export async function SaveResultsTeste(UserId: string, Data: any){
 await redis.set(`TesteOCR:${UserId}`,JSON.stringify(Data))


 const data = await redis.get(`TesteOCR:${UserId}`)

 console.log("dados do usuario: ", data)
}