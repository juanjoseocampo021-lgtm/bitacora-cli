const notas = require('./notas');
const almacen = require('./almacen');

const AYUDA = `Bitácora de aprendizaje por consola

Uso: npm start -- <comando> [argumentos]

Comandos:
  agregar "<texto>" [etiqueta]   Guarda una nota (etiqueta por defecto: general)
  listar [N]                     Muestra las últimas N notas (por defecto 5)
  buscar <palabra>               Busca notas que contengan la palabra
  borrar <id>                    Elimina la nota con ese id
  ayuda                          Muestra este mensaje`;

function ejecutar(comando, argumentos) {
    switch (comando) {
        case 'agregar':
            return notas.agregar(argumentos[0], argumentos[1]);
        case 'listar':
            return notas.listar(argumentos[0]);
        case 'buscar':
            return notas.buscar(argumentos[0]);
        case 'borrar':
            return notas.borrar(argumentos[0]);
        case 'ayuda':
            return { ok: true, mensaje: AYUDA };
        default:
            return {
                ok: false,
                mensaje: `${comando ? `El comando "${comando}" no existe.` : 'No escribiste ningún comando.'}\n\n${AYUDA}`,
            };
    }
}

function main() {
    const [comando, ...argumentos] = process.argv.slice(2);

    let resultado;
    try {
        resultado = ejecutar(comando, argumentos);
    } catch (error) {
        resultado = { ok: false, mensaje: `Error: ${error.message}` };
    }

    console.log(resultado.mensaje);

    try {
        const textoComando = [comando || '(vacío)', ...argumentos].join(' ');
        const estado = resultado.ok ? 'OK' : 'ERROR';
        almacen.registrarLog(textoComando, `${estado}: ${resultado.mensaje.split('\n')[0]}`);
    } catch (error) {
        console.log(`No se pudo escribir en la bitácora: ${error.message}`);
    }
}

main();