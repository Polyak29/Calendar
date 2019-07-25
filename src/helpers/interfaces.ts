export interface listTasks {
  day: string,
  task: [{content:string, id: number, isCompleted:boolean}],
  isCompleted:boolean
};
