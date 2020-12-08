module.exports = {
    "extends": [
        "eslint:recommended"
    ],
    "env": {
        "es6": true,
        "node": true
    },
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 2017,
    },
    "globals":{
    },
    "rules":{
        'arrow-body-style': [2, 'as-needed'],
        'arrow-parens': [2, 'as-needed'],
        'arrow-spacing': [2, {
            before: true,
            after: true
        }],
        'indent': [2, 4, {"SwitchCase": 1}],
        'no-confusing-arrow': [2],
        'no-useless-computed-key': [2],
        'no-useless-constructor': [2],
        'no-var': [2],
        'prefer-arrow-callback': [2],
        'prefer-const': [2, {destructuring: 'all'}],
        'prefer-template': [2],
        'rest-spread-spacing': [2, 'never'],
        'template-curly-spacing': [2, 'never']
    }
};