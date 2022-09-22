module.exports = class UnassignableRoleError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnassignableRoleError';
    }
}
