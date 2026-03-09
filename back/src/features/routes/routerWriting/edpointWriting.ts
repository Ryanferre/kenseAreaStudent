import { Writing } from "./writingProhibited.js"

export default {
    method: "POST",
    url: "/writingteste",
    handler: Writing, //função para processar resposta do teste de escrita(writing)
    schema: {
        response:{
            200: {
                type: "object",
                properties: {
                    information: {type: "string"}
                }
            },
            400: {
                type: "object",
                properties: {
                    information: {type: "string"}
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