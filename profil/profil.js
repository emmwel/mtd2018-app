import React, { Component } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  ListView,
  Picker,
  AsyncStorage,
  SectionList,
  Image,
  ImageBackground,
  TouchableHighlight
} from 'react-native';

import StarRating from 'react-native-star-rating';
import Ionicons from 'react-native-vector-icons/Ionicons';

import utStyles from 'AppNr1/utstallare/utstallareStyle.js';
import schemaStyles from 'AppNr1/schema/schemaStyle.js';



export default class FavoritScreen extends Component {
  constructor(props) {
    super(props);
    // Inititlize state
    this.state = {
      isFavoritesLoading: true
    };

    sec_header = require('AppNr1/img/sectionB2.png')

  }

  // Set nav. options
  static navigationOptions = {
    title: 'Favoriter',
  };

  // Get users favorites when the screen is preparing to mount
  componentWillMount() {
    this.getFavorites()
  }

  // Get favorites again if user refreshes page
  onRefresh() {
      this.setState({
        isFavoritesLoading: true
      }, function() {
        this.getFavorites()
      });
  }

  // Get user's favorites from the memory of the users phone
  getFavorites = async () => {
    // Inititlize variables
    var allKeys = [];
    var allValuesUtstallare = [];
    var allValuesEvents = [];

    try {
      // Get all keys stored by app in user's phone
      await AsyncStorage.getAllKeys((err, keys) => {
        AsyncStorage.multiGet(keys, (err, stores) => {
          stores.map((result, i, store) => {
            // Map key, value and parse value from the store
            let key = store[i][0];
            let value = store[i][1];
            var jsonValue = JSON.parse(value);

            if (value == null) {
              // Do nothing
            }
            else {
              // Add key to known keys
              allKeys.push(key);
              // Check if event
              if(jsonValue.host == null) {
                allValuesUtstallare.push(JSON.parse(value));
              }
              else {
                allValuesEvents.push(JSON.parse(value));
              }
            }
          });

          // Update state with the acquired favorites
          this.setState({
            favoriteUtstallare: allValuesUtstallare,
            favoriteEvents: allValuesEvents,
            keysforFavs: allKeys,
            isFavoritesLoading: false
          }, function () {
             this.sortObjectsAplhabetically(this.state.favoriteUtstallare);
             this.sortObjectsByTime(this.state.favoriteEvents);
          });

        });
      });

    } catch (error) {
      // Error saving data
      console.log(error);
    }

  }

  // Sorting functions
  sortObjectsAplhabetically(arrayObjects) {
    arrayObjects.sort(function(a, b){
       var x = a.name.toLowerCase();
       var y = b.name.toLowerCase();
       if (x < y) {return -1;}
       if (x > y) {return 1;}
       return 0;
   });
  }

  sortObjectsByTime(arrayObjects) {
    arrayObjects.sort(function(a, b){
       var x = new Date(a.start);
       var y = new Date(b.start);
       if (x.getTime() < y.getTime()) { return -1;}
       if (x.getTime() > y.getTime()) {return 1;}
       return 0;
   });
  }

  // Seperator for the section list in render()
  renderSeparator = () => {
   return (
       <View
         style={{
           height: 1,
           backgroundColor: "#CED0CE",
         }}
       />
     );
  };

  render() {
    // Indicate loading
    if(this.state.isFavoritesLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={utStyles.utstallareEntireView}>

        <SectionList
          stickySectionHeadersEnabled={true}
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.isFavoritesLoading}
          style={{alignSelf: 'stretch'}}
          renderItem={({item}) => <ProfilRow itemProfil={item} favs={this.state.keysforFavs} navigation={this.props.navigation}/>}
          renderSectionHeader={({section}) => <ProfilSectionHeader title={section.title} />}
          ItemSeparatorComponent={this.renderSeparator}
          sections={[ // homogeneous rendering between sections
            {data: this.state.favoriteUtstallare, title: 'Utställare'},
            {data: this.state.favoriteEvents, title: 'Events'}
          ]}
          keyExtractor={item => item.name ? item.name : item.title}
        />
      </View>
    );
  }
}

// Class to make a section header
class ProfilSectionHeader extends Component {
  render () {
    return (
      <View style={utStyles.utstallareHeader}>
        <ImageBackground
            style={{
              flex: 1
            }}
            source={sec_header}
        >
          <Text style={{fontWeight: 'bold', color: 'white', margin: '1%'}}> {this.props.title} </Text>
        </ImageBackground>
      </View>
    );
  }
}

// Class to format rows for the section list
class ProfilRow extends Component {
  constructor(props) {
      super(props);
      this.state = {
        starCount: 0,
        counter: 0,
        isFavorite: false,
        isUtstallare: false,
        isEvent: false
      };
  }

  componentWillMount() {
    // Check type of favorite before mounting
    this.checkType();
  }

  checkType() {
    // Check what type of favorite
    if(this.props.itemProfil.host == null) {
      this.setState({
        isUtstallare: true,
        isEvent: false
      });
      this.checkIfFavoriteUtstallare();
    }
    else {
      this.setState({
        isUtstallare: false,
        isEvent: true
      });
      this.checkIfFavoriteEvent();
    }
  }

  checkIfFavoriteUtstallare() {
    for (i = 0; i < this.props.favs.length; i++) {
      if(this.props.itemProfil.name == this.props.favs[i]) {
        this.setState({
          starCount: 1,
          isFavorite: true
        })
      }
    }
  }

