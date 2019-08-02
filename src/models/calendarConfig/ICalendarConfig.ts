import ITask from "../task/ITask";

export default interface ICalendarConfig {
  day: string,
  tasks: ITask[],
  isCompleted: boolean,
}