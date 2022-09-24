module.exports = class UnassignableRoleError extends Error {
    constructor(message, role) {
        super(message);
        this.name = 'UnassignableRoleError';
        this.role = role;
    }
}
