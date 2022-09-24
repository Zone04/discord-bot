module.exports = class TooManyReactionsError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TooManyReactionsError';
    }
}
