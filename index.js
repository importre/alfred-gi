const alfy = require('alfy');
const got = require('got');
const input = alfy.input.toLowerCase();
const fileUrl = 'https://github.com/github/gitignore/blob/master/';

function comp(a, b) {
  const i = a.indexOf(input);
  const j = b.indexOf(input);
  if (i >= 0 && j >= 0) {
    if (i - j === 0) {
      if (a.length === b.length) return a.localeCompare(b);
      return a.length - b.length;
    }
    return i - j;
  }
  if (i >= 0) return -1;
  if (j >= 0) return 1;
  return a.localeCompare(b);
}

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
    .sort((a, b) => comp(a.title.toLowerCase(), b.title.toLowerCase()));
}

const items = alfy.cache.get('items');
const now = alfy.config.get('now') || Date.now();
const gap = Date.now() - now;
const tolerance = 1000 * 60;

if (items && gap < tolerance) {
  const output = filter(items);
  alfy.output(output);
} else {
  const url = 'https://alfred-workflows-62254.firebaseio.com/gi.json'
  got(url)
    .then(response => {
      const items = JSON.parse(response.body);
      alfy.cache.set('items', items);
      const output = filter(items);
      alfy.output(output);
      alfy.config.set('now', Date.now());
    })
    .catch(error => {
      alfy.log(error);
    });
}

