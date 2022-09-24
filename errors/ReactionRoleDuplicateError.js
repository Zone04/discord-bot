module.exports = class ReactionRoleDuplicateError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ReactionRoleDuplicateError';
    }
}
