import * as actionType from "./types"

const initialState = {
  user: {
    email: "",
    name: "",
    firstname: "",
    lastname: "",
    password: "",
    user_settings: {
      theme: "light",
      profilePicUrl: "url",
    },
    dashboards: [
      {
        name: "Dashboard 1",
        id: 0,
        owner: "",
        shared: [],
        columns: [],
        shared: [],
      },
    ],
    sharedToUser: [],
    sharedByUser: [],
  },
  currentDashboard: 0,
  currentUser:""
}

const user = (state = initialState, action) => {

  const newState = { ...state };
  const currentDashboard = state.currentDashboard;
  let dashboard;

  switch (action.type) {
    case actionType.ADD_COLUMN:
      dashboard = { ...state.user.dashboards[currentDashboard] };
      dashboard.columns.push(action.payload.column);
      newState.user.dashboards[currentDashboard] = dashboard;
      return newState;

    case actionType.DELETE_COLUMN:
      dashboard = { ...state.user.dashboards[currentDashboard] };
      dashboard.columns.splice(action.payload.colIndex, 1);
      newState.user.dashboards[currentDashboard] = dashboard;
      return newState;

    case actionType.SET_USER_PROFILE:
      newState.user = {...action.payload}
      return newState;

    case actionType.SET_CURRENT_USER:
      newState.currentUser = action.payload
      return newState

    case actionType.DELETE_CARD:
      return state;

    case actionType.SET_CURR_DASHBOARD:
      newState.currentDashboard = action.payload.dashboard;
      return newState;

    case actionType.UPDATE_COL_TITLE:
      newState.user.dashboards[currentDashboard].columns[
        action.payload.colIndex
      ].name = action.payload.colTitle;
      return newState;

    case actionType.UPDATE_USER:
      return state;

    default:
      return state;
  }
};

export default user;
