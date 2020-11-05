import React, { Component, PropTypes } from 'react';
import { StyleSheet } from 'react-native';

const omStyles = StyleSheet.create ({
  headLine: {
    fontWeight: 'bold',
    fontSize: 20,
    alignSelf: 'flex-start',
    paddingLeft: 0,
  },
  infoStyle: {
    fontSize: 16,
    fontFamily: 'OpenSans-Light'
  },
  kontaktPerson : {
    fontSize: 14,
    fontFamily: 'OpenSans-Light'
  },
  viewAll: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewKontakt: {
    flex: 0.20,
    flexDirection: 'row',

    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewKontaktInfo: {
    alignSelf: 'flex-start',
    paddingTop: 5,
    paddingLeft: 5,
  },
  omEntireView: {
    flex:1,
    backgroundColor: 'white'
  },
  omView: {
    flex: 1,
    margin: 5,
    padding: 5,
    flexDirection: 'row',
    borderRadius: 2.5
  },
  omInfo: {
    alignSelf: 'flex-start',
    paddingLeft: "1%",
    paddingRight: "1%"
  },
  omHeader: {
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderColor: 'grey'
  },
  omHeadline: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontFamily: 'OpenSans-Bold'
  },
  omText: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontFamily: 'OpenSans-Light'
  },
  omImage: {
    height: 50,
    width: 50,
    resizeMode: 'contain'
  },
});

module.exports = omStyles;
