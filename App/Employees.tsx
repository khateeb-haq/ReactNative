import React, { useState, useCallback } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, FlatList, Keyboard } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { addUpdateEmployee, deletemployee, Employee } from './EmployeeSlice'
// Employee ID, Name, Email, Contact No

export default function ({ }) {
    const employees = useSelector<{ employee: Employee[] }, Employee[]>(s => s.employee)
    const dispatch = useDispatch()
    const [employee, setemployee] = useState<Employee>({ name: '', id: '', email: '', phone: '' })
    const [isEditing, setEditing] = useState(false)
    const [searchKey, setSearchkey] = useState("")
    const [filteredList, setFilteredList] = useState<Employee[]>([])
    const save = useCallback(() => {
        const { id, email, name, phone } = employee
        if (id && email && name && phone) {
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(employee.email)) {
                Alert.alert('', 'Please enter a valid email id.')
                return
            }
            setemployee({ name: '', id: '', email: '', phone: '' })
            setEditing(false)
            Keyboard.dismiss()
            dispatch(addUpdateEmployee(employee))
        }
        else {
            Alert.alert("", "Please enter all the details.")
        }
    }, [employee])

    const _delete = useCallback((id: string) => {
        dispatch(deletemployee(id))
        if (employee.id === id) {
            setEditing(false)
            setemployee({ name: '', id: '', email: '', phone: '' })
        }
    }, [employee])

    const edit = useCallback((e: Employee) => {
        setemployee(e)
        setEditing(true)
    }, [])
    var timeout: string | number | NodeJS.Timeout | undefined
    const search = useCallback((s: string) => {
        setSearchkey(s)
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            setFilteredList(employees.filter(e => e.name.toLowerCase().includes(s.toLowerCase())).slice())
        }, 500)
    }, [employees])

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ marginHorizontal: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                    <TextInput
                        placeholder='Employee ID'
                        onChangeText={(t) => setemployee(e => { e.id = t; return { ...e } })}
                        value={employee.id}
                        editable={!isEditing}
                        keyboardType='decimal-pad'
                        style={[styles.forminput, isEditing && { backgroundColor: 'grey', color: 'white' }]} />
                    <TextInput
                        placeholder='Name'
                        onChangeText={(t) => setemployee(e => { e.name = t; return { ...e } })}
                        value={employee.name}
                        style={styles.forminput} />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TextInput
                        placeholder='Email'
                        onChangeText={(t) => setemployee(e => { e.email = t; return { ...e } })}
                        value={employee.email}
                        keyboardType='email-address'
                        style={styles.forminput} />
                    <TextInput
                        placeholder='Contact No'
                        onChangeText={(t) => setemployee(e => { e.phone = t; return { ...e } })}
                        keyboardType='decimal-pad'
                        maxLength={10}
                        value={employee.phone}
                        style={styles.forminput} />
                </View>
                <TouchableOpacity
                    onPress={save}
                    style={{
                        alignSelf: 'flex-end', marginRight: 3, borderWidth: 1,
                        paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5
                    }}>
                    <Text>
                        {'Save'}
                    </Text>
                </TouchableOpacity>
            </View>
            <TextInput
                onChangeText={search}
                placeholder='Search'
                value={searchKey}
                style={[styles.forminput, { marginHorizontal: 10, height: 40, flex: 0, marginTop: 10 }]} />
            <FlatList
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => {
                    const { email, name, id, phone } = item
                    return (
                        <View style={{
                            marginHorizontal: 10, flexDirection: 'row', borderWidth: 1,
                            justifyContent: 'space-between', alignItems: 'center',
                            marginTop: 10, paddingLeft: 5, paddingRight: 10
                        }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.listElement}>
                                    {`Employee ID : ${id}`}
                                </Text>
                                <Text style={styles.listElement}>
                                    {`Name: ${name}`}
                                </Text>
                                <Text style={styles.listElement}>
                                    {`Email: ${email}`}
                                </Text>
                                <Text style={styles.listElement}>
                                    {`Contact no: ${phone}`}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    onPress={() => edit(item)}
                                    style={{
                                        borderWidth: 1, marginRight: 10,
                                        paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5
                                    }}>
                                    <Text>
                                        {'Edit'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => _delete(id)}
                                    style={{
                                        borderWidth: 1,
                                        paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5
                                    }}>
                                    <Text>
                                        {'Delete'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }}
                data={(!searchKey ? [...employees] : filteredList).sort((a, b) => {
                    if (b.name > a.name) {
                        return -1
                    }
                    else {
                        return 1
                    }
                })} />
        </View>
    )
}

const styles = StyleSheet.create({
    forminput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 5,
        margin: 3,
        color: 'black'
    },
    listElement: {
        flex: 1,
        borderRadius: 5,
        margin: 3
    }
})