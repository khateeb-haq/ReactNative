import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPhotos } from './middleware'
import { PhotoType } from './PhotoSlice'

export default function ({ }) {
    const photos = useSelector<{ photos: PhotoType[] }, PhotoType[]>(s => s.photos)
    const [pageNumber, setPageNumber] = useState(1)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => dispatch(fetchPhotos(pageNumber, setLoading, setPageNumber)), [])

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                onEndReachedThreshold={0.1}
                onEndReached={() => { setLoading(true); dispatch(fetchPhotos(pageNumber, setLoading, setPageNumber)) }}
                renderItem={({ item, index }) => {
                    const { url, title } = item
                    return (
                        <View style={{ marginVertical: 5, marginHorizontal: 15, flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ height: 80, aspectRatio: 1, marginRight: 15 }} source={{ uri: url }} />
                            <Text style={{ flex: 1 }}>
                                {title}
                            </Text>
                        </View>
                    )
                }}
                keyExtractor={(_, index) => index.toString()}
                data={photos} />
            {
                loading &&
                <ActivityIndicator size={'large'} style={{ height: 50 }} />
            }
        </View>
    )
}