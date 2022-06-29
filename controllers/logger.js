/* eslint-disable no-console */
/* eslint-disable indent */
import chalk from 'chalk';

/**
 * Provides overrides for console output functions with a clean, standard format
 * @argument {function} consoleFunc: One of the console output functions (e.g. console.info)
 * @returns {function}: A replacement for the supplied console function is returned
 * @example: console.info = consoleOverride(console.info);
 */
const consoleOverride =
  (consoleFunc) =>
  (...args) => {
    const getTimeStampISO = () => {
      const pad = (count, value) => value.toString().padStart(count, '0');

      const now = new Date();
      const offset = -now.getTimezoneOffset();
      const offsetSign = offset >= 0 ? '+' : '-';
      const offsetHours = Math.floor(Math.abs(offset) / 60);
      const offsetMinutes = Math.floor(Math.abs(offset) % 60);

      const YYYY = pad(2, now.getFullYear());
      const MM = pad(2, now.getMonth() + 1);
      const DD = pad(2, now.getDate());
      const HH = pad(2, now.getHours());
      const mm = pad(2, now.getMinutes());
      const ss = pad(2, now.getSeconds());
      const sss = pad(3, now.getMilliseconds());
      const zS = offsetSign;
      const zH = pad(2, offsetHours);
      const zM = pad(2, offsetMinutes);

      return [
        YYYY,
        '-',
        MM,
        '-',
        DD,
        'T',
        HH,
        ':',
        mm,
        ':',
        ss,
        '.',
        sss,
        zS,
        zH,
        ':',
        zM,
      ].join('');
    };
    const { name } = consoleFunc;
    const colorMap = {
      log: chalk.magentaBright,
      info: chalk.greenBright,
      debug: chalk.magentaBright,
      warn: chalk.yellowBright,
      error: chalk.redBright,
    };
    consoleFunc.apply(console, colorMap[name]);
    if (colorMap[name] !== 'undefined') {
      const pad = ' '.repeat(5 - name.length);
      const label = `${colorMap[name](`|${name.toUpperCase()}|`)}${pad}`;
      const stamp = `[${chalk.cyanBright(getTimeStampISO())}] ${label}`;
      consoleFunc.apply(console, [stamp, ...args]);
    } else {
      consoleFunc.apply(console, args);
    }
  };

if (!console[Symbol.for('overriden')]) {
  console.info = consoleOverride(console.info);
  console.debug = consoleOverride(console.debug);
  console.warn = consoleOverride(console.warn);
  console.error = consoleOverride(console.error);
  console[Symbol.for('overriden')] = true;
}
