import { createSlice } from '@reduxjs/toolkit'

export interface Employee {
  id: string
  name: string
  email: string
  phone: string
}

const initialState: Employee[] = []

export const employee = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    addUpdateEmployee: (state, action: { type: string, payload: Employee }) => {
      const { payload } = action
      const employeeIndex = state.findIndex(e => e.id === payload.id)
      if (employeeIndex > -1) {
        state[employeeIndex] = payload
      }
      else {
        state.push(payload)
      }
    },
    deletemployee: (state, action) => {
      const employeeIndex = state.findIndex(e => e.id === action.payload)
      if (employeeIndex > -1) {
        state.splice(employeeIndex, 1)
      }
    }
  },
})

export const { addUpdateEmployee, deletemployee } = employee.actions

export default employee.reducer