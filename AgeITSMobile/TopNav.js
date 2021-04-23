import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Icon, MenuItem, OverflowMenu, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';


const MenuIcon = (props) => (
  <Icon {...props} name='more-vertical'/>
);

const InfoIcon = (props) => (
  <Icon {...props} name='info'/>
);

const LogoutIcon = (props) => (
  <Icon {...props} name='log-out'/>
);

const TopNavigationImageTitleShowcase = () => {

  const [menuVisible, setMenuVisible] = React.useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const renderMenuAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={toggleMenu}/>
  );

  const renderOverflowMenuAction = () => (
    <React.Fragment>
      <OverflowMenu 
        anchor={renderMenuAction}
        visible={menuVisible}
        onBackdropPress={toggleMenu}>
      </OverflowMenu>
    </React.Fragment>
  );

  const renderTitle = (props) => (
    <View style={styles.titleContainer}>
      <Avatar
        style={styles.logo}
        source={require('./images/VisioTT.png')}
      />
      <Text {...props}>VisioTT ITS</Text>
    </View>
  );

  return (
      <TopNavigation style={{
        backgroundColor: "#c6cfda",
    "color-basic-600": "#808080",}}
      title={renderTitle}
      accessoryRight={renderOverflowMenuAction}
    />
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
        alignItems: 'center'
  },
  logo: {
    marginHorizontal: 16,
  },
});

export default class TopNavigationSpecial extends React.Component {
    render() {
     return(
    
            <TopNavigationImageTitleShowcase />
     )
}   

}