module.exports = {
    env: {
        node: true,
        es2021: true,
    },
    extends: [
        'airbnb-base',
        'plugin:import/typescript',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        'max-len': 0,
        indent: ['error', 4],
        'no-plusplus': 0,
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
            node: {
                extensions: ['.js', '.ts', '.jsx', '.tsx'],
            },
            typescript: {
                alwaysTryTypes: true,
            },
        },
    },
};
