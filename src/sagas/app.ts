import {takeLatest, put, delay} from "redux-saga/effects";
import {initLoad, fetchConfig, saveData} from "../actions/app";
import {dataTransfer} from "../helpers/util"


// @ts-ignore
function* fetchConfigApp(apiApp, action) {
  try {
    console.warn('[saga ===> FETCH CONFIG ===> ]');
    const config = yield apiApp.getConfig();
    const data = dataTransfer(config);
    yield put(fetchConfig(data));

  } catch (e) {
    console.error('[saga ===> FETCH CONFIG ===> error ]');
  }
}
//@ts-ignore
function* saveToServer(apiApp, action) {
  try {
    console.warn('[saga ===> SEND TO SERVER CONFIG ===> ]');
    const config = action.payload.listTasks;
    yield apiApp.save(config);
  } catch (e) {
    console.error('[saga ===> SEND TO SERVER CONFIG ===> error ]');
  }
}

//@ts-ignore
function* headerSaga(ea) {
  yield takeLatest(initLoad().type, fetchConfigApp, ea);
  yield takeLatest(saveData().type, saveToServer, ea)
}

export default headerSaga;
