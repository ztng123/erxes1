#!/usr/bin/env node
'use strict';

const _ = require('lodash');

const program = require('commander');
const packageJSON = require('../package.json');
const startCmd = require('../commands/start');
const updateCmd = require('../commands/update');
const { up, update, restart, deployDbs } = require('../commands/docker/utils');

/**
 * Normalize version argument
 *
 * `$ erxes -v`
 * `$ erxes -V`
 * `$ erxes --version`
 * `$ erxes version`
 */

program.allowUnknownOption(true);

// Expose version.
program.version(packageJSON.version, '-v, --version');

// Make `-v` option case-insensitive.
process.argv = _.map(process.argv, arg => {
  return arg === '-V' ? '-v' : arg;
});

// `$ erxes version` (--version synonym)
program
  .command('version')
  .description('output your version of Erxes')
  .action(() => {
    console.log(packageJSON.version);
  });

// `$ start erxes`
program
  .command('start')
  .option('--ignoreDownload', 'Ingore latest updates download')
  .description('Run erxes')
  .action(startCmd);

program
  .command('deploy-dbs')
  .description('Delpoy dbs using docker')
  .action(deployDbs);

program
  .command('up')
  .description('Run erxes using docker')
  .option('--uis', 'Download uis')
  .action(up);

program
  .command('update')
  .option('--uis', 'Update uis')
  .action(update);

program
  .command('restart')
  .action(restart);

// `$ update erxes`
program
  .command('upgrade')
  .description('Download the latest changes of erxes')
  .action(updateCmd);

program.parse(process.argv);