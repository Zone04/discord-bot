module.exports = class RRIgnoreUserError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RRIgnoreUserError';
    }
}
