import React from 'react';

import type {Node} from 'react';
import { StyleSheet, Text, View,Image, Button,StatusBar,useColorScheme } from 'react-native';


  const ActionBarImage = () => {
  return (
    <View style={{flexDirection: 'row'}}>
      <Image
        source={{
          uri:
            'https://raw.githubusercontent.com/AboutReact/sampleresource/master/logosmalltransparen.png',
        }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 40 / 2,
          marginRight: 15,
        }}
      />
    </View>
  );
};

const StakeholderView: () => Node = ({navigation}) => {
 isDarkMode = useColorScheme() === 'dark';
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <ActionBarImage />,
        });
    });
      return (
        
          <View style={styles.container}>
              <StatusBar backgroundColor="#364150" />
        <Text>Hello from home!</Text>

        <Button 
          title="Go To Home"
          onPress={
            () => navigation.navigate( 'Home' )
          }
        />

        <Button 
          title="Go To Feed"
          onPress={
            () => navigation.navigate( 'Login', {
              username: 'Bill'
            } )
          }
        />

      </View>
    );
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StakeholderView;