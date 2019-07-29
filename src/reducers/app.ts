import { handleActions } from 'redux-actions';
import { EditorState } from "draft-js";
import {
  addTask,
  selectDay,
  openTextEdit,
  onChangeText,
  onChangeIsCompleted,
  removeTask,
  updateEditorState,
  fetchConfig,
  changeContextMenu
} from '../actions/app'

const initialState = {
  listTasks: [],
  contextMenuIsVisible: false,
  dayIsSelected: true,
  isAddingTask: false,
  daysWithDoneTask: [],
  daysWithTasks: [],
  selectedDay: new Date(),
  content: '',
  editorState: EditorState.createEmpty()
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
        content: ''
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
    [openTextEdit]: state => {
      return {
        ...state,
        isAddingTask:true
      }
    },

    //@ts-ignore
    [onChangeText]: (state, action) => {
      return {
        ...state,
        content: action.payload
      }
    },

    //@ts-ignore
    [onChangeIsCompleted]: (state, action) => {
      const { listTasks, daysWithDoneTask } = action.payload;

      return {
        ...state,
        listTasks: listTasks,
        daysWithDoneTask: daysWithDoneTask
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
    [changeContextMenu] : (state, action) => {
      return {
        ...state,
        contextMenuIsVisible: action.payload
      }
    }
  },
  initialState
)