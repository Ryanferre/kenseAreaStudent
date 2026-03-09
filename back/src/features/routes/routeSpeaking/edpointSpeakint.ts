import { speackingProhibitend } from "./speakingProhibited.js"

export default {
    method: "POST",
    url: "/speakingteste",
    handler: speackingProhibitend, //funcao de comunicacao com aws
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