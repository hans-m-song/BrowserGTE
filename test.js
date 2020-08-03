const fs = require('fs');
const path = require('path');

const tsconfig = fs
  .readFileSync('./tsconfig.json')
  .toString()
  .replace(/(\s+\/\/.*\n)|(\/\*.*\*\/)/g, '');
const {baseUrl, paths} = JSON.parse(tsconfig).compilerOptions;

const newPaths = Object.keys(paths).map((alias) => {
  const newPath = path.join(baseUrl, paths[alias][0]);
  return {
    alias: alias.replace(/(\/\*)$/, ''),
    path: newPath.replace(/(\/\*)$/, ''),
  };
});

console.log(baseUrl, paths);
console.log(newPaths);
