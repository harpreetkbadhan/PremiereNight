import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View, StyleSheet} from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import {RootStackParams, TabParams} from './types';

const Stack = createNativeStackNavigator<RootStackParams>();
const Tab = createBottomTabNavigator<TabParams>();

// custom dark theme
const AppTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#eab308',
    background: '#000',
    card: '#111',
    text: '#fff',
    border: '#111',
    notification: '#eab308',
  },
};

// tab icon component - using unicode instead of icon lib
// keeps bundle smaller, might switch to vector-icons later
function TabIcon({label, icon, focused}: {label: string; icon: string; focused: boolean}) {
  const color = focused ? '#eab308' : '#555';
  return (
    <View style={tabStyles.iconContainer}>
      <Text style={[tabStyles.icon, {color}]}>{icon}</Text>
      <Text style={[tabStyles.label, {color}]}>{label}</Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: 9,
  },
});

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111',
          borderTopColor: '#222',
          height: 70,
          paddingTop: 6,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Spotlight"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon label="Spotlight" icon="★" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Watchlist"
        component={WatchlistScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon label="Watchlist" icon="♡" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer theme={AppTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {backgroundColor: '#000'},
          headerTintColor: '#fff',
          contentStyle: {backgroundColor: '#000'},
        }}
      >
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            headerTitle: '',
            headerTransparent: true,
            // animation: 'slide_from_right', // default is fine
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
