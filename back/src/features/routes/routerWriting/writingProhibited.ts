import { dataWritingTest } from "./workerListening.js"

export async function Writing(req: any, res: any){
    const {userID, answer}= req.body
    console.log("chegada de dados no servidor: ", userID, answer)
    try {
        const sendWorkerWriting= await dataWritingTest(userID, answer)

        console.log("dados enviados a fila: ", sendWorkerWriting)

        res.send(sendWorkerWriting)
    } catch (error) {
        console.log("erro ao enviar dados para a fila: ", error)
    }
}