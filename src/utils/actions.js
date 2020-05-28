import * as action from "../store/types";

export const addColumn = (payload) => {
  return {
    type: action.ADD_COLUMN,
    payload,
  };
};

export const deleteColumn = (payload) => {
  return {
    type: action.DELETE_COLUMN,
    payload,
  };
};

export const updateColTitle = (payload) => {
  return {
    type: action.UPDATE_COL_TITLE,
    payload,
  };
};

export const setUserProfile = (payload) => {
  return {
    type: action.SET_USER_PROFILE,
    payload,
  };
};

export const setCurrentUser = (email) => {
  return {
    type: action.SET_CURRENT_USER,
    payload:email
  }
}

export const updateUser = (payload) => {
  return {
    type: action.UPDATE_USER,
    payload,
  };
};

export const getUserRequest = (payload) => {
  return {
    type: action.GET_USER_REQUEST,
    payload:payload
  };
};

export const getUserRequestSuccess = (res) => {
  return {
    type:action.GET_USER_REQUEST_SUCCESS,
    payload:res
  }
}

export const updateUserProfile = (payload) => {
  return function (dispatch) {
    setTimeout(() => {
      dispatch(updateUser(payload));
    }, 2000);
  };
};

export const getUserProfile = (payload) => {
  return async function (dispatch) {
    dispatch(getUserRequest(payload));
    const url = `/api/getUser/${payload}`;
    const result = await fetch(url)
      .then((response) => response.json())
      .catch((err) => {
        return {
          error:err
        }
      });
    console.log(result);  
    dispatch(getUserRequestSuccess(result));
    dispatch(setUserProfile(result[0][0]));
  };
};
