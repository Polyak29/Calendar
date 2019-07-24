import { createAction } from 'redux-actions';

const prefix = 'app/';

export const addTask = createAction(prefix + 'ADD_TASK');
export const selectDay = createAction(prefix + 'SELECTED_DAY');
export const openTextEdit = createAction(prefix + 'OPEN_TEXT_EDITOR');
export const onChangeText = createAction(prefix + 'ON_CHANGE_TEXT');
export const onChangeIsCompleted = createAction(prefix + 'ON_CHANGE_IS_COMPLETED');
export const removeTask = createAction(prefix + 'REMOVE_TASK');
export const updateEditorState = createAction(prefix + 'UPDATE_EDITOR_STATE');

export const fetchConfig = createAction(prefix + 'FETCH_CONFIG');
export const initLoad = createAction(prefix + 'INIT_LOAD');