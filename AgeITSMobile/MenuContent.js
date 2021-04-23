import React from 'react';
import { IndexPath, Menu, MenuItem } from '@ui-kitten/components';

const MenuSimpleUsageShowcase = () => {

  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
    
  return (
    <Menu style={{height:"20%"}}
      selectedIndex={selectedIndex}
      onSelect={index => setSelectedIndex(index)}>
      <MenuItem title='Numune Oluştur'/>
    </Menu>
  );
};

export default class MenuSpecial extends React.Component {
    render() {
     return(
    
            <MenuSimpleUsageShowcase />
     )
}   

}