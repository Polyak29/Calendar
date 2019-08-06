export interface INavBar {
  onPreviousClick: () => void,
  onNextClick: () => void,
  className: string
}

export interface IStyleControls {
  editorState: any,
  onToggle: () => void
}

export interface IEditTask {
  daysWithTasks: Date[],
  daysWithDoneTask: Date[],
  listTasks: ICalendarConfig[],
}


export interface IDayClick {
  selectedDay: Date,
  dayIsSelected: boolean,
  isAddingTask: boolean
}

export interface IState {
  listTasks: ICalendarConfig[],
  isClickOnDay: boolean,
  contextMenuIsVisible: boolean,
  isViewText: boolean,
  dayIsSelected: boolean,
  isAddingTask: boolean,
  daysWithDoneTask: Date[],
  daysWithTasks: Date[],
  selectedDay: Date,
  editorState: any,
  axisX: number,
  axisY: number,
  idTask: number,
  isNewTask: boolean,
  time: string
}

export interface IAddTask {
  payload:{
    daysWithDoneTask: Date[],
    daysWithTasks: Date[],
    listTasks: ICalendarConfig[],
  }
}

export interface IMapState {
  app:{
    listTasks: ICalendarConfig[],
    isClickOnDay: boolean,
    contextMenuIsVisible: boolean,
    isViewText: boolean,
    dayIsSelected: boolean,
    isAddingTask: boolean,
    daysWithDoneTask: Date[],
    daysWithTasks: Date[],
    selectedDay: Date,
    editorState: any,
    axisX: number,
    axisY: number,
    idTask: number,
    isNewTask: boolean
    time: string
  }
}

export interface IReducer {
  type: string
}

export interface StyleBtn {
  onToggle: (arg:string) => void;
  style: string,
  active: boolean,
  label: string,
  icon: string
}

export interface ICalendarConfig {
  day: string,
  tasks: ITask[],
  isCompleted: boolean,
}

export default interface ITask {
  id: number,
  content: string,
  isCompleted: boolean,
  taskForEdit: any,
  time: string
}