import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMusic, faPlay, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faSoundcloud, faYoutube } from '@fortawesome/free-brands-svg-icons';

import LibraryScreen from './screens/LibraryScreen';
import SoundCloud from './screens/SoundCloud';
import SearchScreen from './screens/SearchScreen';
import PlayerScreen from './screens/PlayerScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AppNavigator() {
  const [libraryItems, setLibraryItems] = useState([]);

  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="MainTabs">
          {() => (
            <Tab.Navigator>
              <Tab.Screen
                name="Library"
                options={{
                  tabBarIcon: ({ color }) => (
                    <FontAwesomeIcon color={color} icon={faMusic} size={24} />
                  ),
                }}
              >
                {() => (
                  <LibraryScreen
                    libraryItems={libraryItems}
                    setLibraryItems={setLibraryItems}
                  />
                )}
              </Tab.Screen>
              <Tab.Screen
                name="Youtube"
                options={{
                  tabBarIcon: ({ color }) => (
                    <FontAwesomeIcon color={'red'} icon={faYoutube} size={24} />
                  ),
                }}
              >
                {() => (
                  <SearchScreen
                    libraryItems={libraryItems}
                    setLibraryItems={setLibraryItems}
                  />
                )}
              </Tab.Screen>
              <Tab.Screen
                name="SoundCloud"
                options={{
                  tabBarIcon: ({ color }) => (
                    <FontAwesomeIcon color={'orange'} icon={faSoundcloud} size={24} />
                  ),
                }}
              >
                {() => (
                  <SoundCloud
                    libraryItems={libraryItems}
                    setLibraryItems={setLibraryItems}
                  />
                )}
              </Tab.Screen>
            </Tab.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen name="Player" component={PlayerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
