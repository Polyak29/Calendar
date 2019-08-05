import {EditorState} from "draft-js";
import ICalendarConfig from "../models/calendarConfig/ICalendarConfig";


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
  isClickOnDay: false,
  contextMenuIsVisible: false,
  isViewText: false,
  dayIsSelected: true,
  isAddingTask: false,
  daysWithDoneTask: Date[],
  daysWithTasks: Date[],
  selectedDay: Date,
  editorState: any,
  axisX: 0,
  axisY: 0,
  idTask: 0,
  isNewTask: true
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
    isClickOnDay: false,
    contextMenuIsVisible: false,
    isViewText: false,
    dayIsSelected: true,
    isAddingTask: false,
    daysWithDoneTask: Date[],
    daysWithTasks: Date[],
    selectedDay: Date,
    editorState: any,
    axisX: 0,
    axisY: 0,
    idTask: 0,
    isNewTask: true
  }
}

export interface IReducer {
  type: string
}