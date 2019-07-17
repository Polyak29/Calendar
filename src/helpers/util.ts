
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
