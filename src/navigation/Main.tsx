import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home} from '../screens/Home';
import FavoritesScreen from '../screens/Favorites/FavoritesScreen';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faListAlt, faStar} from '@fortawesome/free-regular-svg-icons';

const Tab = createBottomTabNavigator();

export const MyTabs = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({color}) => (
              <FontAwesomeIcon icon={faListAlt} color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen 
          name="Favorites"
          component={FavoritesScreen}
          options={{
            tabBarIcon: ({color}) => (
              <FontAwesomeIcon icon={faStar} color={color} size={24} />
            ),
          }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
