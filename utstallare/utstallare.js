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
  TouchableHighlight,
  Dimensions
} from 'react-native';

import { Dropdown } from 'react-native-material-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import StarRating from 'react-native-star-rating';
import Ionicons from 'react-native-vector-icons/Ionicons';

//stylesheet
import utStyles from './utstallareStyle.js';

export default class UtstallareScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isUtstallareLoading: true,
      isFavoritesLoading: true,
      bothDaysBool: false,
      onlyWedBool: false,
      onlyThursBool: false,
    }
  }

  static navigationOptions = {
    title: 'Utställare',
  };

  componentDidMount() {
    this.getUtstallareAsync()
  }

  componentWillMount() {
    this.getFavorites()

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
          });
        });
      });

    } catch (error) {
      // Error saving data
      console.log(error);
    }

  }

  getUtstallareAsync = () => fetch('https://emmwel.github.io/utstallare.json')
   .then((response) => response.json())
   .then((responseJson) => {
     //let utstallareDS = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
     this.setState({
       isUtstallareLoading: false,
       utstallare: responseJson

     }, function () {
       this.sortAplhabetically(this.state.utstallare.both);
       this.sortAplhabetically(this.state.utstallare.onsdag);
       this.sortAplhabetically(this.state.utstallare.torsdag);
     });


   })
   .catch((error) => {
      console.error(error);
   })

   sortAplhabetically(arrayObjects) {
     arrayObjects.sort(function(a, b){
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });
   }

   onRefresh() {
       this.setState({
         isFavoritesLoading: true
       }, function() {
         this.getFavorites()
       });
   }

   changeDays({value}) {
     if(value == 'Båda dagarna') {
       this.setState({
         bothDaysBool: true,
         onlyWedBool: false,
         onlyThursBool: false
       });
     }
     else if(value == 'Onsdag') {
       this.setState({
         bothDaysBool: false,
         onlyWedBool: true,
         onlyThursBool: false
       });
     }
     else if(value == 'Torsdag') {
       this.setState({
         bothDaysBool: false,
         onlyWedBool: false,
         onlyThursBool: true
       });
     }
   }

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
      var {height, width} = Dimensions.get('window');

      if (!(this.state.isFavoritesLoading)) {

        if (this.state.isUtstallareLoading) {
          return (
            <View style={{flex: 1, paddingTop: 20}}>
              <ActivityIndicator />
            </View>
          );
        }


        let data1 = [
          {
            value: 'Båda dagarna',
          },
          {
            value: 'Onsdag',
          },
          {
            value: 'Torsdag',
          }
        ];

        if(!(this.state.isUtstallareLoading) && this.state.bothDaysBool) {
          return(
            <View style={utStyles.utstallareEntireView}>
              <View style={{margin: "2%"}}>
                <Dropdown
                  label= 'Utställningsdagar'
                  data={data1}
                  onChangeText={(value, index, data) => this.changeDays(data[index])}
                />
              </View>
              <SectionList
                ListHeaderComponent= {
                    <Image
                      source={{uri: 'https://emmwel.github.io/Mass_skiss.png'}}
                      style={{flex: 1, width: width, height: height/3}}
                      resizeMode="contain"
                    />
                }
                onRefresh={() => this.onRefresh()}
                refreshing={this.state.isFavoritesLoading}
                stickySectionHeadersEnabled={true}
                style={{alignSelf: 'stretch'}}
                renderItem={({item}) => <UtstallareRow item={item} favs={this.state.favorites} navigation={this.props.navigation}/>}
                renderSectionHeader={({section}) => <SectionHeader title={section.title} />}
                ItemSeparatorComponent={this.renderSeparator}
                sections={[ // homogeneous rendering between sections
                  {data: this.state.utstallare.samarbetspartners, title: 'Samarbetspartners'},
                  {data: this.state.utstallare.both, title: 'Utställare - Båda dagarna'}
                ]}
                keyExtractor={item => item.name}
              />
            </View>
          );
        }

        else if(!(this.state.isUtstallareLoading) && this.state.onlyWedBool) {
          return(
            <View style={utStyles.utstallareEntireView}>
              <View style={{margin: "2%"}}>
                <Dropdown
                  label= 'Utställningsdagar'
                  data={data1}
                  onChangeText={(value, index, data) => this.changeDays(data[index])}
                />
              </View>
              <SectionList
                ListHeaderComponent= {
                    <Image
                      source={{uri: 'https://emmwel.github.io/Mass_skiss.png'}}
                      style={{flex: 1, width: width, height: height/3}}
                      resizeMode="contain"
                    />
                }
                onRefresh={() => this.onRefresh()}
                refreshing={this.state.isFavoritesLoading}
                stickySectionHeadersEnabled={true}
                style={{alignSelf: 'stretch'}}
                renderItem={({item}) => <UtstallareRow item={item} favs={this.state.favorites} navigation={this.props.navigation}/>}
                renderSectionHeader={({section}) => <SectionHeader title={section.title} />}
                ItemSeparatorComponent={this.renderSeparator}
                sections={[ // homogeneous rendering between sections
                  {data: this.state.utstallare.samarbetspartners, title: 'Samarbetspartners'},
                  {data: this.state.utstallare.onsdag, title: 'Endast onsdag'},
                  {data: this.state.utstallare.both, title: 'Utställare - Båda dagarna'}
                ]}
                keyExtractor={item => item.name}
              />
              </View>
          );
        }

        else if(!(this.state.isUtstallareLoading) && this.state.onlyThursBool) {
          return(

            <View style={utStyles.utstallareEntireView}>
              <View style={{margin: "2%"}}>
                <Dropdown
                  label= 'Utställningsdagar'
                  data={data1}
                  onChangeText={(value, index, data) => this.changeDays(data[index])}
                />
              </View>
              <SectionList
                ListHeaderComponent= {
                    <Image
                      source={{uri: 'https://emmwel.github.io/Mass_skiss.png'}}
                      style={{flex: 1, width: width, height: height/3}}
                      resizeMode="contain"
                    />
                }
                onRefresh={() => this.onRefresh()}
                refreshing={this.state.isFavoritesLoading}
                stickySectionHeadersEnabled={true}
                style={{alignSelf: 'stretch'}}
                renderItem={({item}) => <UtstallareRow item={item} favs={this.state.favorites} navigation={this.props.navigation}/>}
                renderSectionHeader={({section}) => <SectionHeader title={section.title} /> }
                ItemSeparatorComponent={this.renderSeparator}
                sections={[ // homogeneous rendering between sections
                  {data: this.state.utstallare.samarbetspartners, title: 'Samarbetspartners'},
                  {data: this.state.utstallare.torsdag, title: 'Endast torsdag'},
                  {data: this.state.utstallare.both, title: 'Utställare - Båda dagarna'}
                ]}
                keyExtractor={item => item.name}
              />
            </View>
          );
        }

        if(!(this.state.isUtstallareLoading)) {
          return (

            <View style={utStyles.utstallareEntireView}>
              <View style={{margin: "2%"}}>
                <Dropdown
                  label= 'Utställningsdagar'
                  data={data1}
                  onChangeText={(value, index, data) => this.changeDays(data[index])}
                />
              </View>
              <SectionList
                ListHeaderComponent= {
                    <Image
                      source={{uri: 'https://emmwel.github.io/Mass_skiss.png'}}
                      style={{flex: 1, width: width, height: height/3}}
                      resizeMode="contain"
                    />
                }
                onRefresh={() => this.onRefresh()}
                refreshing={this.state.isFavoritesLoading}
                stickySectionHeadersEnabled={true}
                style={{alignSelf: 'stretch'}}
                renderItem={({item}) => <UtstallareRow item={item} favs={this.state.favorites} navigation={this.props.navigation}/>}
                renderSectionHeader={({section}) => <SectionHeader title={section.title} /> }
                ItemSeparatorComponent={this.renderSeparator}
                sections={[ // homogeneous rendering between sections
                  {data: this.state.utstallare.samarbetspartners, title: 'Samarbetspartners'},
                  {data: this.state.utstallare.both, title: 'Utställare - Båda dagarna'}
                ]}
                keyExtractor={item => item.name}
              />
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

class SectionHeader extends Component {
  render () {

    return (
      <View style={utStyles.utstallareHeader}>
        <ImageBackground
            style={{
              flex: 1
            }}
            source={require('AppNr1/img/sectionB2.png')}
        >
        <Text style={{fontWeight:'bold', color: 'white', margin: '1%' }}> {this.props.title} </Text>
        </ImageBackground>
      </View>
    );
  }
}

class UtstallareRow extends Component {
  constructor(props) {
      super(props);
      this.state = {
        starCount: 0,
        counter: 0,
        isFavorite: false
      };

  }

  componentWillMount() {
    this.checkIfFavorite();
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
    for (i = 0; i < this.props.favs.length; i++) {
      if(this.props.item.name == this.props.favs[i]) {
        this.setState({
          starCount: 1,
          isFavorite: true
        })
      }
    }
  }

  render() {
    var dag = "";

    if(this.props.item.onsdag == 1 && this.props.item.torsdag == 1) {
      dag = "Båda dagarna";
    }
    else if(this.props.item.onsdag == 1) {
      dag = "Onsdag";
    }
    else if(this.props.item.torsdag == 1) {
      dag = "Torsdag";
    }

    if (this.props.item.klimat == 1) {

      return (
        <TouchableHighlight onPress={() => this.props.navigation.navigate('UtstallareDetails', {
              utstallare: this.props.item
            })}
            underlayColor={'#d3d3d3'}
        >
          <View style={{flexDirection: 'row'}}>
            <View style={utStyles.utstallareView}>
              <Image source={{ uri: this.props.item.image}} style={utStyles.utstallareImage} />
              <View style={utStyles.utstallareInfo}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={utStyles.utstallareHeadline}>
                    {this.props.item.name}
                  </Text>
                </View>
                <Text style={utStyles.utstallareText}>
                  Ställer ut: {dag}
                </Text>
                <Text style={utStyles.utstallareText}>
                  Plats på kartan: {this.props.item.plats}
                </Text>
              </View>
            </View>
            <Ionicons name={'ios-leaf'} size={25} color={'green'} style={{alignSelf: 'center', paddingRight: "1%"}}/>
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
                selectedStar={(rating) => this.onFavoritePress(rating, this.props.item)}
              />
            </View>
          </View>
        </TouchableHighlight>
      );
    }
    else {
      return (
        <TouchableHighlight onPress={() => this.props.navigation.navigate('UtstallareDetails', {
              utstallare: this.props.item
            })}
            underlayColor={'#d3d3d3'}
        >
          <View style={{flexDirection: 'row'}}>
            <View style={utStyles.utstallareView}>
              <Image source={{ uri: this.props.item.image}} style={utStyles.utstallareImage} />
              <View style={utStyles.utstallareInfo}>
                <Text style={utStyles.utstallareHeadline}>
                  {this.props.item.name}
                </Text>
                <Text style={utStyles.utstallareText}>
                  Ställer ut: {dag}
                </Text>
                <Text style={utStyles.utstallareText}>
                  Plats på kartan: {this.props.item.plats}
                </Text>
              </View>
            </View>
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
                selectedStar={(rating) => this.onFavoritePress(rating, this.props.item)}
              />
            </View>
          </View>
        </TouchableHighlight>
      );
    }
  }
}
