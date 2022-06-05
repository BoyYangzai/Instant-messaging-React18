import { createSlice, configureStore } from '@reduxjs/toolkit'

export const usernameSlice = createSlice({
    name: 'username',
    initialState: {
        value: ''
    },
    reducers: {
        changeName(state, username: { payload: string }) {
            state.value = username.payload
        }
    }
})

export const { changeName } = usernameSlice.actions
export default usernameSlice.reducer



