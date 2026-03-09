
export default {
    method: "GET",
    url: "/socket.io/?EIO=4&transport=websocket",
    handler: ()=>{console.log("passou para segunda barreira de altenticação")}, //funcao de comunicacao com aws
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