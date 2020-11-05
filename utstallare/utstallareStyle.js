import React, { Component, PropTypes } from 'react';
import { StyleSheet } from 'react-native';

const utStyles = StyleSheet.create ({
  utstallareEntireView: {
    flex:1,
    backgroundColor: 'white'
  },
  utstallareView: {
    flex: 1,
    margin: 5,
    padding: 5,
    flexDirection: 'row',
    borderRadius: 2.5
  },
  utstallareInfo: {
    alignSelf: 'flex-start',
    paddingTop: 5,
    paddingLeft: 5,
  },
  utstallareHeader: {
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderColor: 'grey',
  },
  utstallareText: {
    alignSelf: 'flex-start',
    fontSize: 14,
  },
  utstallareHeadline: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontFamily: 'OpenSans-Bold'
  },
  utstallareImage: {
    height: 50,
    width: 50,
    resizeMode: 'contain'
  },
});

module.exports = utStyles;
