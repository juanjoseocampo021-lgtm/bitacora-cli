function getTimeStamp() {
    return Date.now();
}

function getLongTime(locale = 'es-ES', timestamp = Date.now()) {
    return new Date(timestamp).toLocaleString(locale, {
        dateStyle: 'full',
        timeStyle: 'long',
    });
}

function getShortDate(locale = 'es-ES', timestamp = Date.now()) {
    return new Date(timestamp).toLocaleDateString(locale);
}

module.exports = { getTimeStamp, getLongTime, getShortDate };