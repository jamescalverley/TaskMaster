import * as action from "../store/types";

export const addColumn = (payload) => {
  return {
    type: action.ADD_COLUMN,
    payload
  };
};

export const deleteColumn = (payload) => {
    return {
        type: action.DELETE_COLUMN,
        payload
    }
}

export const updateColTitle = (payload) => {
  return {
    type: action.UPDATE_COL_TITLE,
    payload
  }
}

export const setUser = (payload) => {
  return {
    type:action.SET_USER,
    payload
  }
}

export const updateUser = (payload) => {
  return {
    type: action.UPDATE_USER,
    payload
  }
}

export const getUser = (payload) => {
  return {
    type: action.GET_USER,
    payload
  }
}


export const updateUserProfile = (payload) => {
  return function (dispatch){
    setTimeout(()=>{
      dispatch(updateUser(payload))
    },2000)
  }
  
}

export const getUserProfile = (payload) => {
  return async function (dispatch){
    dispatch(getUser());
    const url = `/api/getUser/${payload}`;
    const result = await fetch(url).then((response) => response.json());
    dispatch(setUser(result));
  }
}
