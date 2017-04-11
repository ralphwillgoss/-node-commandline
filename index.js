"use strict"

const program = require('commander');
const csv = require('csv');
const fs = require('fs');
const inquirer = require('inquirer'); 
const async = require('async');
const chalk = require('chalk');
const fetch = require('node-fetch');

program
  .version('0.0.1')
  .option('-l, --list [list]', 'List of customers in CSV')
  .parse(process.argv)

let domains = [];
let parse = csv.parse;
let stream = fs.createReadStream(program.list)
               .pipe(parse({ delimiter : "," }));

stream
  .on("error", function (err) {
    return console.error(err.response);
  })
  .on("data", function (data) {
    let name = data[0];
    let url = data[1];
    domains.push({ name : name, url : url });
  })
  .on("end", function () {
    async.each(domains, function (domain, fn) {
        let o = fetch(domain.url)
                    .then(resp => console.log(domain.url+ ": " +chalk.green(resp.status)))
                    .catch(err => console.log(chalk.green(err.message)))
      }, function (err) {
        if (err) {
          return console.error(chalk.red(err.message));
        }
        console.log(chalk.green('Success'));
    });
});