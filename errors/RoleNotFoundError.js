module.exports = class RoleNotFoundError extends Error {
    constructor(message, roleId) {
        super(message);
        this.name = 'RoleNotFoundError';
        this.roleId = roleId;
    }
}
