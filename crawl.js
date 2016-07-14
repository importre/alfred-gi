#!/usr/bin/env node

const fs = require('fs');
const got = require('got');
const execSync = require('child_process').execSync;

const treeUrl = 'https://api.github.com/repos/github/gitignore/git/trees/master?recursive=1';
const fileUrl = 'https://github.com/github/gitignore/blob/master/';

got(treeUrl)
  .then(response => {
    const items = JSON.parse(response.body).tree;
    const output = JSON.stringify(items, null, '  ');
    fs.writeFileSync('gi.json', output);
    console.log(execSync('firebase database:set -y /gi gi.json', {
      encoding: 'utf-8'
    }));
  })
  .catch(error => {
    console.log(error);
  });

