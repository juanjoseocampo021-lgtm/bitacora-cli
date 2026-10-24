# bitacora-cli

Aplicación de consola hecha con Node.js para llevar una bitácora de aprendizaje. Guarda notas en un archivo, rechaza las notas repetidas, registra cada acción en un log, genera respaldos y exporta las notas a un archivo de texto.

## Instalación

```bash
git clone https://github.com/juanjoseocampo021-lgtm/bitacora-cli.git
cd bitacora-cli
npm install
```

Requiere Node.js 20.12 o superior.

**Paquete de fechas:** el proyecto usa el paquete propio `fechas-bitacora-juanjoseocampo`, que no está publicado en npm y se conecta con `npm link`. Para usarlo en otro equipo, primero hay que enlazarlo:

```bash
cd ../fechas-bitacora-juanjoseocampo
npm link
cd ../bitacora-cli
npm link fechas-bitacora-juanjoseocampo
```

## Comandos

| Comando | Qué hace | Ejemplo |
|---|---|---|
| `agregar "<texto>" [etiqueta]` | Guarda una nota (etiqueta por defecto: `general`) y rechaza las repetidas | `npm start -- agregar "Hoy aprendí a usar fs" nodejs` |
| `listar [N]` | Muestra las últimas N notas (por defecto 5) | `npm start -- listar 3` |
| `buscar <palabra>` | Busca notas que contengan la palabra, sin distinguir mayúsculas | `npm start -- buscar fs` |
| `borrar <id>` | Elimina la nota con ese id | `npm start -- borrar 3d79f3e7` |
| `respaldar` | Copia las notas a `respaldos/notas_<marca-de-tiempo>.json` | `npm start -- respaldar` |
| `exportar [carpeta-absoluta]` | Mueve un archivo `exportacion.txt` con todas las notas a la carpeta indicada (por defecto, la carpeta personal) | `npm start -- exportar "C:/Users/tu-usuario/Desktop"` |
| `ayuda` | Muestra cómo se usa cada comando | `npm start -- ayuda` |

## Estructura

| Archivo | Responsabilidad |
|---|---|
| `src/index.js` | Lee los argumentos y decide qué comando ejecutar |
| `src/notas.js` | Lógica de agregar, listar, buscar, borrar, respaldar y exportar |
| `src/almacen.js` | Lee y escribe archivos con `fs` |

Los datos se guardan en `data/notas.json` y las acciones en `data/bitacora.log`.

## Reflexión

### 1. ¿Por qué elegiste CommonJS o ES Modules? ¿Qué cambió en tu package.json y en la forma de importar?

Elegí CommonJS porque mi paquete de fechas también lo es y así uso un solo sistema en todo el proyecto. En `package.json` dejé `"type": "commonjs"` y en el código uso `require` y `module.exports` en lugar de `import` y `export`.

### 2. fs, object-hash y fechas (mi paquete) se importan distinto del módulo local notas.js. ¿Cuál es la diferencia y cómo decide Node dónde buscar cada uno?

`fs` es nativo de Node y se importa solo por nombre. `object-hash` y mi paquete de fechas son externos, y Node los busca en `node_modules/`. `notas.js` es local: el `./` le indica a Node que lo busque relativo al archivo actual.

### 3. ¿Por qué data/notas.json se resuelve distinto si ejecutas el programa desde otra carpeta?

Una ruta relativa se calcula desde la carpeta donde ejecuto el comando, no desde donde está el código. Desde `src/` buscaría `src/data/notas.json`, que no existe. Con `path.join(__dirname, '..', 'data')` la ruta siempre apunta al `data/` del proyecto.

### 4. ¿Por qué node_modules/ no se sube a Git y cómo recupera otra persona las dependencias?

`node_modules/` pesa mucho y se puede regenerar, por eso está en el `.gitignore`. El `package.json` y el `package-lock.json` sí se suben porque registran las dependencias. Otra persona clona el repositorio y ejecuta `npm install`.

### 5. ¿Qué diferencia viste al importar tu paquete CommonJS desde tu proyecto?

Lo importé con `require('fechas-bitacora-juanjoseocampo')`, igual que `object-hash`; la diferencia con un módulo local es que no lleva `./` y Node lo busca en `node_modules/`. Si la bitácora fuera ES Modules, usaría `import fechas from 'fechas-bitacora-juanjoseocampo'`, porque Node permite importar paquetes CommonJS desde ES Modules.