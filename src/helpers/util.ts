import CalendarConfigModel from "../models/calendarConfig/CalendarConfigModel";
import ICalendarConfig from "../models/calendarConfig/ICalendarConfig";

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

export function dataTransfer(config:ICalendarConfig[]) {
  const tempListTask: ICalendarConfig[] = deepClone(config);
  let data:{
    daysWithTasks: (Date)[],
    daysWithDoneTask: (Date)[],
    listTasks: ICalendarConfig[],
  } = {
    daysWithDoneTask: [],
    daysWithTasks: [],
    listTasks: []
  };

  const withTask: ICalendarConfig[] = tempListTask.filter((value: ICalendarConfig) => {
    if (value.tasks) {
      return value.tasks.length > 0;
    }
  });

  const daysWithTasks = withTask.map((value:any) => {
    return stringTransformDate(value.day);
  });

  const doneTask = tempListTask.filter((value:any) => value.isCompleted === true);

  const daysWithDoneTask: Date[] = doneTask.map((value:any) => {
       return stringTransformDate(value.day);
     });


    data.daysWithDoneTask = daysWithDoneTask;
    data.daysWithTasks = daysWithTasks;
    data.listTasks = withTask;

    return data;
}

 export const activeContext = {
    opacity: 0.5,
    cursor:"default",
};

export function configCurrentDay(array:ICalendarConfig[], currentDay: Date) {
  if (currentDay && array) {
    const config: ICalendarConfig = array.find( value => value.day === currentDay.toLocaleDateString()) || new CalendarConfigModel();
    return config;
  }
  return null;
}

export function getIndexDayWithTask(array: Date[], currentDay: Date) {
  if (!currentDay) {
    return 0;
  }
  const arrayString = array.map((value: Date) => {
    return value.toLocaleDateString();
  });
  const index = arrayString.indexOf(currentDay.toLocaleDateString());
  return index;
}