import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { DashboardScreen } from '../screens/DashboardScreen';
import { BarcodeScreen } from '../screens/BarcodeScreen';
import { NearbyStoresScreen } from '../screens/NearbyStoresScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { ShoppingListScreen } from '../screens/ShoppingListScreen';
import { HousemateScreen } from '../screens/HousemateScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DashboardHome" component={DashboardScreen} />
    </Stack.Navigator>
  );
};

const BarcodeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="BarcodeHome" component={BarcodeScreen} />
    </Stack.Navigator>
  );
};

const ShoppingListStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ShoppingListHome" component={ShoppingListScreen} />
    </Stack.Navigator>
  );
};

const StoresStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="StoresHome" component={NearbyStoresScreen} />
    </Stack.Navigator>
  );
};

const AnalyticsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AnalyticsHome" component={AnalyticsScreen} />
    </Stack.Navigator>
  );
};

const HousemateStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HousemateHome" component={HousemateScreen} />
    </Stack.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Barcode') {
              iconName = focused ? 'barcode' : 'barcode-outline';
            } else if (route.name === 'ShoppingList') {
              iconName = focused ? 'cart' : 'cart-outline';
            } else if (route.name === 'Stores') {
              iconName = focused ? 'location' : 'location-outline';
            } else if (route.name === 'Analytics') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            } else if (route.name === 'Housemates') {
              iconName = focused ? 'people' : 'people-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: '#999',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardStack}
          options={{
            tabBarLabel: '📊 Dashboard',
          }}
        />
        <Tab.Screen
          name="Barcode"
          component={BarcodeStack}
          options={{
            tabBarLabel: '📱 Tara',
          }}
        />
        <Tab.Screen
          name="ShoppingList"
          component={ShoppingListStack}
          options={{
            tabBarLabel: '🛒 Liste',
          }}
        />
        <Tab.Screen
          name="Stores"
          component={StoresStack}
          options={{
            tabBarLabel: '🏪 Marketler',
          }}
        />
        <Tab.Screen
          name="Analytics"
          component={AnalyticsStack}
          options={{
            tabBarLabel: '📈 İstat.',
          }}
        />
        <Tab.Screen
          name="Housemates"
          component={HousemateStack}
          options={{
            tabBarLabel: '👥 Arkadaş',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
