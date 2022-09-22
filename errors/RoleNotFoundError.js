module.exports = class RoleNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RoleNotFoundError';
    }
}
