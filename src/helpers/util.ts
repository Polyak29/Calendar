import {string} from "prop-types";

const cloneDeep = require('lodash.clonedeep');
export function deepClone(data: any) {
  return (cloneDeep(data));
}

export function randomNumber() {
  return Math.floor(Math.random()*10000)
}

export function stylingCalendar() {
  return `
          .DayPicker-Day {
            background-color: inherit;
            color: white;
            font-size: 14px;
            padding: 16px;
          }
          .DayPicker {
            display:flex;
            }
        `
}

export function stringTransformDate(arg:string) {
  console.log(null);
  if (string === null) {
    return null;
  }
  const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
  const dt = new Date(arg.replace(pattern,'$3-$2-$1'));
  return dt

}