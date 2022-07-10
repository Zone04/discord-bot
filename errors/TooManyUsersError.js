module.exports = class TooManyUsersError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TooManyUsersError';
    }
}
