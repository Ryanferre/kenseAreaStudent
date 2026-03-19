import jwt from "jsonwebtoken";
import 'dotenv/config';
//chave de cryptografia
const secret = process.env.INVITE_SECRET!;

//chave de comunicação com o bd
const secretBd= process.env.INVITE_SECRET_BD!
//criação de tokens
//webtoken create user
function createTokenUser(data: any){
  const payload = {
    sub: data.id,              // sujeito do token (usuário)
    name: data.name, 
    idStudent: data.Studentid,                    // nome do usuário
    professorId: data.Teacherid,              // id do professor
    idClass: data.idClass,
    iss: "backend-1",         // quem emitiu
    aud: "backend-2",         // quem pode consumir
    scope: ["student:create"],          // papel/escopo
  };

  const token = jwt.sign(payload, secretBd, {
    algorithm: "HS256",
    expiresIn: "1h",
  });

  return token
}

//criar token de criação de lista
function createTokenList(data: any){
  const payload = {
    sub: data.id,              // sujeito do token (usuário) 
    studentIdreq: data.Studentid,                    // nome do usuário
    teacherId: data.Teacherid,              // id do professor
    mode: data.mode,
    status: data.status,
    listTest: data.listTest,
    iss: "backend-1",         // quem emitiu
    aud: "backend-2",         // quem pode consumir
    scope: ["createlist:create"],          // papel/escopo
  };

  const token = jwt.sign(payload, secretBd, {
    algorithm: "HS256",
    expiresIn: "1h",
  });

  return token
}


//criar token para pegar lista
function createTokenGetList(data: any){
  const payload = {
    sub: data.id,              // sujeito do token (usuário) 
    studentIdreq: data.Studentid,                    // nome do usuário
    iss: "backend-1",         // quem emitiu
    aud: "backend-2",         // quem pode consumir
    scope: ["getlist:post"],          // papel/escopo
  };

  const token = jwt.sign(payload, secretBd, {
    algorithm: "HS256",
    expiresIn: "1h",
  });

  return token
}

export async function createStudent(req: any, res: any){
    const { userID, nameUser, idTeacher, idClass} = req.body;

    console.log("dados chegando no back: ", userID, nameUser, idTeacher, idClass)

    //body da requisição
    const body: any= {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${createTokenUser({idStudent: userID, name: nameUser, professorId: idTeacher, idClass: idClass})}`,
      },
      body: JSON.stringify({
        name: nameUser,
        studentUserId: userID,
        professorId: idTeacher,
        idClass: Number(idClass)
      })}

    try {
      const connectBD= await fetch("https://backbdkense.onrender.com/createstudent", body)

      const data = await connectBD.json();
      console.log("dados de usuario: ", data)

      return res.status(200).send({ information: data.information });
    } catch (error: any) {
      console.log("erro de de conexão com o bd. Tipo de erro: ", error)

      return res.status(407).send({ information: "erro ao cadastrar usuario" });
    }
}


//guardar lista de teste
export async function saveList(req: any, res: any){
    const {teacherId, studentIdreq, mode, status, listTest}= req.body
    console.log("lista de teste, chagada de dados: ", teacherId, studentIdreq, mode, status, listTest)
    //body da requisição
    const body: any= {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${createTokenList({teacherId: teacherId, studentIdreq: studentIdreq, mode: mode, status: status, listTest: listTest.split('')})}`,
      },
      body: JSON.stringify({
        teacherId: teacherId,
        studentIdreq: studentIdreq,
        mode: mode,
        status: status,
        listTest: listTest.split(' ')
      })}
    try {
        const connectBD= await fetch("https://backbdkense.onrender.com/createlisttest", body)

        const data = await connectBD.json();
        console.log("resultado de criaçõ de lista: ", data)

        return res.status(200).send({ information: data });
    } catch (error) {
        console.log("erro ao guadar lista de teste: ", error)
    }
}

//pegar lista
export async function getList(req: any, res: any){
    const {studentIdreq}= req.body
    console.log("lista de teste, chagada de dados: ", studentIdreq)
    //body da requisição
    const body: any= {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${createTokenGetList({studentIdreq: studentIdreq})}`,
      },
      body: JSON.stringify({
        studentIdreq: studentIdreq
      })}
    try {
        const connectBD= await fetch("https://backbdkense.onrender.com/getlisttest", body)
        const responseConnect = await connectBD.json();

        console.log("resultado ao pegar lista: ", responseConnect)

        return res.status(200).send({userlist: responseConnect.data})
    } catch (error) {
        console.log("erro ao guadar lista de teste: ", error)
    }
}