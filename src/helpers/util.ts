import {string} from "prop-types";
import {listTasks} from "./interfaces";

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

  const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
  return new Date(arg.replace(pattern,'$3-$2-$1'));


}

export function dataTransfer(config:listTasks[]) {
  const tempListTask = deepClone(config);
  let data:{
    daysWithTasks: (Date)[],
    daysWithDoneTask: (Date)[],
    listTasks: listTasks[],
  } = {
    daysWithDoneTask: [],
    daysWithTasks: [],
    listTasks: []
  };
  const withTask = tempListTask.filter((value:any) => value.task.length > 0);

  const daysWithTasks = withTask.map((value:any) => {
    return  stringTransformDate(value.day);
  });

  const DoneTask = tempListTask.filter((value:any) => value.isCompleted === true);

  const daysWithDoneTask = DoneTask.map((value:any) => {
       return stringTransformDate(value.day);
     });


    data.daysWithDoneTask = daysWithDoneTask;
    data.daysWithTasks = daysWithTasks;
    data.listTasks = withTask;

    return data;
}

