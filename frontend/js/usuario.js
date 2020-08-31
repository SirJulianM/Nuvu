/*Variables*/

//Menú Principal

const ppal = document.getElementById('Ppal');
const usuario = document.getElementById('Usuario');
const preguntas = document.getElementById('Preguntas');
const iniciarSesion = document.getElementById('IniciarSesion');

//Menú Usuarios

const crud = document.getElementById('CRUD');
const contenido = document.getElementById('Contenido');

//Menu Iniciar Sesión

const inicioUsuario = document.getElementById('InicioUsuario');
const registro = document.getElementById('Registro');

//Formulario

const tipoDocumento = document.getElementById('TipoDocumento');
const documento = document.getElementById('Documento');
const nombre = document.getElementById('Nombre');
const apellido = document.getElementById('Apellido');
const direccion = document.getElementById('Direccion');
const telefono = document.getElementById('Telefono');
const btnCambios = document.getElementById('btnCambios');
const listaUsuarios = document.getElementById('lista-usuario');
const url = "https://veterinaria-backend.now.sh/veterinarias";
let registroUsuario = [];

/*Métodos*/

//Métodos del menú principal

function Ppal() {
    ppal.style.display = "block";
    usuario.style.display = "none";
    preguntas.style.display = "none";
    iniciarSesion.style.display = "none";
}

function Usuario() {
    ppal.style.display = "none";
    usuario.style.display = "block";
    preguntas.style.display = "none";
    iniciarSesion.style.display = "none";
}

function Preguntas() {
    ppal.style.display = "none";
    usuario.style.display = "none";
    preguntas.style.display = "block";
    iniciarSesion.style.display = "none";
}

function IniciarSesion() {
    ppal.style.display = "none";
    usuario.style.display = "none";
    preguntas.style.display = "none";
    iniciarSesion.style.display = "block";
}

//Métodos del menú Iniciar Sesion

function Registro() {
    inicioUsuario.style.display = "none";
    registro.style.display = "block";
}

function InicioUsuario() {
    inicioUsuario.style.display = "block";
    registro.style.display = "none";
}

//Metódos del menú Usuario

function CRUD() {
    crud.style.display = "block";
}

function Contenido() {
    crud.style.display = "none";
}

//Métodos del CRUD

async function listarUsuarios() {
    try {
        const respuesta = await fetch(url);
        const UsuarioServer = await respuesta.json();
        if (Array.isArray(UsuarioServer)) {
            registroUsuario = UsuarioServer;
        }
        if (usuario.length > 0) {
            const htmlUsuarios = registroUsuario
                .map((usuario, index) => `
                    <tr class="text-center">
                        <td>${usuario.tipoDocumento}</td>
                        <td>${usuario.documento}</td>
                        <td>${usuario.nombre}</td>
                        <td>${usuario.apellido}</td>
                        <td>
                            <div class="d-flex justify-content-center align-items-center">
                                <button type="button" class="btn btn-warning editar"><i class="fas fa-edit"></i></button>
                                <button type="button" class="btn btn-danger eliminar"><i class="fas fa-trash-alt"></i></button>
                            </div>
                        </td>
                    </tr>
                    `).join("");
            listaUsuarios.innerHTML = htmlUsuarios;
            Array.from(document.getElementsByClassName('editar').forEach(
                (botonEditar, index) => botonEditar.onclick = editar(index)
            ));
            Array.from(document.getElementsByClassName('eliminar').forEach(
                (botonEliminar, index) => botonEliminar.onclick = eliminar(index)
            ));
            return;
        }
        listarUsuarios.innerHTML =
            `<tr class="text-center">
                    <td colspan="5">No hay veterinarias</td>
                </tr>`;

    } catch (error) {
        console.log({ error });
        $(".alert").show();
    }
}

async function enviarDatos(evento) {
    evento.preventDefault();
    try {
        const datos = {
            tipoDocumento: tipoDocumento.value,
            documento: documento.value,
            nombre: nombre.value,
            apellido: apellido.value,
            direccion: direccion.value,
            telefono: telefono.value,
        };
        const accion = btnCambios.innerHTML;
        let urlEnvio = url;
        let method = "POST";
        if (accion === "Editar") {
            urlEnvio += `/${indice.value}`;
            method = "PUT";
        }
        const respuesta = await fetch(urlEnvio, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datos),
            mode: "cors",
        });
        if (respuesta.ok) {
            listarUsuarios();
            resetModal();
        }
    } catch (error) {
        console.log({ error });
        $(".alert").show();
    }
}

function editar(index) {
    try {
        return function cuandoCliqueo() {
            btnCambios.innerHTML = "Editar";
            $("#CRUD");
            const usuario = registroUsuario[index];
            indice = index.value;
            tipoDocumento = usuario.tipoDocumento;
            documento = usuario.documento;
            nombre = usuario.nombre;
            apellido = usuario.apellido;
            direccion = usuario.direccion;
            telefono = usuario.telefono;
        };
    } catch (error) {
        console.log({ error });
        $(".alert").show();
    }
}

function resetModal() {
    indice.value = "";
    tipoDocumento.value = "";
    documento.value = "";
    nombre.value = "";
    apellido.value = "";
    direccion.value = "";
    telefono.value = "";
    btnCambios.innerHTML = "Crear";
}

function eliminar(index) {
    const urlEnvio = `${url}/${index}`;
    return async function clickEnEliminar() {
        try {
            const respuesta = await fetch(urlEnvio, {
                method: "DELETE",
                mode: "cors",
            });
            if (respuesta.ok) {
                listarVeterinarias();
            }
        } catch (error) {
            console.log({ error });
            $(".alert").show();
        }
    };
}

form.onsubmit = enviarDatos;
btnCambios.onclick = enviarDatos;