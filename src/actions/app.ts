import { createAction } from 'redux-actions';
import {IReducer} from "../interfaces";

const prefix = 'app/';

export const addTask = createAction(prefix + 'ADD_TASK');
export const selectDay = createAction(prefix + 'SELECTED_DAY');
export const openTextEdit = createAction(prefix + 'OPEN_TEXT_EDITOR');
export const onChangeIsCompleted = createAction(prefix + 'ON_CHANGE_IS_COMPLETED');
export const removeTask = createAction(prefix + 'REMOVE_TASK');
export const updateEditorState = createAction(prefix + 'UPDATE_EDITOR_STATE');
export const activeContextMenu = createAction(prefix + 'ACTIVE_CONTEXT_MENU');
export const hideContextMenu = createAction(prefix + 'HIDE_CONTEXT_MENU');
export const activeContextMenuDate = createAction(prefix + 'ACTIVE_CONTEXT_MENU_DATE');

export const fetchConfig = createAction(prefix + 'FETCH_CONFIG');
export const initLoad = createAction(prefix + 'INIT_LOAD');
export const saveData = createAction(prefix + 'SAVE_DATA');
