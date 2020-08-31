const banco = require("./rutas/banco");
const recursos = require("c:/users/ing_j/downloads/veterinaria-fullstack/backend/recursos");

module.exports = {
    ruta: (data, callback) => {
        callback(200, {mensaje: "esta es /ruta"});
    },
    banco: banco(recursos.banco),
    noEncontrado: (data, callback) => {
        callback(404, {mensaje: "no encontrado"})
    }
}