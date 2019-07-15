
const cloneDeep = require('lodash.clonedeep');
export function deepClone(data: any) {
  return (cloneDeep(data));
}

export function randomNumber () {
  return Math.floor(Math.random()*10000)
}