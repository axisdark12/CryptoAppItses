import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import EstadisticasScreen from '../screens/EstadisticasScreen';
import GraficoBitcoinScreen from '../screens/GraficoBitcoinScreen';
import GraficoHistoricoScreen from '../screens/GraficoHistoricoScreen';
import SimuladorScreen from '../screens/SimuladorScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigation() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#1a1a2e',
                        shadowColor: 'transparent',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    tabBarStyle: {
                        backgroundColor: '#0f0f1a',
                        borderTopWidth: 0,
                        height: 65,
                        paddingBottom: 10,
                        paddingTop: 8,
                    },
                    tabBarActiveTintColor: '#5E49E2',
                    tabBarInactiveTintColor: '#8E8E8E',
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName = 'ellipse';

                        switch (route.name) {
                            case 'Home':
                                iconName = focused ? 'home' : 'home-outline';
                                break;

                            case 'Estadísticas':
                                iconName = focused
                                    ? 'bar-chart'
                                    : 'bar-chart-outline';
                                break;

                            case 'Gráfica Vela':
                                iconName = focused
                                    ? 'stats-chart'
                                    : 'stats-chart-outline';
                                break;

                            case 'Simulador':
                                iconName = focused
                                    ? 'calculator'
                                    : 'calculator-outline';
                                break;

                            case 'Gráficas':
                                iconName = focused
                                    ? 'logo-bitcoin'
                                    : 'logo-bitcoin';
                                break;
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: 'Home' }}
                />
                <Tab.Screen
                    name="Estadísticas"
                    component={EstadisticasScreen}
                />
                <Tab.Screen
                    name="Gráfica Vela"
                    component={GraficoHistoricoScreen}
                />
                <Tab.Screen
                    name="Simulador"
                    component={SimuladorScreen}
                />
                <Tab.Screen
                    name="Gráficas"
                    component={GraficoBitcoinScreen}
                />

            </Tab.Navigator>
        </NavigationContainer>
    );
}
