/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './AntlierTask';
import { name as appName } from './app.json';
import { reducer } from './redux';
import React from 'react'

const Root = () => {
    return (
        <Provider store={createStore(reducer)}>
            <App />
        </Provider>
    )
}

AppRegistry.registerComponent(appName, () => Root);
