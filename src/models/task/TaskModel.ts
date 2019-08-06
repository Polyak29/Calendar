import ITask from "../../interfaces";

export default class TaskModel implements  ITask{
  id: number;
  content: string;
  isCompleted: boolean;
  taskForEdit: any;
  time: string;
  constructor(id: number = 0, content: string = '', isCompleted: boolean = false, taskForEdit: any = null, time: string = ''){
    this.id = id;
    this.content = content;
    this.isCompleted = isCompleted;
    this.taskForEdit = taskForEdit;
    this.time = time;
  }
}