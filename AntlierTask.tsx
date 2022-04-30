import React, { FunctionComponent, useEffect, useState } from "react";
import {
    Alert,
    Dimensions, FlatList, Modal, StatusBar, StyleSheet, Text, TextInput,
    TouchableOpacity, TouchableWithoutFeedback, View
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch, useSelector } from "react-redux";
import { saveEmployees } from "./redux/accessories";

const appColor = '#088F8F'
const employees_async_key = 'employees'

interface Type {
    employee: {
        name: string,
        department: string,
        email: string,
        number: string,
    }
}

function EmployeeRecord(): React.ReactNode {
    const dh = Dimensions.get('window').height
    const [isFormVisible, setFormVisibility] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [department, setDepartment] = useState('')
    const [number, setNumber] = useState('')
    const [filteredEmloyees, setfilteredEmloyees] = useState([])
    const [searchText, setSearchText] = useState('')
    const [editingIndex, setEditingIndex] = useState(-1)

    const { employees } = useSelector((store: any) => store)
    const dispatch = useDispatch()

    useEffect(() => {
        const async_call = async () => {
            const async_val = await AsyncStorage.getItem(employees_async_key)
            dispatch(saveEmployees(JSON.parse(async_val ? async_val : '[]')))
        }
        async_call()
    }, [])

    const closeForm = () => {
        setFormVisibility(false)
        setName('')
        setEmail('')
        setDepartment('')
        setNumber('')
        setEditingIndex(-1)
    }

    const onEdit = (item: Type['employee'], index: number) => {
        const { name, department, email, number } = item
        setName(name)
        setEmail(email)
        setDepartment(department)
        setNumber(number)
        setEditingIndex(index)
        setFormVisibility(true)
    }

    const onSubmit = () => {
        if (name && email && department && number) {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                if (editingIndex !== -1) {
                    employees.splice(editingIndex, 1, { name, email, department, number })
                    dispatch(saveEmployees([...employees]))
                    setEditingIndex(-1)
                }
                else {
                    dispatch(saveEmployees([{ email, name, department, number }, ...employees]))
                }
                closeForm()
            }
            else {
                Alert.alert('', 'Email format is incorrect.')
            }
        }
        else {
            Alert.alert('', 'All fields are mandatory.')
        }
    }

    const HeaderComp = () => (
        <View style={{
            backgroundColor: appColor, height: dh / 10,
            borderBottomEndRadius: 30, borderBottomStartRadius: 30,
            alignItems: 'flex-end', paddingHorizontal: 10, justifyContent: 'center'
        }}>
            <TouchableOpacity
                onPress={() => setFormVisibility(true)}
                style={{
                    borderWidth: .5, borderColor: 'white',
                    aspectRatio: 1, alignItems: 'center',
                    borderRadius: 30, overflow: 'hidden'
                }}>
                <Text style={{ color: 'white', fontSize: 25 }}>
                    +
                </Text>
            </TouchableOpacity>
        </View>
    )

    return (
        <>
            <View style={{ flex: 1, }}>
                <StatusBar backgroundColor={appColor} />
                <HeaderComp />
                <TextInput
                    value={searchText}
                    onChangeText={(text) => {
                        setSearchText(text);
                        setfilteredEmloyees(employees.filter((item: any) => (item.name.includes(text) || item.email.includes(text))))
                    }}
                    placeholder="Search"
                    style={[styles.input, { marginHorizontal: 20 }]} />
                <FlatList
                    style={{ paddingHorizontal: 20 }}
                    renderItem={({ item, index }) => {
                        const { email, name, department, number } = item
                        return (
                            <View style={{ backgroundColor: '#ADD8E680', marginVertical: 10, padding: 10, borderRadius: 10 }}>
                                <View style={[styles.employee_fields_view, { marginTop: 0 }]}>
                                    <Text style={styles.employee_fields_key}>
                                        {`Name`}
                                    </Text>
                                    <Text style={styles.employee_fields_value}>
                                        {name}
                                    </Text>
                                </View>
                                <View style={styles.employee_fields_view}>
                                    <Text style={styles.employee_fields_key}>
                                        {`Email`}
                                    </Text>
                                    <Text style={styles.employee_fields_value}>
                                        {email}
                                    </Text>
                                </View>
                                <View style={styles.employee_fields_view}>
                                    <Text style={styles.employee_fields_key}>
                                        {`Mobile Number`}
                                    </Text>
                                    <Text style={styles.employee_fields_value}>
                                        {number}
                                    </Text>
                                </View>
                                <View style={styles.employee_fields_view}>
                                    <Text style={styles.employee_fields_key}>
                                        {`Department`}
                                    </Text>
                                    <Text style={styles.employee_fields_value}>
                                        {department}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', marginTop: 10, alignSelf: 'flex-end' }}>
                                    <TouchableOpacity
                                        onPress={() => onEdit(item, index)}
                                        style={styles.edit_delete}>
                                        <Text style={styles.edit_delete_text}>
                                            Edit
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            employees.splice(index, 1);
                                            dispatch(saveEmployees([...employees]))
                                        }}
                                        style={[styles.edit_delete, { marginLeft: 7, backgroundColor: 'red' }]}>
                                        <Text style={styles.edit_delete_text}>
                                            Delete
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }}
                    keyExtractor={(_, index) => index.toString()}
                    data={searchText ? filteredEmloyees : employees} />

                <View style={{ flexDirection: 'row', marginVertical: 15, justifyContent: 'center' }}>

                    <TouchableOpacity
                        onPress={() => {
                            dispatch(saveEmployees([]))
                            AsyncStorage.setItem(employees_async_key, JSON.stringify([]))
                        }}
                        style={[styles.edit_delete, { marginRight: 7, backgroundColor: 'red' }]}>
                        <Text style={styles.edit_delete_text}>
                            Clear Record
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            AsyncStorage.setItem(employees_async_key, JSON.stringify(employees))
                            Alert.alert('', 'Your recors have been saved.')
                        }}
                        style={styles.edit_delete}>
                        <Text style={styles.edit_delete_text}>
                            Save Record
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
            <Modal
                onRequestClose={closeForm}
                transparent
                animationType='slide'
                visible={isFormVisible}>
                <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', flex: 1, justifyContent: 'center' }}>
                    <View
                        style={{
                            backgroundColor: 'white',
                            marginHorizontal: 20, borderRadius: 25,
                            overflow: 'hidden',
                        }}>
                        <KeyboardAwareScrollView
                            keyboardShouldPersistTaps='always'
                            style={{ paddingHorizontal: 15 }}>
                            <Text style={styles.inputHeader}>
                                {'Name'}
                            </Text>
                            <TextInput
                                value={name}
                                placeholder='Please Enter Name'
                                onChangeText={setName}
                                style={styles.input}
                            />
                            <Text style={styles.inputHeader}>
                                {'Email'}
                            </Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder='Please Enter Email'
                                keyboardType='email-address'
                                style={styles.input}
                            />
                            <Text style={styles.inputHeader}>
                                {'Department'}
                            </Text>
                            <TextInput
                                value={department}
                                onChangeText={setDepartment}
                                placeholder='Please Enter Department'
                                style={styles.input}
                            />
                            <Text style={styles.inputHeader}>
                                {'Mobile Number'}
                            </Text>
                            <TextInput
                                value={number}
                                onChangeText={setNumber}
                                keyboardType='numeric'
                                placeholder='Please Enter Number'
                                style={[styles.input, { marginBottom: 40 }]}
                            />
                            <TouchableOpacity
                                onPress={onSubmit}
                                style={[
                                    styles.input,
                                    {
                                        justifyContent: 'center', alignItems: 'center',
                                        marginBottom: 30, backgroundColor: appColor
                                    }
                                ]}>
                                <Text style={{ color: 'white', fontSize: 16 }}>
                                    Submit
                                </Text>
                            </TouchableOpacity>
                        </KeyboardAwareScrollView>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    inputHeader: {
        color: 'darkgrey',
        fontSize: 16,
        marginTop: 10
    },
    input: {
        borderWidth: 1,
        padding: 0,
        marginTop: 5,
        borderRadius: 15,
        color: 'darkgrey',
        borderColor: 'darkgrey',
        paddingHorizontal: 5,
        height: 40,
        fontSize: 16
    },
    employee_fields_view: {
        flexDirection: 'row',
        marginTop: 3
    },
    employee_fields_key: {
        fontSize: 14,
        flex: 1
    },
    employee_fields_value: {
        fontSize: 15,
        fontWeight: 'bold',
        flex: 1
    },
    edit_delete: {
        backgroundColor: appColor,
        paddingHorizontal: 25,
        paddingVertical: 7,
        borderRadius: 20
    },
    edit_delete_text: {
        fontSize: 15,
        color: 'white'
    }
})

export default EmployeeRecord;