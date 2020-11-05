import React, { Component, PropTypes } from 'react';
import { StyleSheet } from 'react-native';

const schemaStyles = StyleSheet.create ({
  schemaEntireView: {
    flex:1,
    backgroundColor: 'white'
  },
  schemaView: {
    flex: 1,
    margin: 5,
    padding: 5,
    flexDirection: 'row',
    borderRadius: 2.5
  },
  schemaInfo: {
    alignSelf: 'flex-start',
    paddingLeft: 5,
    paddingRight: '25%'
  },
  schemaHeader: {
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderColor: 'grey',
  },
  schemaHeadline: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontFamily: 'OpenSans-Bold'
  },
  schemaText: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontFamily: 'OpenSans-Light'
  },
  schemaImage: {
    height: 50,
    width: 50,
    resizeMode: 'contain'
  },
});

module.exports = schemaStyles;
