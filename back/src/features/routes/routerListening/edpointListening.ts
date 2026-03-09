import { Listenig } from "./listeningProhibited.js"

export default {
    method: "POST",
    url: "/listeningteste",
    handler: Listenig, //funcao de comunicacao com aws
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