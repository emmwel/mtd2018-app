import React, { Component } from 'react';
import {
  Text,
  View,
  ListView,
  ActivityIndicator,
  Image,
  SectionList,
  ImageBackground
} from 'react-native';

//stylesheet
import startStyles from './startStyle.js';

export default class StartScreen extends Component {

    constructor(props) {
      super(props);
      this.state = {
        isEventsLoading: true,
        isEventsFixing: true,
        currentDate: new Date()
      }
    }

    static navigationOptions = {
      title: 'Start',
    };

    componentDidMount() {
      this.getEventsAsync()

    }

    getEventsAsync = () => fetch('https://emmwel.github.io/events.json')
     .then((response) => response.json())
     .then((responseJson) => {
       this.setState({
         events: responseJson,
         isEventsLoading: false

       }, function () {
         this.decideValues()
       });
     })
     .catch((error) => {
        console.error(error);
     })

     decideValues() {
       var countUpcoming = 0;
       var countObjects = 0;
       var dateNow = new Date();
       var upcoming = [];

       while(countUpcoming < 3 && countObjects < this.state.events.events.length) {
         var d = new Date(this.state.events.events[countObjects].start);
         if (d.getTime() > dateNow.getTime()) {
           upcoming.push(this.state.events.events[countObjects]);

           ++countUpcoming;
         }
         ++countObjects;
       }
       this.setState({
         upcomingEvents: upcoming,
         isEventsFixing: false,
         currentDate: dateNow
       });
     }

     onRefresh() {
       this.setState({
         isEventsFixing: true
       }, function() {
         this.decideValues()
       });
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
      if (this.state.isEventsLoading || this.state.isEventsFixing) {
        return (
          <View style={{flex: 1, paddingTop: 20}}>
            <ActivityIndicator />
          </View>
        );
      }

      if(!(this.state.isEventsLoading) && !(this.state.isEventsFixing)) {
        return (
          <View style= {{flex: 1}}>
            <Image
              source={require('AppNr1/img/start/Omslag_MTD2018.png')}
              style={{flex: 0.5, alignSelf: 'center', width:'100%', height: '10%'}}
              resizeMode="cover"
            />
            <View style={startStyles.startEntireView}>
              <SectionList
                stickySectionHeadersEnabled={true}
                onRefresh={() => this.onRefresh()}
                refreshing={this.state.isEventsFixing}
                style={{alignSelf: 'stretch'}}
                renderItem={({item}) => <StartRow itemStart={item} date={this.state.currentDate}/>}
                renderSectionHeader={({section}) => <SectionStartHeader title={section.title} /> }
                ItemSeparatorComponent={this.renderSeparator}
                sections={[ // homogeneous rendering between sections
                  {data: this.state.upcomingEvents, title: 'Kommande'}
                ]}
                keyExtractor={item => item.title}
              />
            </View>
          </View>

        );
      }


    }
}

class SectionStartHeader extends Component {
  render () {

    return (
      <View style={startStyles.startHeader}>
        <ImageBackground
            style={{
              flex: 1,
            }}
            source={require('AppNr1/img/sectionB2.png')}
        >
          <Text style={{fontFamily: 'OpenSans-Bold', color: 'white', margin: '1%'}}> {this.props.title} </Text>
        </ImageBackground>
      </View>
    );
  }
}

class StartRow extends Component {
  constructor(props) {
      super(props);

    }

  componentWillMount() {
    this.calculateTime();
  }

  calculateTime() {

    var dateItem = new Date(this.props.itemStart.start)
    var seconds = Math.floor((dateItem - (this.props.date))/1000);
    var minutes = Math.floor(seconds/60);
    var hours = Math.floor(minutes/60);
    var days = Math.floor(hours/24);

    hours = hours-(days*24);
    minutes = minutes-(days*24*60)-(hours*60);

    var tUp = {days: days, hours: hours, minutes: minutes};
    this.setState({
      timeTo: tUp
    });

  }

  renderTime() {
    var d;
    var h;
    var m;

    if(this.state.timeTo.days < 10) {
      d = '0'+this.state.timeTo.days.toString();
    }
    else {
      d = this.state.timeTo.days.toString()
    }

    if(this.state.timeTo.hours < 10) {
      h = '0'+this.state.timeTo.hours.toString();
    }
    else {
      h = this.state.timeTo.hours.toString()
    }

    if(this.state.timeTo.minutes < 10) {
      m = '0'+this.state.timeTo.minutes.toString();
    }
    else {
      m = this.state.timeTo.minutes.toString()
    }

    if (this.state.timeTo.days == 0 && this.state.timeTo.hours == 0 && this.state.timeTo.minutes <= 15) {
      return (
        <View style={{alignSelf: 'center', paddingRight: '1%'}}>
          <Text style={startStyles.startTextTime}>
            {d}:{h}:{m}
          </Text>

        </View>

      );
    }

    else {
      return (
        <View style={{alignSelf: 'center', paddingRight: '1%'}}>
          <Text style={startStyles.startText}>
            {d}:{h}:{m}
          </Text>

        </View>

      );
    }

  }

  render() {



    return (
      <View style={{flexDirection: 'row'}}>
        <View style={startStyles.startView}>
          <Image source={{ uri: this.props.itemStart.image}} style={startStyles.startImage} />
          <View style={startStyles.startInfo}>
            <Text style={startStyles.startHeadline}>
              {this.props.itemStart.title}
            </Text>
            <Text style={startStyles.startText}>
              {this.props.itemStart.host}
            </Text>
            <Text style={startStyles.startText}>
              Tid: {this.props.itemStart.time}
            </Text>
            <Text style={startStyles.startText}>
              Plats: {this.props.itemStart.place}
            </Text>
          </View>
        </View>
        {this.renderTime()}
      </View>
    );
  }
}
