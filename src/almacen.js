const fs = require('fs');
const path = require('path');

const CARPETA_DATA = path.join(__dirname, '..', 'data');
const ARCHIVO_NOTAS = path.join(CARPETA_DATA, 'notas.json');
const ARCHIVO_LOG = path.join(CARPETA_DATA, 'bitacora.log');
const CARPETA_RESPALDOS = path.join(__dirname, '..', 'respaldos');
const CARPETA_SALIDA = path.join(__dirname, '..', 'salida');

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

function respaldarNotas(marcaDeTiempo) {
    asegurarArchivo();
    if (!fs.existsSync(CARPETA_RESPALDOS)) {
        fs.mkdirSync(CARPETA_RESPALDOS, { recursive: true });
    }
    const destino = path.join(CARPETA_RESPALDOS, `notas_${marcaDeTiempo}.json`);
    fs.copyFileSync(ARCHIVO_NOTAS, destino);
    return destino;
}

function escribirExportacion(texto) {
    if (!fs.existsSync(CARPETA_SALIDA)) {
        fs.mkdirSync(CARPETA_SALIDA, { recursive: true });
    }
    const archivo = path.join(CARPETA_SALIDA, 'exportacion.txt');
    fs.writeFileSync(archivo, texto);
    return archivo;
}

function moverArchivo(origen, destino) {
    try {
        fs.renameSync(origen, destino);
    } catch (error) {
        if (error.code === 'EXDEV') {
            fs.copyFileSync(origen, destino);
            fs.unlinkSync(origen);
        } else {
            throw error;
        }
    }
    return destino;
}

function carpetaExiste(ruta) {
    return fs.existsSync(ruta) && fs.statSync(ruta).isDirectory();
}

module.exports = { leerNotas, guardarNotas, registrarLog, respaldarNotas, escribirExportacion, moverArchivo, carpetaExiste, ARCHIVO_NOTAS };