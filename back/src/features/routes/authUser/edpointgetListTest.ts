import { getList } from "../../BDSystem/connect.js"

export default {
    method: "POST",
    url: "/getlistteste",
    handler: getList, //funcao para salvar lista
    schema: {
        response:{
            200: {
                type: "object",
                properties: {
                    userlist: {
                        type: "object",
                        properties: {
                            information: { type: "string" },
                            listTest: { 
                                type: "array", 
                                items: { type: "string" } 
                            },
                            status: { type: "string" }
                        }
                    }
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