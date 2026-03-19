import { createStudent } from "../../BDSystem/connect.js"

export default {
    method: "POST",
    url: "/savedatastudent",
    handler: createStudent, //funcao de cerificação de dados
    schema: {
        response:{
            200: {
                type: "object",
                properties: {
                    information: {type: "boolean"}
                }
            },
            400: {
                type: "object",
                properties: {
                     success: {type: "boolean"},
                    data: {type: "string"}
                }
            },
            401: {
                type: "object",
                properties: {
                    error: {type: "string"}
                }
            }
        }
    }
}