import { EMPLOYEES } from "./accessories";

export const reducer = (state = { employees: [] }, { type, payload }) => {
    switch (type) {
        case EMPLOYEES:
            return { ...state, employees: payload }

        default:
            return state
    }
}