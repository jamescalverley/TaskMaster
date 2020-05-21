import * as actionType from './types';
const initialState = {
    
        user : {
        email: '',
        name: '',
        firstname: '',
        lastname: '',
        dashboards: [{ columns: [], shared: [] }],
        }
    
}

const user = (state=initialState,action) => {
    switch (action.type) {
        case actionType.ADD_COLUMN:
            console.log('add column redux action triggered')
            return state;
        default:
            return state;
    }
}


export default user;