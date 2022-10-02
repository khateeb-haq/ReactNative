import { createSlice } from '@reduxjs/toolkit'

export interface PhotoType {
    "albumId": number,
    "id": number,
    "title": string,
    "url": string,
    "thumbnailUrl": string
}

const initialState: PhotoType[] = []

export const photos = createSlice({
    name: 'photos',
    initialState,
    reducers: {
        addPhotos: (state, action: { type: string, payload: PhotoType[] }) => {
            state.push(...action.payload)
        },
    }
})

export const { addPhotos } = photos.actions

export default photos.reducer