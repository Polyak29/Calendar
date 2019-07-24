export interface listTask {
  day: Date,
  task: [{content:string, id: number, isCompleted:boolean}],
  isCompleted:boolean
};
