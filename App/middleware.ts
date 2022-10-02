import { AnyAction } from "@reduxjs/toolkit"
import { addPhotos, PhotoType } from "./PhotoSlice"

export function fetchPhotos(pageNumber: number, setLoading: Function): AnyAction {
    return (dispatch: any) => {
        fetch(`https://jsonplaceholder.typicode.com/photos?_limit=10&_page=${pageNumber}`, { method: 'GET' })
            .then(res => res.json())
            .then((response: PhotoType[]) => {
                dispatch(addPhotos(response))
                setLoading(false)
            }).catch(error => {
                console.log("api-error---", error.message);
            })
    }
}