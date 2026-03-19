import { saveList } from "../../BDSystem/connect.js"

export default {
    method: "POST",
    url: "/savelistteste",
    handler: saveList, //funcao para salvar lista
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
                    error: {type: "string"}
                }
            }
        }
    }
}