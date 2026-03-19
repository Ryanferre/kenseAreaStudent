import { acessUser } from "./verifyAcess.js"

export default {
    method: "POST",
    url: "/verifyacess",
    handler: acessUser, //funcao de cerificação de dados
    schema: {
        response:{
            200: {
                type: "object",
                properties: {
                    success: {type: "boolean"},
                    data: {type: "string"}
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
                    information: {type: "string"}
                }
            }
        }
    }
}