import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import LibraryScreen from './screens/LibraryScreen';
import PlayerScreen from './screens/PlayerScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMusic, faPlay } from '@fortawesome/free-solid-svg-icons'

const Tab = createBottomTabNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Library" component={LibraryScreen} options={{
          
          tabBarIcon: ({color}) => (
            <FontAwesomeIcon color={color} icon={ faMusic } size={24} />
          ),
        }}  />
        <Tab.Screen name="Maad Pod" component={PlayerScreen} options={{
          
          tabBarIcon: ({color}) => (
            <FontAwesomeIcon color={color} icon={ faPlay } size={24} />
          ),
        }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
