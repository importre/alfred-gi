const alfy = require('alfy');
const got = require('got');
const input = alfy.input.toLowerCase();
const fileUrl = 'https://github.com/github/gitignore/blob/master/';

function filter(tree) {
  return tree
    .filter(x => {
      filename = x.path.replace(/Global\//, '')
      return filename.endsWith('.gitignore') &&
        filename.toLowerCase().indexOf(input) >= 0
    })
    .map(x => {
      filename = x.path.replace(/Global\//, '')
      return {
        title: filename,
        arg: fileUrl + x.path
      }
    })
    .sort();
}

const url = 'https://alfred-workflows-62254.firebaseio.com/gi.json'
alfy.fetch(url)
  .then(items => {
    const output = filter(items);
    alfy.output(output);
  })
  .catch(error => {
    alfy.log(error);
  });

