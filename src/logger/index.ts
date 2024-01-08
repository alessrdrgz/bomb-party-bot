import { Logger } from 'tslog'

export const logger = new Logger({
  name: 'Bomb Party Bot',
  prettyLogTemplate:
    '[{{logLevelName}}] [{{name}}] [{{dd}}/{{mm}}/{{yyyy}} {{hh}}:{{MM}}:{{ss}}]: ',
  prettyErrorTemplate:
    '{{errorName}} {{errorMessage}}\nerror stack:\n{{errorStack}}',
  prettyErrorStackTemplate:
    '  • {{fileName}}\t{{method}}\n\t{{filePathWithLine}}',
  prettyLogStyles: {
    logLevelName: {
      '*': ['bold', 'black', 'bgWhiteBright', 'dim'],
      SILLY: ['bold', 'white'],
      TRACE: ['bold', 'whiteBright'],
      DEBUG: ['bold', 'green'],
      INFO: ['bold', 'blue'],
      WARN: ['bold', 'yellow'],
      ERROR: ['bold', 'red'],
      FATAL: ['bold', 'redBright'],
    },
    dd: 'yellow',
    mm: 'yellow',
    yyyy: 'yellow',
    hh: 'yellow',
    MM: 'yellow',
    ss: 'yellow',
    name: ['blueBright', 'bold'],
  },
})
