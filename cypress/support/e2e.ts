import './commands';

require('cypress-terminal-report/src/installLogsPrinter')({
    printLogsToConsole: 'always',
    outputRoot: './logs/',
    outputTarget: {
        'cypress.log': 'txt',
    },
});
