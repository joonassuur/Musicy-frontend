import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AsyncStorage } from 'react-native';
import Colors from '../constants/Colors';

let theme;

const getActiveTheme = async () => {
  const activeTheme = await AsyncStorage.getItem('theme')
  return activeTheme
}

getActiveTheme()

export default function TabBarIcon(props) {

  checkTheme = async () => theme = await getActiveTheme();
  checkTheme()

  return (
    <Ionicons
      name={props.name}
      size={26}
      style={{ marginBottom: -3 }}
      color={
        props.focused && theme === "dark" ? "#e60000" : props.focused && theme === "light" ? "#F2C94C" : "#fff"
      }
    />
  );
}
