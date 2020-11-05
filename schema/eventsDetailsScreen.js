import React, { Component} from 'react';
import {
  Text,
  View,
  ListView,
  ActivityIndicator,
  Image,
  Picker,
  ScrollView,
  StyleSheet,
  SectionList,
  Button,
  AsyncStorage,
  ImageBackground,
  RefreshControl
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import StarRating from 'react-native-star-rating';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default class EventsDetailScreen extends Component {
  constructor(props) {
    super(props);
    // Inititlize state
    this.state = {
      isFavoritesLoading: true,
      isFavorite: false,
      starCount: 0,
      counter: 0,
      isFavorite: false
    };
  }

  // Set navigation options
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: params ? params.anEvent.host : 'A Nested Details Screen',
    }
  };

  // Get user's favorites
  componentWillMount() {
    this.getFavorites()
  }

  // Get favorites from user's storage
  getFavorites = async () => {
    var allKeys = [];
    try {
      await AsyncStorage.getAllKeys((err, keys) => {
        AsyncStorage.multiGet(keys, (err, stores) => {
          stores.map((result, i, store) => {
            // Map key, value
            let key = store[i][0];
            let value = store[i][1];
            if (value == null) {
              // Do nothing
            }
            else {
              if(JSON.parse(value).host != null) {
                allKeys.push(key);
              }
            }

          });
          // Set state with all favorites
          this.setState({
            favorites: allKeys,
            isFavoritesLoading: false
          }, function () {
            this.checkIfFavorite();
          });
        });
      });

    } catch (error) {
      // Error saving data
      console.log(error);
    }

  }

  // Function to handle favorite button being pressed
  onFavoritePress(rating, item) {
    // Check if favorite
    if (!(this.state.isFavorite)) {
      // Set state and add to favorites
      this.setState({
        starCount: rating,
        isFavorite: true
      });
      this.favoriteMark(item);
    }
    else {
      // Delete from favorites
      this.setState({
        starCount: 0,
        isFavorite: false
      });
      this.deleteMark(item);
    }
    ++this.state.counter;
  }

  favoriteMark = async (item) => {
    // Add event to favorites in user's storage
    try {
      await AsyncStorage.setItem(item.title, JSON.stringify(item));
    } catch (error) {
      // Error saving data
      console.log('feeel vid set');
    }
  }

  deleteMark = async (item) => {
    // Delete event from favorites in user's storage
    try {
      await AsyncStorage.removeItem(item.title);
    } catch (error) {
      // Error saving data
      console.log('feeel vid get');
    }
  }

  checkIfFavorite() {
    const { params } = this.props.navigation.state;

    for (i = 0; i < this.state.favorites.length; i++) {
      if(params.anEvent.title == this.state.favorites[i]) {
        this.setState({
          starCount: 1,
          isFavorite: true
        })
      }
      else {
        this.setState({
          starCount: 0,
          isFavorite: false
        })
      }
    }
    if(this.state.favorites.length == 0) {
      this.setState({
        starCount: 0,
        isFavorite: false
      })
    }
  }

  onRefresh() {
      this.setState({
        isFavoritesLoading: true
      }, function() {
        this.getFavorites();
      });
  }

  render () {
    const { params } = this.props.navigation.state;
    const anEvent = params ? params.anEvent : null;

    return(
      <View style={{flex:1, backgroundColor: 'white', paddingTop: '5%'}}>
          <Image
            source={{uri: anEvent.image}}
            style={{flex: 0.4, alignSelf: 'center', width:'90%', height: '10%', marginBottom: '1%'}}
            resizeMode="contain"
          />
          <View style={{flexDirection: 'row'}}>
            <ImageBackground
                style={{
                  flex: 1
                }}
                source={require('AppNr1/img/sectionB2.png')}
            >
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 20,
              fontFamily: 'OpenSans-Bold', padding: '1%', color: 'white'}}>
                {anEvent.title}
              </Text>
            </View>
            </ImageBackground>

          </View>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.isFavoritesLoading}
                onRefresh={() => this.onRefresh()}
              />
            }
          >
            <View style={{flex: 0.6, padding: '1%'}}>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 14,
                    fontFamily: 'OpenSans-Bold', paddingTop: "1%"}}>
                        Arrangör
                    </Text>
                    <Text style={{fontSize: 14,
                    fontFamily: 'OpenSans-Light', paddingTop: "1%"}}>
                         : {anEvent.host}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 14,
                    fontFamily: 'OpenSans-Bold', paddingTop: "1%"}}>
                        Tid
                    </Text>
                    <Text style={{fontSize: 14,
                    fontFamily: 'OpenSans-Light', paddingTop: "1%"}}>
                         : {anEvent.time}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 14,
                    fontFamily: 'OpenSans-Bold', paddingTop: "1%"}}>
                        Plats
                    </Text>
                    <Text style={{fontSize: 14,
                    fontFamily: 'OpenSans-Light', paddingTop: "1%"}}>
                         : {anEvent.place}
                    </Text>
                  </View>
                </View>
              </View>
              <StarRating
                disabled={false}
                emptyStar={'md-star-outline'}
                fullStar={'md-star'}
                iconSet={'Ionicons'}
                emptyStarColor={'orange'}
                fullStarColor={'orange'}
                maxStars={1}
                rating={this.state.starCount}
                selectedStar={(rating) => this.onFavoritePress(rating, anEvent)}
              />
              <Text style={{fontSize: 14,
              fontFamily: 'OpenSans-Bold', paddingTop: "1%"}}>
                Information:
              </Text>
              <Text style={{fontSize: 14,
              fontFamily: 'OpenSans-Light', paddingTop: "1%"}}>
                {anEvent.info}
              </Text>
            </View>
          </ScrollView>
      </View>

    );
  }
}
