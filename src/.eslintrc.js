module.exports = {
    root: true,
    extends: ['scratch', 'scratch/node', 'scratch/es6', 'scratch/react'],
    env: {
        browser: true,
        worker: true
    },
    globals: {
        process: true,
        Scratch: true
    },
    rules: {
        'no-confusing-arrow': ['error', {
            allowParens: true
        }]
    },
    settings: {
        react: {
            version: '16.2' // Prevent 16.3 lifecycle method errors
        }
    }
};
