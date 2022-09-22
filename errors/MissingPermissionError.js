module.exports = class MissingPermissionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'MissingPermissionError';
    }
}
