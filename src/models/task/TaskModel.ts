import ITask from "./ITask";

export default class TaskModel implements  ITask{
  id: number;
  content: string;
  isCompleted: boolean;
  taskForEdit: any;
  constructor(id: number = 0, content: string = '', isCompleted: boolean = false, taskForEdit: any = null){
    this.id = id;
    this.content = content;
    this.isCompleted = isCompleted;
    this.taskForEdit = taskForEdit;
  }
}