/**
 * Created by baebae on 4/05/16.
 */

import {
  UPDATE_SIDEBAR_SHOW_STATUS,
  SHOW_MAP_PACKAGE_CONFIRM_DIALOG,
  UPDATE_API_WAITING_STATUS
} from '../actions/UIActions';

import {Actions} from 'react-native-router-flux';
import defaultState from './defaultState';
export default function uiReducer (state = defaultState.ui_status, action) {
  switch (action.type) {

    case UPDATE_SIDEBAR_SHOW_STATUS:
      return Object.assign({}, state, {
        sidebar: action.status,
      });

    case Actions.AFTER_ROUTE:
    case Actions.AFTER_POP:
      let pageIndex = action.route.props.pageIndex;
      if (action.route.name == "tab2") {
        pageIndex = 4;
      }
      console.info("action.route.name" , action.route.name);
      return Object.assign({}, state, {
        pageIndex: pageIndex
      });
    case SHOW_MAP_PACKAGE_CONFIRM_DIALOG:
      return Object.assign({}, state, {
        showPackageDialog: action.show,
      });
    case UPDATE_API_WAITING_STATUS:
      return Object.assign({}, state, {
        apiWaitingStatus: action.status,
      });
    default:
      return state;
  }
}