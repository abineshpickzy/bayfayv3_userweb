import {BANKLIST_FETCH_SUCCESSFUL, RAZOR_SETTINGS_FETCH_SUCCESSFUL} from "../actionTypes/razor-actions";

const initialState = {
    savedSettings: null,
    bankList: []
};

const razorReducer = (state = initialState, action) => {
    switch (action.type) {
        case RAZOR_SETTINGS_FETCH_SUCCESSFUL:
            return {
                ...state,
                savedSettings: action.payload.data
            };
        case BANKLIST_FETCH_SUCCESSFUL:
            return {
                ...state,
                bankList: action.payload.data.methods.netbanking
            };
        default:
            return state;
    }
};

export default razorReducer;
