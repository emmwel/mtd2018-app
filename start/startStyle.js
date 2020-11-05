import React, { Component, PropTypes } from 'react';
import { StyleSheet } from 'react-native';

const startStyles = StyleSheet.create ({
  headLine: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold'
  },
  startText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Light'
  },
  kontaktPerson : {
    fontSize: 14,
    fontFamily: 'OpenSans-Light'
  },
  startEntireView: {
    flex:1,
    backgroundColor: 'white'
  },
  startView: {
    flex: 1,
    margin: 5,
    padding: 5,
    flexDirection: 'row',
    borderRadius: 2.5
  },
  startInfo: {
    alignSelf: 'flex-start',
    paddingLeft: 5,
    paddingRight: "25%"
  },
  startHeader: {
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderColor: 'grey',
  },
  startHeadline: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontFamily: 'OpenSans-Bold'
  },
  startText: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontFamily: 'OpenSans-Light'
  },
  startTextTime: {
    alignSelf: 'flex-start',
    fontSize: 14,
    color: 'red',
    fontFamily: 'OpenSans-Light'
  },
  startImage: {
    height: '100%',
    width: '15%',
    padding: '1%',
    resizeMode: 'contain',
  },
});

module.exports = startStyles;