  checkIfFavoriteEvent() {
    for (i = 0; i < this.props.favs.length; i++) {
      if(this.props.itemProfil.title == this.props.favs[i]) {
        this.setState({
          starCount: 1,
          isFavorite: true
        })
      }
    }
  }

  onFavoritePress(rating, item) {
    // Check if in favorites, if not add it
    if (!(this.state.isFavorite)) {
      this.setState({
        starCount: rating,
        isFavorite: true
      });
      if(this.state.isUtstallare) {
        this.favoriteMarkUtstallare(item);
      }
      else {
        this.favoriteMarkEvent(item);
      }

    }
    else { // Unfavorite
      this.setState({
        starCount: 0,
        isFavorite: false
      });
      if(this.state.isUtstallare) {
        this.deleteMarkUtstallare(item);
      }
      else {
        this.deleteMarkEvent(item);
      }
    }
    ++this.state.counter;
  }

  favoriteMarkUtstallare = async (item) => {
    // Add favorite to user's storage
    try {
      await AsyncStorage.setItem(item.name, JSON.stringify(item));
    } catch (error) {
      // Error saving data
      console.log('feeel vid set');
    }
  }

  deleteMarkUtstallare = async (item) => {
    // Delete favorite from user's storage
    try {
      await AsyncStorage.removeItem(item.name);
    } catch (error) {
      // Error saving data
      console.log('feeel vid get');
    }
  }

  favoriteMarkEvent = async (item) => {
    // Add favorite from user's storage
    try {
      await AsyncStorage.setItem(item.title, JSON.stringify(item));
    } catch (error) {
      // Error saving data
      console.log(error);
    }
  }

  deleteMarkEvent = async (item) => {
    // Delete favorite from user's storage
    try {
      await AsyncStorage.removeItem(item.title);
    } catch (error) {
      // Error saving data
      console.log('feeel vid get');
    }
  }

  // Check if company is climate certified
  checkIfKlimat(klimat) {
    if(klimat == 1) {
      return(
        <Ionicons name={'ios-leaf'} size={25} color={'green'} style={{alignSelf: 'center', paddingRight: "1%"}}/>
      );
    }
    else return(null);
  }

  render() {
    if(this.state.isUtstallare) {
      var dag = "";

      if(this.props.itemProfil.onsdag == 1 && this.props.itemProfil.torsdag == 1) {
        dag = "Båda dagarna";
      }
      else if(this.props.itemProfil.onsdag == 1) {
        dag = "Onsdag";
      }
      else if(this.props.itemProfil.torsdag == 1) {
        dag = "Torsdag";
      }

      return (
        <TouchableHighlight onPress={() => this.props.navigation.navigate('UtstallareDetails', {
              utstallare: this.props.itemProfil
            })}
          underlayColor={'#d3d3d3'}
        >
          <View style={{flexDirection: 'row'}}>
            <View style={utStyles.utstallareView}>
              <Image source={{ uri: this.props.itemProfil.image}} style={utStyles.utstallareImage} />
              <View style={utStyles.utstallareInfo}>
                <Text style={utStyles.utstallareHeadline}>
                  {this.props.itemProfil.name}
                </Text>
                <Text style={utStyles.utstallareText}>
                  Ställer ut: {dag}
                </Text>
                <Text style={utStyles.utstallareText}>
                  Plats på kartan: {this.props.itemProfil.plats}
                </Text>
              </View>
            </View>
            {this.checkIfKlimat(this.props.itemProfil.klimat)}
            <View style={{alignSelf: 'center', paddingRight: '1%'}}>
            <StarRating
              disabled={false}
              emptyStar={'md-star-outline'}
              fullStar={'md-star'}
              iconSet={'Ionicons'}
              emptyStarColor={'orange'}
              fullStarColor={'orange'}
              maxStars={1}
              rating={this.state.starCount}
              selectedStar={(rating) => this.onFavoritePress(rating, this.props.itemProfil)}
            />
            </View>
          </View>
        </TouchableHighlight>
      );
    }
    if(this.state.isEvent) {
      return(
        <TouchableHighlight onPress={() => this.props.navigation.navigate('EventDetails', {
              anEvent: this.props.itemProfil
            })}
          underlayColor={'#d3d3d3'}
        >
          <View style={{flexDirection: 'row'}}>
            <View style={schemaStyles.schemaView}>
              <Image source={{ uri: this.props.itemProfil.image}} style={schemaStyles.schemaImage} />
              <View style={schemaStyles.schemaInfo}>
                <Text style={schemaStyles.schemaHeadline}>
                  {this.props.itemProfil.title}
                </Text>
                <Text style={schemaStyles.schemaText}>
                  {this.props.itemProfil.host}
                </Text>
                <Text style={schemaStyles.schemaText}>
                  Tid: {this.props.itemProfil.time}
                </Text>
                <Text style={schemaStyles.schemaText}>
                  Plats: {this.props.itemProfil.place}
                </Text>
              </View>
            </View>
            <View style={{alignSelf: 'center'}}>
              <StarRating
                disabled={false}
                emptyStar={'md-star-outline'}
                fullStar={'md-star'}
                iconSet={'Ionicons'}
                emptyStarColor={'orange'}
                fullStarColor={'orange'}
                maxStars={1}
                rating={this.state.starCount}
                selectedStar={(rating) => this.onFavoritePress(rating, this.props.itemProfil)}
              />
            </View>
          </View>
        </TouchableHighlight>
      );
    }
  }
}
