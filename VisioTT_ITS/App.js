/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import Text from 'react-native';
import 'react-native-gesture-handler';

import Home from './views/Home.js'
import StakeholderView from './views/StakeholderView'
import Login from './views/Login'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
const horizontalAnimation = {
  gestureDirection: 'horizontal',
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};
const App = () => {  
  return (
    <NavigationContainer>
      <Stack.Navigator
      screenOptions={horizontalAnimation}>
        <Stack.Screen
          name="StakeholderView"
          component={StakeholderView}
          options={{
            screenOptions:{horizontalAnimation},
            title: 'VisioTT ITS',
            headerTitleAlign: "center",
            headerStyle: { borderBottomWidth: 1, borderBottomColor: "gray" },
            header
            /*headerStyle: { backgroundColor: "#364150"},
            headerTintColor: "white"*/
          }}          
        />
        <Stack.Screen
          name="Home"
          component={Home}
            options={{
            screenOptions:{horizontalAnimation},
            title: 'VisioTT ITS',
            headerTitleAlign: "center",
            headerStyle:{borderBottomWidth:1,borderBottomColor:"gray"}
            /*headerStyle: { backgroundColor: "#364150"},
            headerTintColor: "white"*/
          }}           />
        <Stack.Screen
          name="Login"
          component={Login}
            options={{
            screenOptions:{horizontalAnimation},
            title: 'VisioTT ITS',
            headerTitleAlign: "center",
            headerStyle:{borderBottomWidth:1,borderBottomColor:"gray"}
            /*headerStyle: { backgroundColor: "#364150"},
            headerTintColor: "white"*/
          }}          />
      </Stack.Navigator>
    </NavigationContainer>
  )
};


  
export default App;
