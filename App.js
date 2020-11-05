import React from 'react';
import { AppRegistry } from 'react-native';
import { TabNavigator, TabBarBottom, StackNavigator } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Import main views
import StartScreen from './start/start.js';
import OmScreen from './om/om.js';
import UtstallareScreen from './utstallare/utstallare.js';
import SchemaScreen from './schema/schema.js';
import FavoritScreen from './profil/profil.js';

// Import detail screens
import UtstallareDetailScreen from './utstallare/utstallareDetailScreen.js';
import EventsDetailScreen from './schema/eventsDetailsScreen.js';

// Create StackNavigators for each main view
const StartStack = StackNavigator(
  {
    Start: { screen: StartScreen }
  },
  {
    // Set initial route name to name of the main screen of the view
    initialRouteName: 'Start',
  }
);

const OmStack = StackNavigator(
  {
    Om: { screen: OmScreen }
  },
  {
    initialRouteName: 'Om',
  }
);

const UtstallareStack = StackNavigator(
  {
    Utstallare: { screen: UtstallareScreen },
    UtstallareDetails: {screen: UtstallareDetailScreen},
  },
  {
    initialRouteName: 'Utstallare',
  }
);

const SchemaStack = StackNavigator(
  {
    Schema: { screen: SchemaScreen },
    EventDetails: {screen: EventsDetailScreen}
  },
  {
    initialRouteName: 'Schema',
  }
);

const FavoritStack = StackNavigator(
  {
    Favoriter: { screen: FavoritScreen },
    UtstallareDetails: {screen: UtstallareDetailScreen},
    EventDetails: {screen: EventsDetailScreen}
  },
  {
    initialRouteName: 'Favoriter',
  }
);

// Create tabs
const RootTabs = TabNavigator(
  {
    // Set the tabs to the main screens (now StackNavigators)
    Start: { screen: StartStack },
    Om: { screen: OmStack },
    Utstallare: { screen: UtstallareStack },
    Schema: { screen: SchemaStack },
    Favoriter: { screen: FavoritStack },
  },
  {
    navigationOptions: ({ navigation }) => ({
    // Create the tabs
      tabBarIcon: ({ focused, tintColor }) => {
        // Get the routeName
        const { routeName } = navigation.state;
        let iconName;
        // Check which tab routeName equals
        if (routeName === 'Start') {
          iconName = `home`;
        } else if (routeName === 'Om') {
          iconName = `info`;
        } else if (routeName === 'Utstallare') {
          iconName = `assignment-ind`;
        } else if (routeName === 'Schema') {
          iconName = `date-range`;
        } else if (routeName === 'Favoriter') {
          iconName = `star`;
        }
        // Return the tab with the correct icon
        return <MaterialIcons name={iconName} size={25} color={tintColor} />;
      },
    }),
    // Set colors for the different tab states
    tabBarOptions: {
      activeTintColor: 'orange',
      inactiveTintColor: 'gray',
    },
    // Set properties of the tabBar
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }


);

// Export the entire app
export default class App extends React.Component {
  render() {
    return <RootTabs />;
  }
}

AppRegistry.registerComponent('Medieteknikdagarna', () => App);
