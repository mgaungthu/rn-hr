import React, { useContext } from 'react';
import {Button, View, Text} from 'react-native';
import {ThemeContext} from './ThemeProvider';

export const ThemeToggle = () => {
  
  const {theme,toggleTheme} = useContext(ThemeContext);

  return (
    <View>
      <Text>Current: {theme}</Text>
      <Button title={"Toggle Theme"} onPress={toggleTheme}/>
    </View>
  );
};
