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
  saveTask
} from '../actions/app'

const initialState = {
  listTasks: [],
  dayIsSelected: false,
  isAddingTask: false,
  daysWithDoneTask: [],
  daysWithTask: [],
  selectedDay: new Date(),
  content: '',
  day: new Date(),
  editorState: EditorState.createEmpty()
};

Object.freeze(initialState);
//@ts-ignore
export default handleActions(
  {
    //@ts-ignore
    [addTask]: (state, action) => {
      const {daysWithTask, dayIsSelected, isAddingTask, listTasks} = action.payload;

      return {
        ...state,
        daysWithTask: daysWithTask,
        dayIsSelected:  dayIsSelected,
        isAddingTask: isAddingTask,
        listTasks: listTasks,
        editorState: EditorState.createEmpty()
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
      const { listTasks, daysWithDoneTask, daysWithTask } = action.payload;

      return {
        ...state,
        listTasks: listTasks,
        daysWithDoneTask: daysWithDoneTask,
        daysWithTask: daysWithTask
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
    [saveTask]: (state, action) => {
      console.log(action.payload);
      return {
        ...state,
        listTask: action.payload
      }

    }
  },
  initialState
)