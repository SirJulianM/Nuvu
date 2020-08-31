module.export = function usuariosHandler(usuarios){
    return{
        get: (data, callback) => {
            if(typeof data.indice !== "undefined"){
                console.log("handler usuarios", {data});
                if(registroUsuario[data.indice]){
                    return callback(200, registroUsuario[data.indice]);
                }
                return callback(404, {
                    mensaje: `usuario con indice ${data.indice} no encontrado`
                });
            }
        },
        post: (data, callback) => {
            usuarios.push(data.payload);
            callback(201, data.payload);
        },
        put: (data, callback) => {
            if(typeof data.indice !== "undefined"){
                if(registroUsuario[data.indice]){
                    registroUsuario[data.indice] = data.payload;
                    return callback(200, registroUsuario[data.indice]);
                }
                return callback(404, {
                    mensaje: `usuario con indice ${data.indice} no encontrado`,
                })
            }
            callback(400, {mensaje: 'indice no enviado'})
        },
        delete: (data, callback) => {
            if(typeof data.indice !== "undefined"){
                if(registroUsuario[data.indice]){
                    registroUsuario = registroUsuario.filter(
                        (_registroUsuario, indice) => indice != data.indice
                    );
                    return callback(204, {
                        mensaje: `Usuario con ${data.indice} eliminado`,
                    });
                }
                return callback(404, {
                    mensaje: `Usuario con ${data.indice} no encontrado`,
                });
            }
            callback(400, {
                mensaje: `indice no enviado`,
            })
        }
    }
}