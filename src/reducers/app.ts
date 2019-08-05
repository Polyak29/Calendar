import { handleActions } from 'redux-actions';
import { EditorState } from "draft-js";
import {
  addTask,
  selectDay,
  openTextEdit,
  onChangeIsCompleted,
  removeTask,
  updateEditorState,
  fetchConfig,
  activeContextMenu,
  hideContextMenu,
  activeContextMenuDate
} from '../actions/app'

const initialState = {
  listTasks: [],
  isClickOnDay: false,
  contextMenuIsVisible: false,
  isViewText: false,
  dayIsSelected: true,
  isAddingTask: false,
  daysWithDoneTask: [],
  daysWithTasks: [],
  selectedDay: new Date(),
  editorState: EditorState.createEmpty(),
  axisX: 0,
  axisY: 0,
  idTask: 0,
  isNewTask: true
};

Object.freeze(initialState);
//@ts-ignore
export default handleActions(
  {
    //@ts-ignore
    [addTask]: (state, action) => {
      const {daysWithTasks, listTasks, daysWithDoneTask} = action.payload;

      return {
        ...state,
        daysWithDoneTask: daysWithDoneTask,
        daysWithTasks: daysWithTasks,
        dayIsSelected:  true,
        isAddingTask: false,
        listTasks: listTasks,
        editorState: EditorState.createEmpty(),
        isNewTask: true,
        isClickOnDay: false,
        idTask: 0
      }
    },

    //@ts-ignore
    [selectDay]: (state, action) => {
      const { selectedDay, dayIsSelected, isAddingTask } = action.payload;

      return {
        ...state,
        selectedDay: selectedDay,
        dayIsSelected: dayIsSelected,
        isAddingTask: isAddingTask
      }
    },

    //@ts-ignore
    [openTextEdit]: (state, action) => {
      return {
        ...state,
        contextMenuIsVisible: false,
        isAddingTask: true,
        editorState: action.payload
      }
    },

    //@ts-ignore
    [onChangeIsCompleted]: (state, action) => {
      const { listTasks, daysWithDoneTask } = action.payload;

      return {
        ...state,
        listTasks: listTasks,
        daysWithDoneTask: daysWithDoneTask,
        idTask:0
      }
    },

    //@ts-ignore
    [removeTask]: (state, action) => {
      const { listTasks, daysWithDoneTask, daysWithTasks } = action.payload;

      return {
        ...state,
        listTasks: listTasks,
        daysWithDoneTask: daysWithDoneTask,
        daysWithTasks: daysWithTasks
      }
    },
    //@ts-ignore
    [updateEditorState]: (state, action) => {
      return {
        ...state,
        editorState: action.payload
      }
    },
    //@ts-ignore
    [fetchConfig]: (state, action) => {
      const { daysWithTasks, listTasks, daysWithDoneTask }= action.payload;

      return {
        ...state,
        listTasks: listTasks,
        daysWithTasks: daysWithTasks,
        daysWithDoneTask: daysWithDoneTask
      };
    },
    //@ts-ignore
    [activeContextMenu] : (state, action) => {
      const { axisX, axisY, idTask } = action.payload;
      return {
        ...state,
        contextMenuIsVisible: true,
        axisX: axisX,
        axisY: axisY,
        idTask: idTask,
        isNewTask: false
      }
    },
    //@ts-ignore
    [activeContextMenuDate] : (state, action) => {
      const { axisX, axisY, selectedDay } = action.payload;

      return {
        ...state,
        contextMenuIsVisible: true,
        axisX: axisX,
        axisY: axisY,
        selectedDay: selectedDay,
        isClickOnDay: true
      }
    },
    //@ts-ignore
    [hideContextMenu]: (state, action) => {
      return {
        ...state,
        contextMenuIsVisible: false,
        isViewText: action.payload,
        isNewTask: true
      }
    },
  },
  initialState
)