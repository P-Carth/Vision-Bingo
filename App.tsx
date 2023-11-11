import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import BingoScreen from './screens/BingoScreen';
import CameraAnalyzer from './screens/CameraAnalyzer';
// Import other screens here

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Bingo"
          component={BingoScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Camera"
          component={CameraAnalyzer}
          options={{headerShown: false}}
        />
        {/* Define other screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
