import ITask, {ICalendarConfig} from "../../interfaces";

export default class CalendarConfigModel implements  ICalendarConfig{
  day: string = '';
  isCompleted: boolean;
  tasks: ITask[] ;
  constructor(day: string = new Date().toLocaleDateString(), isCompleted: boolean = false, tasks: ITask[] = []){
    this.day = day;
    this.isCompleted = isCompleted;
    this.tasks = tasks;
  }
}