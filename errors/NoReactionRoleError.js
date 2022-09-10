module.exports = class NoReactionRoleError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NoReactionRoleError';
    }
}
