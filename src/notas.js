const hash = require('object-hash');
const almacen = require('./almacen');
const fechas = require('./fechas');

function generarId(texto) {
    return hash(texto).slice(0, 8);
}

function agregar(texto, etiqueta = 'general') {
    if (!texto || texto.trim() === '') {
        return { ok: false, mensaje: 'Debes escribir el texto de la nota. Ejemplo: agregar "Mi nota" nodejs' };
    }

    const textoLimpio = texto.trim();
    const notas = almacen.leerNotas();
    const id = generarId(textoLimpio);

    const repetida = notas.find((nota) => nota.id === id);
    if (repetida) {
        return { ok: false, mensaje: `Ya existe una nota igual (id ${repetida.id}). No se guardó.` };
    }

    const nota = {
        id,
        texto: textoLimpio,
        etiqueta,
        fecha: fechas.getTimeStamp(),
    };

    notas.push(nota);
    almacen.guardarNotas(notas);

    const fechaLarga = fechas.getLongTime('es-ES', nota.fecha);
    return { ok: true, mensaje: `Nota guardada [${id}] (${etiqueta}) — ${fechaLarga}` };
}

function formatearNota(nota) {
    return `[${nota.id}] (${nota.etiqueta}) ${fechas.getShortDate('es-ES', nota.fecha)} — ${nota.texto}`;
}

function listar(cantidad) {
    let n = 5;
    let aviso = '';

    if (cantidad !== undefined) {
        const valor = parseInt(cantidad, 10);
        if (isNaN(valor) || valor <= 0) {
            aviso = `"${cantidad}" no es un número válido. Se usará el valor por defecto (5).\n`;
        } else {
            n = valor;
        }
    }

    const notas = almacen.leerNotas();
    if (notas.length === 0) {
        return { ok: true, mensaje: `${aviso}Todavía no hay notas guardadas.` };
    }

    const ultimas = notas.slice(-n);
    const lineas = ultimas.map(formatearNota).join('\n');
    return { ok: true, mensaje: `${aviso}${lineas}` };
}

function buscar(palabra) {
    if (!palabra || palabra.trim() === '') {
        return { ok: false, mensaje: 'Debes indicar una palabra a buscar. Ejemplo: buscar fs' };
    }

    const termino = palabra.toLowerCase();
    const notas = almacen.leerNotas();
    const encontradas = notas.filter((nota) => nota.texto.toLowerCase().includes(termino));

    if (encontradas.length === 0) {
        return { ok: true, mensaje: `No se encontraron notas con "${palabra}".` };
    }

    return { ok: true, mensaje: encontradas.map(formatearNota).join('\n') };
}

function borrar(id) {
    if (!id || id.trim() === '') {
        return { ok: false, mensaje: 'Debes indicar el id de la nota. Ejemplo: borrar 3f9a1c2e' };
    }

    const notas = almacen.leerNotas();
    const indice = notas.findIndex((nota) => nota.id === id);

    if (indice === -1) {
        return { ok: false, mensaje: `No existe ninguna nota con el id "${id}".` };
    }

    notas.splice(indice, 1);
    almacen.guardarNotas(notas);
    return { ok: true, mensaje: `Nota [${id}] eliminada.` };
}

module.exports = { agregar, listar, buscar, borrar };