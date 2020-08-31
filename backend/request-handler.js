const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const enrutador = require("./enrutador");

module.exports = (req, res) => {
  //Obtener url desde el objeto request // OK
  const urlActual = req.url;
  const urlParseada = url.parse(urlActual, true);

  //Obtener la ruta
  const ruta = urlParseada.pathname;

  // Limpiar Ruta
  const rutaLimpia = ruta.replace(/^\/+|\/+$/g, "");

  //Obtener el método http
  const metodo = req.method.toLowerCase();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, PUT, DELETE, POST"
  );

  //Dar respuesta inmediata cuando el método sea options
  if (metodo === "options") {
    res.writeHead(204);
    res.end();
    return;
  }

  //Obtener variables del query url
  const { query = {} } = urlParseada;

  //Obtener encabezados
  const { headers = {} } = req;

  //Obtener payload, en el caso de haber uno
  const decoder = new StringDecoder("utf-8");
  let buffer = "";

  //Ir acumulando la data cuando el request reciba un payload
  req.on("data", (data) => {
    buffer += decoder.write(data);
  });

  //Terminar de acumular datos y decirle al decoder que finalice
  req.on("end", () => {
    buffer += decoder.end();

    if (headers["content-type"] === "application/json") {
      buffer = JSON.parse(buffer);
    }

    //Revisar si tiene subrutas en este caso es el indice del array
    if (rutaLimpia.indexOf("/") > -1) {
      var [rutaPrincipal, indice] = rutaLimpia.split("/");
    }
    //Ordenar la data del request
    const data = {
      indice,
      ruta: rutaPrincipal || rutaLimpia,
      query,
      metodo,
      headers,
      payload: buffer,
    };

    console.log({ data });

    //Elegir el manejador dependiendo de la ruta y asignarle función que el enrutador tiene
    let handler;
    if (data.ruta && enrutador[data.ruta] && enrutador[data.ruta][metodo]) {
      handler = enrutador[data.ruta][metodo];
    } else {
      handler = enrutador.noEncontrado;
    }
    console.log("handler", handler);

    //Ejecutar handler para enviar la respuesta
    if (typeof handler === "function") {
      handler(data, (statusCode = 200, mensaje) => {
        const respuesta = JSON.stringify(mensaje);
        res.setHeader("Content-Type", "application/json");
        res.writeHead(statusCode);
        // linea donde realmente ya estamos respondiendo a la aplicación cliente
        res.end(respuesta);
      });
    }
  });
};
