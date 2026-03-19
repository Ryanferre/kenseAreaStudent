import crypto from 'node:crypto';

export async function acessUser(req: any, res: any){
  try {
    const {hash, dataURl}= req.body

    console.log("dados chegando na função: ", hash, dataURl)

    const secret= process.env.SERVICE_SECRET!;

    if (!hash || !dataURl) {
       return res.send("Link inválido ou incompleto");
    }

    //`${userID}|${tests}`
    //dados concatenados:  user_3Aa9dvEwYArWYLO3E3vP8bLEWJM|reading,listening

    const dataToVerify = `${dataURl.userData}|${dataURl.listeingData}|${dataURl.className}|${dataURl.classID}`;

    console.log("dados concatenados: ", dataToVerify)
    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(dataToVerify, 'utf8') 
        .digest("hex");

    // 3. Compara de forma segura
    const hashBuffer = Buffer.from(hash, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    console.log("os dois dados: ", hash, expectedSignature)

    if (hashBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(hashBuffer, expectedBuffer)) {
        console.log("dados que não passaram: ", hashBuffer, crypto.timingSafeEqual(hashBuffer, expectedBuffer))
        return res.status(400).send({ success: false, message: "Atenção: O link foi modificado!" });
    }else{
      console.log("dados passaram na verificação: ", dataToVerify)

      return res.status(200).send({ success: true, data: dataToVerify });
    }
  } catch (error: any) {
    console.log("erro ao decodificar dados: ", error)    
  }
}