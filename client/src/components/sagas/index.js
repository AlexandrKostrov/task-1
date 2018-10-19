import { takeLatest, takeEvery, put, call, all, select } from 'redux-saga/effects';
import { login } from '../../api/login';
import socketIOClient from 'socket.io-client';
const socket = socketIOClient(`http://localhost:3001?token=${localStorage.getItem('token')}`);

function makeSagaRequest(getData) {
  return function*(action) {
    try {
      const result = yield call(getData, action.data);
      console.log('IINER SAGA RESULT', result);
      const history = action.history;
      yield put({
        type: `ADD_${action.type}`,
        result,
        history,
      });
    } catch (error) {
      yield put({
        type: `${action.type}_ERROR`,
        error,
      });
    }
  };
}

function* enterUser() {
  yield takeLatest('USER', makeSagaRequest(login));
}

function* logger() {
  yield takeEvery('*', function*(action) {
    const store = yield select();
    console.log('action', action);
    console.log('store', store);
  });
}

export default function*() {
  yield all([enterUser(), logger()]);
}
