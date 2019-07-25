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
  fetchConfig
} from '../actions/app'

const initialState = {
  listTasks: [],
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
      console.log('addTask');
      const {daysWithTasks, listTasks} = action.payload;
      console.log(listTasks);
      return {
        ...state,
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
      console.log('selectDay');
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
      console.log('openTextEdit');
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
      console.log('onChangeIsCompleted');
      const { listTasks, daysWithDoneTask } = action.payload;

      return {
        ...state,
        listTasks: listTasks,
        daysWithDoneTask: daysWithDoneTask
      }
    },

    //@ts-ignore
    [removeTask]: (state, action) => {
      console.log('removeTask');
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

    }
  },
  initialState
)