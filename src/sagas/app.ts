import {takeLatest, put, delay} from "redux-saga/effects";
import {initLoad, saveTask} from "../actions/app";

// @ts-ignore
function* fetchConfigApp(apiApp, action) {
  try {
    console.warn('[saga ===> FETCH CONFIG ===> ]');
    // yield put(showLoader());
    // yield delay(1000);

    const config = yield apiApp.getConfig();
    yield put(saveTask(config))
    // const selectedDays = getSelectedDays(config);
    // yield put(fetchSelectedDays(selectedDays));
    // yield put(fetchConfig(config));
    // yield put(hideLoader());
  } catch (e) {
    console.error('[saga ===> FETCH CONFIG ===> error ]');
  }
}
//@ts-ignore
function* headerSaga(ea) {
  yield takeLatest(initLoad().type, fetchConfigApp, ea);
}

export default headerSaga;
