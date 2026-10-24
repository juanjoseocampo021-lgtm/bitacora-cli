const fs = require('fs');
const path = require('path');

const CARPETA_DATA = path.join(__dirname, '..', 'data');
const ARCHIVO_NOTAS = path.join(CARPETA_DATA, 'notas.json');
const ARCHIVO_LOG = path.join(CARPETA_DATA, 'bitacora.log');

function asegurarArchivo() {
    if (!fs.existsSync(CARPETA_DATA)) {
        fs.mkdirSync(CARPETA_DATA, { recursive: true });
    }
    if (!fs.existsSync(ARCHIVO_NOTAS)) {
        fs.writeFileSync(ARCHIVO_NOTAS, '[]');
    }
}

function leerNotas() {
    asegurarArchivo();
    const contenido = fs.readFileSync(ARCHIVO_NOTAS, 'utf8');
    try {
        const notas = JSON.parse(contenido);
        if (!Array.isArray(notas)) {
            throw new Error('El contenido no es un arreglo');
        }
        return notas;
    } catch (error) {
        throw new Error(
            `El archivo de notas está dañado (${ARCHIVO_NOTAS}). Corrígelo o bórralo para empezar de nuevo.`
        );
    }
}

function guardarNotas(notas) {
    asegurarArchivo();
    fs.writeFileSync(ARCHIVO_NOTAS, JSON.stringify(notas, null, 2));
}

function registrarLog(comando, resultado) {
    asegurarArchivo();
    const linea = `${new Date().toISOString()} | ${comando} | ${resultado}\n`;
    fs.appendFileSync(ARCHIVO_LOG, linea);
}

module.exports = { leerNotas, guardarNotas, registrarLog, ARCHIVO_NOTAS };