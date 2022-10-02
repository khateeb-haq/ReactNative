import React, { Component } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { strings } from "./strings";
import Photos from "./Photos";
import Employees from "./Employees";
import { Image } from "react-native";
import { Provider } from "react-redux";
import { store } from "./store";

class App extends Component {
    BottomTab = createBottomTabNavigator()
    render() {
        return (
            <Provider store={store}>
                <NavigationContainer>
                    <this.BottomTab.Navigator screenOptions={{ tabBarIcon: () => null, tabBarHideOnKeyboard: true }}>
                        <this.BottomTab.Screen
                        name={strings.NavigationStrings.photos}
                        component={Photos} />
                        <this.BottomTab.Screen
                            name={strings.NavigationStrings.employees}
                            component={Employees} />
                    </this.BottomTab.Navigator>
                </NavigationContainer>
            </Provider>
        )
    }
}

export default App