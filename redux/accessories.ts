export const EMPLOYEES = 'EMPLOYEES'

export const saveEmployees = (payload: any[]) => ({
    type: EMPLOYEES,
    payload
})