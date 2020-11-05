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

import { Dropdown } from 'react-native-material-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import StarRating from 'react-native-star-rating';
import Ionicons from 'react-native-vector-icons/Ionicons';

//stylesheet
import utStyles from './utstallareStyle.js';

export default class UtstallareDetailScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFavoritesLoading: true,
      isFavorite: false,
      starCount: 0,
      counter: 0
    };
  }

  componentWillMount() {
    this.getFavorites()

  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: params ? params.utstallare.name : 'A Nested Details Screen',
    }
  };

  ifKlimat(klimat) {
    if(klimat == 1) {
      return(
        <Text style={{fontSize: 16,
        fontFamily: 'OpenSans-Bold'}}>
          Miljöföretag
        </Text>
      );
    }
    else return(null);
  }

  ifSamarbetspartner(sponsor) {
    if(sponsor == 1) {
      return(
        <Text style={{fontSize: 18,
        fontFamily: 'OpenSans-Bold'}}>
          Samarbetspartner
        </Text>
      );
    }
    else return(null);
  }

  vilkaDagar(onsdag, torsdag) {
    if(onsdag == 1 && torsdag == 1) {
      return(
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 14,
          fontFamily: 'OpenSans-Bold', paddingTop: "1%"}}>
            Ställer ut
          </Text>
          <Text style={{fontSize: 14,
          fontFamily: 'OpenSans-Light', paddingTop: "1%"}}>
            : Båda dagarna
          </Text>
        </View>
      );
    }
    else if(onsdag == 1) {
      return(
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 14,
          fontFamily: 'OpenSans-Bold', paddingTop: "1%"}}>
            Ställer ut
          </Text>
          <Text style={{fontSize: 14,
          fontFamily: 'OpenSans-Light', paddingTop: "1%"}}>
            : Onsdag
          </Text>
        </View>
      );
    }
    else if(torsdag == 1) {
      return(
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 14,
          fontFamily: 'OpenSans-Bold', paddingTop: "1%"}}>
            Ställer ut
          </Text>
          <Text style={{fontSize: 14,
          fontFamily: 'OpenSans-Light', paddingTop: "1%"}}>
            : Torsdag
          </Text>
        </View>
      );
    }
    else return(null);
  }

  onFavoritePress(rating, item) {
    if (!(this.state.isFavorite)) {
      this.setState({
        starCount: rating,
        isFavorite: true
      });
      this.favoriteMark(item);
    }
    else {
      this.setState({
        starCount: 0,
        isFavorite: false
      });
      this.deleteMark(item);
    }
    ++this.state.counter;
  }

  getFavorites = async () => {
    var allKeys = [];
    try {
      await AsyncStorage.getAllKeys((err, keys) => {
        AsyncStorage.multiGet(keys, (err, stores) => {
          stores.map((result, i, store) => {
            // get at each store's key/value so you can work with it
            let key = store[i][0];
            let value = store[i][1];
            if (value == null) {

            }
            else {
              if(JSON.parse(value).host == null) {
                allKeys.push(key);
              }
            }

          });
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

  favoriteMark = async (item) => {

    try {
      await AsyncStorage.setItem(item.name, JSON.stringify(item));
    } catch (error) {
      // Error saving data
      console.log('feeel vid set');
    }
  }

  deleteMark = async (item) => {

    try {
      await AsyncStorage.removeItem(item.name);
    } catch (error) {
      // Error saving data
      console.log('feeel vid get');
    }
  }

  checkIfFavorite() {
    const { params } = this.props.navigation.state;

    for (i = 0; i < this.state.favorites.length; i++) {
      if(params.utstallare.name == this.state.favorites[i]) {
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
    const utstallare = params ? params.utstallare : null;

    return(

      <View style={{flex:1, backgroundColor: 'white', paddingTop: '5%'}}>

          <Image
            source={{uri: utstallare.image}}
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
                {utstallare.name}
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
              <View style={{flexDirection: 'column'}}>
                {this.ifSamarbetspartner(utstallare.sponsor)}
                {this.ifKlimat(utstallare.klimat)}
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: 14,
                  fontFamily: 'OpenSans-Bold', paddingTop: "1%"}}>
                      Erbjuder
                  </Text>
                  <Text style={{fontSize: 14,
                  fontFamily: 'OpenSans-Light', paddingTop: "1%"}}>
                       : {utstallare.erbjudande}
                  </Text>
                </View>
                {this.vilkaDagar(utstallare.onsdag, utstallare.torsdag)}
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: 14,
                  fontFamily: 'OpenSans-Bold', paddingTop: "1%"}}>
                      Utställningsplats
                  </Text>
                  <Text style={{fontSize: 14,
                  fontFamily: 'OpenSans-Light', paddingTop: "1%"}}>
                       : {utstallare.plats}
                  </Text>
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
                  selectedStar={(rating) => this.onFavoritePress(rating, utstallare)}
                />
              </View>

            </View>

            <Text style={{fontSize: 14,
            fontFamily: 'OpenSans-Bold', paddingTop: "1%"}}>
              Information:
            </Text>
            <Text style={{fontSize: 14,
            fontFamily: 'OpenSans-Light', paddingTop: "1%"}}>
              {utstallare.info}
            </Text>
          </View>
          </ScrollView>
      </View>

    );
  }
}
