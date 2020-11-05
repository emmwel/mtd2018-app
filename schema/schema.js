import React, { Component } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  SectionList,
  Image,
  ImageBackground,
  AsyncStorage,
  TouchableHighlight
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import StarRating from 'react-native-star-rating';

import schemaStyles from './schemaStyle.js'

export default class SchemaScreen extends Component {
  constructor(props) {
    super(props);
    // Inititlize state
    this.state = {
      isSchemaLoading: true,
      isFavoritesLoading: true
    }
    sec_header = require('AppNr1/img/sectionB2.png')
  }

  // Set nav. options
  static navigationOptions = {
    title: 'Schema',
  };

  componentWillMount() {
    this.getFavorites()
  }

  componentDidMount() {
    this.getSchemaAsync()
  }

  getFavorites = async () => {
    // Inititlize variables
    var allKeys = [];
    try {
      await AsyncStorage.getAllKeys((err, keys) => {
        AsyncStorage.multiGet(keys, (err, stores) => {
          stores.map((result, i, store) => {
            // Map key and value from the store
            let key = store[i][0];
            let value = store[i][1];

            if (value == null) {
              // Do nothing
            }
            else {
              // Only parse events with a host
              if(JSON.parse(value).host != null) {
                allKeys.push(key);
              }
            }

          });
          this.setState({
            favorites: allKeys,
            isFavoritesLoading: false
          });
        });
      });

    } catch (error) {
      // Error saving data
      console.log(error);
    }

  }

  // Get all events remotely
  getSchemaAsync = () => fetch('https://emmwel.github.io/schema.json')
   .then((response) => response.json()) // Parse json
   .then((responseJson) => {
     this.setState({
       schema: responseJson,
       isSchemaLoading: false
     }, function () {
     });
   })
   .catch((error) => {
      console.error(error);
   })

   // When user refreshes screen, reload favorites
   onRefresh() {
       this.setState({
         isFavoritesLoading: true
       }, function() {
         this.getFavorites()
       });
   }

   // Seperator for section list in render()
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

    render () {
      if(!(this.state.isFavoritesLoading)) {
        if (this.state.isSchemaLoading) {
          return (
            <View style={{flex: 1, paddingTop: 20}}>
              <ActivityIndicator />
            </View>
          );
        }

        if(!(this.state.isSchemaLoading)) {
          return (
            <View style={{flex: 1}}>
              <View style={schemaStyles.schemaEntireView}>
                <SectionList
                  stickySectionHeadersEnabled={true}
                  onRefresh={() => this.onRefresh()}
                  refreshing={this.state.isFavoritesLoading}
                  style={{alignSelf: 'stretch'}}
                  renderItem={({item}) => <SchemaRow itemSchema={item} favs={this.state.favorites} navigation={this.props.navigation}/>}
                  renderSectionHeader={({section}) => <SectionSchemaHeader title={section.title} /> }
                  ItemSeparatorComponent={this.renderSeparator}
                  sections={[ // homogeneous rendering between sections
                    {data: this.state.schema.onsdag, title: 'Onsdag'},
                    {data: this.state.schema.torsdag, title: 'Torsdag'},
                  ]}
                  keyExtractor={item => item.title}
                />
              </View>
            </View>
          );
        }
      }
      else {
        return (
          <View style={{flex: 1, paddingTop: 20}}>
            <ActivityIndicator />
          </View>
        );
      }
    }
}

// Class to create a section header
class SectionSchemaHeader extends Component {
  render () {
    return (
      <View style={schemaStyles.schemaHeader}>
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

// Class for each row in the section list
class SchemaRow extends Component {
  constructor(props) {
      super(props);
      this.state = {
        starCount: 0,
        counter: 0,
        isFavorite: false
      };
  }

  // Check if the row has been is favorited
  componentWillMount() {
    this.checkIfFavorite();
  }

  onFavoritePress(rating, item) {
    // If not a favorite, add it to favorites
    if (!(this.state.isFavorite)) {
      this.setState({
        starCount: rating,
        isFavorite: true
      });
      this.favoriteMark(item);
    }
    else { // Delete favorite
      this.setState({
        starCount: 0,
        isFavorite: false
      });
      this.deleteMark(item);
    }
    ++this.state.counter;
  }

  favoriteMark = async (item) => {
    // Set as favorite in the user's storage
    try {
      await AsyncStorage.setItem(item.title, JSON.stringify(item));
    } catch (error) {
      // Error saving data
      console.log(error);
    }
  }

  deleteMark = async (item) => {
    // Delete favorite from the user's storage
    try {
      await AsyncStorage.removeItem(item.title);
    } catch (error) {
      // Error saving data
      console.log('feeel vid get');
    }
  }

  // Check favorite and set state
  checkIfFavorite() {
    for (i = 0; i < this.props.favs.length; i++) {
      if(this.props.itemSchema.title == this.props.favs[i]) {
        this.setState({
          starCount: 1,
          isFavorite: true
        })
      }
    }
  }

  render() {
    return (
      <TouchableHighlight onPress={() => this.props.navigation.navigate('EventDetails', {
            anEvent: this.props.itemSchema
          })}
          underlayColor={'#d3d3d3'}
      >
        <View style={{flexDirection: 'row'}}>
          <View style={schemaStyles.schemaView}>
            <Image source={{ uri: this.props.itemSchema.image}} style={schemaStyles.schemaImage} />
            <View style={schemaStyles.schemaInfo}>
              <Text style={schemaStyles.schemaHeadline}>
                {this.props.itemSchema.title}
              </Text>
              <Text style={schemaStyles.schemaText}>
                {this.props.itemSchema.host}
              </Text>
              <Text style={schemaStyles.schemaText}>
                Tid: {this.props.itemSchema.time}
              </Text>
              <Text style={schemaStyles.schemaText}>
                Plats: {this.props.itemSchema.place}
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
              selectedStar={(rating) => this.onFavoritePress(rating, this.props.itemSchema)}
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
