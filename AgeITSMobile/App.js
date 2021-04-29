/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component, createRef} from 'react';
import { Text,
  ScrollView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Vibration,
  Dimensions,
  Image,
  ImageBackground,
  StatusBar,
  YellowBox,
  Alert,
  Linking,
  TouchableWithoutFeedback,
  SafeAreaView,

} from 'react-native';

import { RNCamera } from 'react-native-camera';
import DeviceInfo from 'react-native-device-info';
import Moment from 'moment';
import Viewfinder from './Viewfinder';
import AsyncStorage from '@react-native-community/async-storage'
import GeoLocation from '@react-native-community/geolocation'
import SplashScreen from 'react-native-splash-screen'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import EStyleSheet from 'react-native-extended-stylesheet';
import NetInfo from "@react-native-community/netinfo";
import * as eva from '@eva-design/eva';
import {
  ApplicationProvider, Layout, Text as TextUI, Input as InputUI, Button as ButtonUI, Spinner, Icon as IconUI,
  IconRegistry, Card, IndexPath, Menu, MenuItem, Autocomplete, AutocompleteItem, List, ListItem, ButtonGroup,
  Avatar,   OverflowMenu,  TopNavigation, TopNavigationAction,  StyleService, useStyleSheet , Select, SelectItem
} from '@ui-kitten/components';
import Config from './app.json';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
let entireScreenWidth = Dimensions.get('window').width;
let entireScreenHeight = Dimensions.get('window').height;
let HWPercentage = entireScreenWidth / entireScreenHeight;

EStyleSheet.build({$rem: entireScreenHeight / 720 });
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
const LoadingIndicator = (props) => (
  <View style={[props.style, styles.indicator]}>
    <Spinner size='small'/>
  </View>
);
scannedCode = "";
popupOpened = false;
action = "";
const UseStyleSheetSimpleUsageShowcase = () => {
  const styles = useStyleSheet(themedStyles(action));
  return (
    popupOpened && (<View style={styles.container}>
      <TextUI category="h6" status='control'>
        {action == "add" ? "Kod harekete eklendi." : action == "remove" ? "Kod hareketten çıkartıldı." : action == "exist" ?"Harekette olan bir kod okutuldu!" : "Harekette olmayan bir kod okutuldu!"}
      </TextUI>
    </View>)
  );
};

const themedStyles = (actionVal) => StyleService.create({
  container: {
    top: "5%",
    position: "absolute",
    height: "10%",
    width: "80%",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: actionVal == "add" || actionVal == "remove" ? 'color-success-default' : 'color-danger-default',
    borderWidth:1,
                    borderStyle: 'solid',
                    borderColor:'white',
                    borderLeftColor:'#3366FF',borderRadius:6,
  },
  text: {
    fontWeight:"400"
  }
});

const SearchIndicator = (props) => (
 <View style={[props.style, styles.indicator]}><IconUI {...props} name= 'search-outline'
        /></View>
);

 const renderOption = (item, index) => (
    <MenuItem key={item.id}
      title={item?.stakeholderGLN}/>
);
const renderOptionSelectType = (item) => (
    <SelectItem key={item.id} title={item.constLangDesc}/>
    
);

 const renderItemProduct = ({ item, index }) => (
    <ListItem title={item.value}/>
);
  
const MenuIcon = (props) => (
  <IconUI {...props} name='more-vertical'/>
);

const InfoIcon = (props) => (
  <IconUI {...props} name='info'/>
);

const LogoutIcon = (props) => (
  <IconUI {...props} name='log-out'/>
);
/*
const TopNavigationImageTitleShowcase = () => {

  const [menuVisible, setMenuVisible] = React.useState(false);
   const [token, setToken] = React.useState("12");
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const changeToken = () => {
    setToken("");
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
        <MenuItem accessoryLeft={InfoIcon} title='About'/>
        <MenuItem accessoryLeft={LogoutIcon} title='Logout' onPress={changeToken}/>
      </OverflowMenu>
    </React.Fragment>
  );

  const renderTitle = (props) => (
    <View style={styles.titleContainer}>
      <Avatar
        style={styles.logo}
        source={require('./images/VisioTT.png')}
      />
      <TextUI {...props}>VisioTT ITS</TextUI>
    </View>
  );
const renderBackAction = () => (
  <TopNavigationAction icon={BackIcon} />
  );

  const BackIcon = (props) => (
  <IconUI {...props} name='arrow-back'/>
);

  return (
      <TopNavigation style={{
        backgroundColor: "#c6cfda",
    "color-basic-600": "#808080",}}
      title={renderTitle}
      accessoryLeft={renderBackAction}
      accessoryRight={renderOverflowMenuAction}
    />
  );
};
*/
export default class App extends React.Component {
  
  iconStartAnimate = createRef();
  buttonSearch = createRef();
  constructor(props) {
    super(props);
    this.camera = null;

    //logOutSession
    this.state = {
      mobileAppID : "00001",
      type: '',
      data: null,
      infiniteAnimationIconRef : null,
      qrvalue: '',
      opneScanner: false,
      error: null,
      IsLoading: true,
      method :0,// 0 GetLocation,
                // 1 onWait (WEB API)
                // 2 Pdf
      latitude: null,
      longtude: null,
      sayi: 0,
      deviceId: '',
      camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: "off",
        barcodeFinderVisible: false
      },
      pdf: null,
      isConnected: true,
      stakeholderGLN: "",
      tmpStakeholderGLN: "",
      buttonLoading: false,
      apiGateway : Config.ApiGateway,
      stakeholderData: { key: "", value: "" },
      serverURL: "",
      strUsername: "",
      strPassword: "",
      secureTextEntry: true,
      secureTextEntryIdentity: true,
      token: "",
      userID : 0,
      selectedIndex: new IndexPath(-1),
      selectedIndexCombo: new IndexPath(-1),
      selectedIndexDoctor: new IndexPath(-1),
      stakeholderTypeIndex: undefined,
      selectedValueDoctor: "",
      selectedDataDoctor: null,
      stakeholdersAPI : [
      ],
      stakeholders: [],
      barcodes: [],
      buttonGroupIndex: 0,
      blnAdd: true,
      intTryCount: 0,
      focusedCombo: false,
      searching: false,
      popoverVisible: true,
      menuVisible: false,
      stakeholderTypes: [],
      stakeholderTypeSelected: {},
      errorCount: 0,
      blnPassDisabled: false,
      blnUserNameDisabled: false,
      blnCompGLNDisabled:false
      
    };
    console.disableYellowBox = true;
    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
      'Module RCTImageLoader requires',
    ]);
  }

  toggleSecureEntry = () => {
    this.setState({secureTextEntry : !this.state.secureTextEntry })
  };
  
  searchStakeholder = () => {       
    this.setState({ searching: true });
    this.buttonSearch.current.blur();
    this.getStakeholders(this.state.selectedValueDoctor);
  };
  
renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={this.toggleSecureEntry}>
      <IconUI {...props} name={this.state.secureTextEntry ? 'eye-off' : 'eye'}/>
    </TouchableWithoutFeedback>
  );
  /*
  renderIconComboxx = (props) => {    
    return (<TouchableWithoutFeedback onPress={this.toggleComboIcon}>
      <IconUI {...props} name={this.state.secureTextEntryIdentity ? 'search-outline' : 'loader-outline'}
        animationConfig={{ cycles: Infinity }} animation='zoom' ref={this.iconStartAnimate} />
    </TouchableWithoutFeedback>);

  }*/


  logOutSession = () => {
    this.setState({ mobileAppID : "00001",
      type: '',
      data: null,
      infiniteAnimationIconRef : null,
      qrvalue: '',
      opneScanner: false,
      error: null,
      IsLoading: true,
      method :0,// 0 GetLocation,
                // 1 onWait (WEB API)
                // 2 Pdf
      latitude: null,
      longtude: null,
      sayi: 0,
      deviceId: '',
      camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: "off",
        barcodeFinderVisible: false
      },
      pdf: null,
      isConnected: true,
      stakeholderGLN: "",
      tmpStakeholderGLN: "",
      buttonLoading: false,
      apiGateway : Config.ApiGateway,
      stakeholderData: { key: "", value: "" },
      serverURL: "",
      strUsername: "",
      strPassword: "",
      secureTextEntry: true,
      secureTextEntryIdentity: true,
      token: "",
      userID : 0,
      selectedIndex: new IndexPath(-1),
      selectedIndexCombo: new IndexPath(-1),
      selectedIndexDoctor: new IndexPath(-1),
      stakeholderTypeIndex: undefined,
      selectedValueDoctor: "",
      selectedDataDoctor: null,
      stakeholdersAPI : [
      ],
      stakeholders: [],
      barcodes: [],
      buttonGroupIndex: 0,
      blnAdd: true,
      intTryCount: 0,
      focusedCombo: false,
      searching: false,
      popoverVisible: true,
      menuVisible: false,
      stakeholderTypes: [], stakeholderTypeSelected: {}
    });
  };
  TopNavigationImageTitleShowcase = () => {

  const toggleMenu = () => {
    this.setState({ menuVisible: !this.state.menuVisible });
  };
  

  const renderMenuAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={toggleMenu}/>
  );

  const renderOverflowMenuAction = () => (
    <React.Fragment>
      <OverflowMenu
        anchor={renderMenuAction}
        visible={this.state.menuVisible}
        onBackdropPress={toggleMenu}>
        <MenuItem accessoryLeft={InfoIcon} title='About'/>
        <MenuItem accessoryLeft={LogoutIcon} title='Logout' onPress={this.logOutSession}/>
      </OverflowMenu>
    </React.Fragment>
    );
    const renderOverflowMenuActionBack = () => (
    <React.Fragment>
      <OverflowMenu
        anchor={renderMenuActionBack}
        visible={false}>
      </OverflowMenu>
    </React.Fragment>
  );

  const renderTitle = (props) => (
    <View style={styles.titleContainer}>
      <Avatar
        style={styles.logo}
        source={require('./images/VisioTT.png')}
      />
      <TextUI {...props}>VisioTT ITS</TextUI>
    </View>
    );
    const onPressBack = () => {
      this.handleBackButtonClick();
  };
const renderMenuActionBack = () => (
  <TopNavigationAction icon={BackIcon} onPress={onPressBack}/>
  );

  const BackIcon = (props) => (
  <IconUI {...props} name='arrow-back'/>
);

  return (
      <TopNavigation style={{
        backgroundColor: "#c6cfda",
    "color-basic-600": "#808080",}}
      title={renderTitle}
      accessoryLeft={renderOverflowMenuActionBack}
      accessoryRight={renderOverflowMenuAction}
    />
  );
};

 renderIconCombo = (props) => {
    
       return (
      <ButtonUI onPress={!this.state.searching ? this.searchStakeholder : ""} style={{ maxWidth: "10%",maxHeight: "10%" }} appearance='outline' accessoryLeft={this.state.searching ? LoadingIndicator : SearchIndicator}>
      
    </ButtonUI>
   );
    
  }

  setSelectedIndex = (index) => {
    
    this.setState({ stakeholderTypeIndex: index });
    this.setState({ stakeholderTypeSelected: this.state.stakeholderTypes[index.row] });
    
  }
      
  ClearSearchData = () => {
    this.setState({selectedValueDoctor : "" })
};
  
renderIconDelete = (props) => (
  <TouchableWithoutFeedback onPress={this.ClearSearchData}>
      <IconUI {...props} name="close-outline"/>
    </TouchableWithoutFeedback>
);
  
AlertIcon = (props) => (
  <IconUI {...props} name='alert-circle-outline'/>
);

  componentDidMount() { 
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    if(this.state.method == 0){
      //this.onWait2();
      var id = Platform.OS === 'ios' ? DeviceInfo.getUniqueIdSync() : DeviceInfo.getUniqueID();
      this.setState({ deviceId: id != null ? id : '', });
      //this.onGetLocation();
    }
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }
  handleBackButtonClick = () => {
    var blnExit = false;
    if (this.state.buttonGroupIndex > 0)
      this.setState({ buttonGroupIndex: 0 });
    else if (this.state.buttonGroupIndex == 0 && this.state.selectedIndex.row > -1)
      this.setState({ selectedIndex: new IndexPath(-1),   selectedIndexCombo: new IndexPath(-1),
      selectedIndexDoctor: new IndexPath(-1),
      stakeholderTypeIndex: undefined, stakeholderTypeSelected : {},selectedValueDoctor: "" });
    else if (this.state.selectedIndex.row == -1 && this.state.token != "")
      this.logOutSession();
    else
      blnExit = true;
    
        return !blnExit;
  };
  handleConnectivityChange = isConnected => {
      this.setState({ isConnected });
  };

  async _storeData(serverData) {
   try {
        await AsyncStorage.setItem(
          '@ServerURL:key',
          serverData.value
     ).then((aa) => {
       this.retrieveData(true);
     })
     await AsyncStorage.setItem(
          '@StakeholderGLN:key',
          serverData.key
     ).then((aa) => {
       this.retrieveData(true);
   })
      } catch (error) {
       
      }
};

  async retrieveData(control){

    try {
      if (this.state.serverURL == "") {
      var serverURLC = await AsyncStorage.getItem('@ServerURL:key');
        if (serverURLC !== null) {
          this.setState({
            serverURL: serverURLC
          });
          if (this.state.intTryCount == 0) {
            this.userLogin(true);
            this.setState({
            intTryCount: 1
          });
          }        
        }
      }
    
       if (this.state.stakeholderGLN == "") {
        var stakeholderGLNC = await AsyncStorage.getItem('@StakeholderGLN:key');
        if (stakeholderGLNC !== null) {
          this.setState({
            stakeholderGLN: stakeholderGLNC
          });         
          }        
        }
    }  
   catch (error) {
   
    }
    if ((this.state.serverURL != "" && this.state.stakeholderGLN != "") || !control) {
       this.setState({
       IsLoading: false,
       buttonLoading: false
      });
    }
    
  };
 
  async checkGLN() {
    const url = this.state.apiGateway+'/api/Stakeholder/CheckStakeholder?strGLN='+this.state.tmpStakeholderGLN;
  
    this.setState({
      buttonLoading: true,
      blnCompGLNDisabled:true
   });
  function timeout(ms, promise) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(new Error("timeout"))
      }, ms)
      promise.then(resolve, reject)
    })
  }
 let oData =  await
 timeout(Config.intTimeout,fetch(url, {
 method: 'GET',
 headers: {
   Accept: 'application/json',
   'Content-Type': 'application/json',
   keepalive:false,
 },
}))
 .then((response) => response.json())
 .then((responseJson) => {
   
   this.setState({
     stakeholderData: responseJson,
     IsLoading: false
   }, function(){
     
   });
   if (responseJson != null && responseJson.value != "") {
     this._storeData(responseJson);
    
   } else {
     this.setState({
     buttonLoading: false,
     IsLoading: false,
      blnCompGLNDisabled:false
   });
   }
   

 })
 .catch((error) =>{
   this.setState({
     error: "checkGLN beklenmeyen hata :" + JSON.stringify(error),
     IsLoading: false,buttonLoading: false,
      blnCompGLNDisabled:false
   });
 });
  }
  
  async userLogin(forFirstQuery) {
    const url = this.state.serverURL.endsWith("/") ? this.state.serverURL +'token' : this.state.serverURL +'/token';
    if(!forFirstQuery)
          this.setState({
            buttonLoading: true,
            blnUserNameDisabled: true,
            blnPassDisabled: true
          });
    else
    {
       this.setState({
          errorCount: 0,
          });
      }
  function timeout(ms, promise) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(new Error("timeout"))
      }, ms)
      promise.then(resolve, reject)
    })
  }
 let oData =  await
 timeout(Config.intTimeout,fetch(url, {
 method: 'POST',
 headers: {
   Accept: 'application/json',
   'Content-Type': 'application/json',
   keepalive:false,
   },
  body:"grant_type=password&username="+this.state.strUsername+"&password="+this.state.strPassword+"&language=tr-TR",
}))
 .then((response) => response.json())
     .then((responseJson) => {
       if (!forFirstQuery) {
                  console.log("aa");
              if (responseJson.error != null) {
                  this.setState({error: responseJson.error_description
              }, function(){
                
              });
              }
              else {
                  this.setState({
                    token: responseJson.access_token,
                    userID: responseJson.UserId
              }, function(){
                
                  });
                console.log(this.state.token);
                //if(this.state.token != "")
                  //this.onChangeText("", true);
              }
              this.setState({
                IsLoading: false,
                buttonLoading: false,
                blnUserNameDisabled: false,
                blnPassDisabled: false
              });
   }
 

 })
     .catch((error) => {
       if (!forFirstQuery) {         
          console.log("aa22");
   this.setState({
     error: "userLogin beklenmeyen hata :" + JSON.stringify(error),
     IsLoading: false,buttonLoading: false,
            blnUserNameDisabled: false,
            blnPassDisabled: false
   });
       }
  
 });
}
  async getStakeholders(strGLN) {
    var url = this.state.serverURL.endsWith("/") ? this.state.serverURL : this.state.serverURL + '/';
    var stakeholderType = this.state.stakeholderTypes[this.state.stakeholderTypeIndex?.row]?.const?.constValue;
    if (stakeholderType != null && stakeholderType != "" && stakeholderType != undefined)
    {
      url += "api/StakeholderAut/SearchStakeholderByIntegrationParam?strGLN=" + strGLN + "&strParamValueAsString=" + stakeholderType;
      this.setState({
        buttonLoading: true,
      });

         
        function timeout(ms, promise) {
          return new Promise(function(resolve, reject) {
            setTimeout(function() {
              reject(new Error("timeout"))
            }, ms)
            promise.then(resolve, reject)
          })
        }
        
      let oData =  await
      timeout(Config.intTimeout,fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization" : "Bearer "+ this.state.token,
        keepalive:false,
        }
      }))
      .then((response) => response.json())
      .then((responseJson) => {
          
        if (responseJson.error != null) {
            this.setState({error: responseJson.error_description
        }, function(){
          
        });
        }
        else {
            this.setState({
              stakeholdersAPI: responseJson,
              stakeholders : responseJson
            });
          if (this.state.searching && this.state.stakeholders.length > 0)
              this.setState({              
              focusedCombo : true
            });
          console.log(this.state.stakeholdersAPI);
          console.log("STRGLN : " + strGLN);
          this.onChangeText(strGLN, false);
        }
        this.setState({
          IsLoading: false,
          buttonLoading: false,
          searching: false
        });

      })
      .catch((error) =>{
        this.setState({
          error: "getStakeholders beklenmeyen hata :" + JSON.stringify(error),
          IsLoading: false,buttonLoading: false,
          searching: false
        });
      });
    }
    else {
      this.setState({
        error: "Tip değeri boş olamaz!! Lütfen bir tip seçiniz..",
        searching: false
        });
    }

  }
  
   async getStakeholderType() {
    var url = this.state.serverURL.endsWith("/") ? this.state.serverURL : this.state.serverURL + '/';
    url += "api/Const/GetConsts?strConstID=StakeholderType&strFilter="
    this.setState({
     IsLoading: true,
   });
  function timeout(ms, promise) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(new Error("timeout"))
      }, ms)
      promise.then(resolve, reject)
    })
  }
 let oData =  await
 timeout(Config.intTimeout,fetch(url, {
 method: 'GET',
 headers: {
   Accept: 'application/json',
   'Content-Type': 'application/json',
   "Authorization" : "Bearer "+ this.state.token,
   keepalive:false,
   }
}))
 .then((response) => response.json())
 .then((responseJson) => {    

   this.setState({
     stakeholderTypes: responseJson,
     IsLoading: false,
     buttonLoadingSType: false,
     searching: false
   });

 })
 .catch((error) =>{
   this.setState({
     error: "getStakeholderType beklenmeyen hata :" + JSON.stringify(error),
     IsLoading: false,buttonLoading: false,
     searching: false
   });
 });
}

  async saveTransaction() {
    var url = this.state.serverURL.endsWith("/") ? this.state.serverURL : this.state.serverURL + '/';
    url += "api/Transaction/SaveSampleTransaction";
    this.setState({
     IsLoading: true,
   });
  function timeout(ms, promise) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(new Error("timeout"))
      }, ms)
      promise.then(resolve, reject)
    })
  }
    var strError = "";
    if (this.state.barcodes.length == 0)
      strError = "Lütfen ürün okutunuz!!";
    else if ((this.state.selectedValueDoctor == null || this.state.selectedValueDoctor == "") || this.state.stakeholders.length < 1 )
      strError = "Lütfen numune verilecek kişiyi seçiniz!!";
    
    if (strError == "") {
          var request = {
          "transactionID": 0,
          "fromGLN": this.state.stakeholderGLN,
          "userID": this.state.userID,
          "shipToGLN": this.state.selectedValueDoctor,
          "lstBarcode": this.state.barcodes
      };
      
    let oData =  await
    timeout(Config.intTimeout,fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      "Authorization" : "Bearer "+ this.state.token,
      keepalive:false,
      },
    body: JSON.stringify(request)
    }))
    .then((response) => response.json())
    .then((responseJson) => {
        
      if (!responseJson.isValid) {
          this.setState({error:" " + JSON.stringify(responseJson.errors)
      });
      }
      else {
          this.setState({
            buttonGroupIndex : 0,
            selectedIndex: new IndexPath(-1),
            selectedValueDoctor: "",
            stakeholders: [],
            stakeholdersAPI: [],
            barcodes: [],
            selectedIndexCombo: new IndexPath(-1),
            selectedIndexDoctor: new IndexPath(-1),
            stakeholderTypeIndex: undefined,
            stakeholderTypes: [],
            stakeholderTypeSelected: {}
      }); 
      Alert.alert(
        'Bilgi',
        'Hareket başarılı bir şekilde oluşturuldu.',
        [
         {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );
        
      }    
        this.setState({
        IsLoading: false,
        buttonLoading: false
      });
    })
    .catch((error) =>{
      this.setState({
        //error: "saveTransaction beklenmeyen hata :" + JSON.stringify(error)        
      });
      this.setState({
        IsLoading: false,
        buttonLoading: false
      });
    });
    }
    else {
        this.setState({
        error: strError
        });
      this.setState({
        IsLoading: false,
        buttonLoading: false
      });
    }
    
}

   async onGetLocation() {
    await GeoLocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => this.setState({
        //error: error.message,
         }),
      { enableHighAccuracy: false, timeout: 3000 },
    );

    if(this.state.latitude != null || this.state.error != null){
      this.setState({ });
    }
  }

LoginHeader = () => {
    return (
        <View style={styles.topContainer}>
            <ImageBackground
                style={styles.visioTTlogo}
                source={require('./images/visiottlogo.png')}
                resizeMode = 'contain'
            />
        </View>
  )
}

  StakeholderControlContent = () => {
  
    var ControlNext = () => {
      return(
      <ButtonUI style={{marginTop:"5%"}} appearance='outline' onPress={() => this.checkGLN()}>
          İleri
        </ButtonUI>
      )
    }
    if (this.state.buttonLoading) {
      ControlNext = () => {
        return(
        <ButtonUI style={{ marginTop: "5%" }} appearance='outline' accessoryLeft={LoadingIndicator}>
            Yükleniyor
          </ButtonUI >
        )
    }
    }
          
    return (
        <View style={styles.middleContainer}>
        <Layout level="1" style={{ flex: 1, justifyContent: 'flex-start', marginTop: "20%", alignItems: 'center', backgroundColor: "white", width: "80%", height: "50%" }}>
           <View style={styles.alternativeContainer}>
            <TextUI style={styles.text} status='control' appearance='alternative'>GLN Eşleştirme Ekranı</TextUI>
          </View>
          

          <InputUI style={{ width: "80%",marginTop:"10%" }}
            label="Kurum GLN"
            disabled={this.state.blnCompGLNDisabled}
            placeholder='GLN bilgisini giriniz..'
            value={this.state.tmpStakeholderGLN}
            onChangeText={nextValue => this.setState({ tmpStakeholderGLN: nextValue })}
          />
          <ControlNext/>
          
          
          </Layout>
        </View>
    )
  }
  

  UserControlContent = () => {
    var ControlNext = () => {
      return(
      <ButtonUI style={{marginTop:"5%"}} appearance='outline' onPress={() => this.userLogin(false)}>
          Giriş
        </ButtonUI>
      )
    }
    if (this.state.buttonLoading) {
      ControlNext = () => {
        return(
        <ButtonUI style={{ marginTop: "5%" }} appearance='outline' accessoryLeft={LoadingIndicator}>
            Yükleniyor
          </ButtonUI >
        )
    }
    }
          
    return (
        <View style={styles.middleContainer}>
         <Layout level="1" style={{flex: 1, justifyContent: 'flex-start', marginTop: "20%" ,alignItems: 'center', backgroundColor: "white", width: "80%", height:"50%"}}>
         <View style={styles.alternativeContainer}>
            <TextUI style={styles.text} status='control' appearance='alternative'>Oturum Aç</TextUI>
          </View>
          <InputUI style={{ width: "80%", marginTop: "10%" }}
            label="Kullanıcı Adı"
            disabled={this.state.blnUserNameDisabled}
            placeholder='Kullanıcı adınızı giriniz'
            value={this.state.strUsername}
            onChangeText={nextValue => this.setState({ strUsername: nextValue })}
          />
          <InputUI style={{ width: "80%",marginTop:"5%" }}
            value={this.state.strPassword}
            label='Şifre'
            disabled={this.state.blnPassDisabled}
            placeholder='Şifrenizi giriniz'
            //caption='Should contain at least 8 symbols'
            accessoryRight={this.renderIcon}
            //captionIcon={this.AlertIcon}
            secureTextEntry={this.state.secureTextEntry}
            onChangeText={nextValue => this.setState({ strPassword: nextValue })}
          />
          <ControlNext/>
          
          
          </Layout>
        </View>
    )
  }
 
  onChangeText(query, blnGetData) {
    this.setState({ selectedValueDoctor: query });
    if(blnGetData)
      this.getStakeholders(query);
    if(query == null || query === "")
      this.setState({ stakeholders: this.state.stakeholdersAPI});
    else
      this.setState({ stakeholders: this.state.stakeholdersAPI.filter(item => item.stakeholderGLN != null && item.stakeholderGLN.toLowerCase().includes(query.toLowerCase())) });
    
    if(this.state.stakeholders.length < 1) this.setState({ focusedCombo: false })
  };

  onSelect(index) {
    this.setState({ selectedValueDoctor: this.state.stakeholders[index].stakeholderGLN });
  };

  TransactionHeader = () => {
          /*<Autocomplete style={{ width: "80%", marginTop: "2%" }}
            label={evaProps => <TextUI {...evaProps}></TextUI>}
            value={this.state.selectedValueDoctor}
            onSelect={index => this.onSelect(index)}
            onChangeText={query => this.onChangeText(query, true)}
            onItemPress={item => this.onSelect(item)}
            accessoryRight={this.renderIconDelete}>
              {this.state.stakeholders.map(renderOption)}
          </Autocomplete>*/
    return (
        <View style={styles.middleContainerHeader}>
         <Layout level="1" style={{flex: 1, justifyContent: 'flex-start', marginTop: "5%" ,alignItems: 'center', backgroundColor: "white", width: "80%", height:"80%"}}>
         <View style={styles.alternativeContainer}>
            <TextUI style={styles.text} status='control' appearance='alternative'>Hareket Bilgisi</TextUI>
          </View>
          <Select style={{ width: "100%", marginTop: "3%" }}
            label='Tip'
            value={this.state.stakeholderTypeSelected.constLangDesc}
              placeholder='Tip seçiniz..'
              selectedIndex={this.state.stakeholderTypeIndex}
              onSelect={index => this.setSelectedIndex(index)}>
               {this.state.stakeholderTypes.map(renderOptionSelectType)}
            </Select>
          <InputUI style={{ width: "100%", marginTop: "3%" }}
            value={this.state.selectedValueDoctor}
            label='Numune Verilecek Kişi'
            placeholder='Kimlik numarası giriniz..'
            //caption='En az 3 karakter girerek arama yapınız.'
            accessoryRight={this.renderIconCombo}
            //captionIcon={this.AlertIcon}
            //secureTextEntry={this.state.secureTextEntryIdentity}
            onChangeText={nextValue => { /*this.onChangeText(nextValue, false)*/ this.setState({ selectedValueDoctor: nextValue }) }}
            ref={this.buttonSearch}
            onFocus={value => { this.setState({ focusedCombo: true }) }}
            onBlur={value => { if(this.state.stakeholders.length < 1) this.setState({ focusedCombo: false })}}
          />
          
          
          </Layout>
        </View>
    )
  }
  
  TransactionProduct = () => {
    var data = [{ title: "aasdas" },{ title: "aasdas" },{ title: "aasdas" },{ title: "aasdas" },{ title: "aasdas" },{ title: "aasdas" },{ title: "aasdas" },{ title: "aasdas" },{ title: "aasdas" },{ title: "aasdas" },{ title: "aasdas" },{ title: "aasdas" },{ title: "aasdas" },{ title: "aasdas" }];
    return (
        <Layout style={styles.middleContainerProduct}>
         <Layout level="1" style={{flex: 1, justifyContent: 'flex-start', marginTop: "5%" ,alignItems: 'center', backgroundColor: "white", width: "80%", height:"50%"}}>
         <View style={styles.alternativeContainer}>
            <TextUI style={styles.text} status='control' appearance='alternative'>Hareket Kod Detayı</TextUI>
          </View>
          <List
            style={{ width: "100%",height: "100%",}}
            data={this.state.barcodes}
            renderItem={renderItemProduct}
          />
         
          </Layout>
        </Layout>
    )
  }
  
  CodeRead = () => {
    return (
      <UseStyleSheetSimpleUsageShowcase/>
 );
  
    
}

  TransactionButtons = () => {
   
    return (
        <Layout style={{flex:50,flexDirection: 'column',
        flexWrap: 'nowrap', justifyContent: "center", alignContent: "center", alignItems: "center", marginTop: "1%"
      }}>
        {this.state.buttonGroupIndex == 1 && (<ButtonUI onPress={() => {
          action = this.state.blnAdd ? "add" :"remove"; this.setState({ blnAdd: !this.state.blnAdd })
        }} style={{flex:5,maxWidth:"30%",maxHeight:"30%", marginTop:"2%"}} status={ this.state.blnAdd ? 'success' : 'danger' }>
          { this.state.blnAdd ? 'Ekle' : 'Sil' }
        </ButtonUI>)}
                <ButtonGroup style={{flex:45,width:"100%",alignItems:"center",justifyContent:"center"}} status='primary' >
                  <ButtonUI  style={{maxWidth:"33%",maxHeight: this.state.buttonGroupIndex == 1 ? "55%" : "35%"}} onPress={() => this.setState({buttonGroupIndex : 0})}>Kod Listesi</ButtonUI>
                  <ButtonUI  style={{maxWidth:"33%",maxHeight:this.state.buttonGroupIndex == 1 ? "55%" : "35%"}} onPress={() => this.setState({buttonGroupIndex : 1, blnAdd: true, camera: { flashMode: "off" },})}>Kod Okut</ButtonUI>
                  <ButtonUI  style={{maxWidth:"33%",maxHeight:this.state.buttonGroupIndex == 1 ? "55%" : "35%"}} onPress={() => this.saveTransaction()}>Sonlandır</ButtonUI>
                  </ButtonGroup>
          </Layout>
    )
}
  barcodeReceived(e) {
    var strBarcode = e.data;
    action = this.state.blnAdd ? "add" : "remove";
    var bytes = [];
  var strTempBarcode = '';
  
 for (var i = 0; i < strBarcode.length; ++i) {
   if (strBarcode.charCodeAt(i).toString() == '29' && i == 0)
     continue;
   else
    strTempBarcode += strBarcode[i];
 }
    strBarcode = strTempBarcode;
    var popup = true;
    var blnAction = this.state.blnAdd;
    var control = this.state.barcodes.filter(b => b.value == strBarcode);
    if (control.length == 0 && blnAction) {
      this.state.barcodes.push({ value: strBarcode });
      this.setState({ data: null });    
    }
    else if (control.length > 0 && !blnAction) {      
      this.setState({ barcodes: this.state.barcodes.filter(b => b.value != strBarcode) });   
    }
    else {
      if (control.length > 0 && blnAction)
        action = "exist"
      else
        action = "notExist"
    }
    scannedCode = strBarcode;
    Vibration.vibrate();
    popupOpened = true;
    this.setState({ qrvalue: strBarcode });
    if (popup) {
      
      setTimeout(
        function () {
          if (this.state.qrvalue == strBarcode) {
            scannedCode = "";
          popupOpened = false;
          this.setState({ IsLoading: false });
          
          }
          
        }
        .bind(this),
        1000
      );
    }
  
  }
  
  FlashPartOn = () => {
return (
    <View style={styles.FlashPart}>
       <TouchableOpacity
      onPress={() => this.setState({
        camera: {
          flashMode:this.state.camera.flashMode == "off" ? "torch" : "off",
        }
      })}
      style={styles.QrButtonSmall} activeOpacity={0.9}>
      <Image
              style={styles.QrButtonImageSmall}
              source={require('./images/flashon.png')}
               resizeMode = 'contain'
            />
      </TouchableOpacity>
    </View>
)
}

FlashPartOff = () => {
return (
    <View style={styles.FlashPart}>
       <TouchableOpacity
      onPress={() => this.setState({
        camera: {
          flashMode:this.state.camera.flashMode == "off" ? "torch" : "off",
        }
      })}
      style={styles.QrButtonSmall} activeOpacity={0.9}>
      <Image
              style={styles.QrButtonImageSmall}
              source={require('./images/flashoff.png')}
               resizeMode = 'contain'
            />
      </TouchableOpacity>
    </View>
)
}

  selectedItemChange(index) {
    if (index?.row == 0)
      this.getStakeholderType();
    
    this.setState({ selectedIndex: index });    
  }
  selectedItemChangeCombo(index) {
    
    this.setState({ selectedIndexCombo: index, focusedCombo:false, selectedValueDoctor: this.state.stakeholders[index.row].stakeholderGLN  });
       
  }
  

  selectedItemDoctorChange(index) {
    
    this.setState({ selectedIndexDoctor: index });
    
  }

  render() {
    
    SplashScreen.hide();
    if(!this.state.isConnected)
    {
      if (this.state.errorCount == 0) {
        this.setState({ errorCount: 1 });
      Alert.alert(
        'Uyarı!',
        'İnternet bağlantısını kontrol ediniz.',
        [
         {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );
      }
      
      this.logOutSession();
    }
    else if (this.state.isConnected && this.state.error != null){
      Alert.alert(
        'Uyarı!',
        JSON.stringify(this.state.error),
        [
         {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );
      this.setState({
        error:null
      });
    }
     
       
    if(this.state.IsLoading ){
      
      /*if (this.state.method == 1) {
        //this.onWait();
      }
      else if (this.state.method == 0)
      this.onGetLocation();
      */
      if(this.state.stakeholderGLN == "")
        this.retrieveData(false);
      return(
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#212c64"/>
      </View>
      );
    }
    else if (!this.state.opneScanner) {

      //if (this.state.error != null) {
          //alert(JSON.stringify(this.state.error));
     // }
      if ( this.state.token != null && this.state.token != "" && this.state.selectedIndex.row == 0) {
        if (this.state.buttonGroupIndex == 0) {
          
          return (<>
           <IconRegistry icons={EvaIconsPack} />
           <ApplicationProvider {...eva} theme={eva.light}>
                  {Platform.OS === 'ios' && (  <View style={{height:18,  backgroundColor: "#c6cfda",}}></View>)}
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                 {this.TopNavigationImageTitleShowcase()}
                  {this.TransactionHeader()}
                  {this.TransactionProduct()}
                  {this.TransactionButtons()}
                  {this.state.focusedCombo && (<View style={{flex:1,top:"31.2%",left:"8.9%",height:"55%",width: "82.3%",borderWidth:1,
                    borderStyle: 'solid',
                    borderColor:'#3366FF',
                      borderLeftColor: '#3366FF',
                      borderTopWidth:0,borderBottomWidth:0, borderRadius: 3,borderTopWidth:1,borderBottomWidth:1,
                          position: 'absolute',}}><Menu style={{marginTop:"0.5%", marginBottom:"0.5%"
                    }}
            selectedIndex={this.state.selectedIndexCombo}
            onSelect={index => this.selectedItemChangeCombo(index)}>
             {this.state.stakeholders.map(renderOption)}
          </Menu></View>) }
              </View>
                  
              </View>
              
           </ApplicationProvider>
            </>
           );
        }
        else if (this.state.buttonGroupIndex == 1) {
           return (<>
           <IconRegistry icons={EvaIconsPack} />
           <ApplicationProvider {...eva} theme={eva.light}>
                   {Platform.OS === 'ios' && (  <View style={{height:18,  backgroundColor: "#c6cfda",}}></View>)}
             <SafeAreaView style={styles.container}>
                 <SafeAreaView style={styles.contentContainer}>
                   {this.TopNavigationImageTitleShowcase()}
                   <SafeAreaView style = {{flex:230, width:"100%", height:"100%"}}>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            barCodeTypes={[RNCamera.Constants.BarCodeType.datamatrix]}
            defaultTouchToFocus
            flashMode={this.state.camera.flashMode}
            mirrorImage={false}
            onBarCodeRead={this.barcodeReceived.bind(this)}
            style={styles.preview}
            type={this.state.camera.type}
            captureAudio={false}
            autoFocus="on"
                     />
                     <Viewfinder />
                     {this.state.camera.flashMode == "off" ? this.FlashPartOff() : this.FlashPartOn()}
                     {this.CodeRead()}
                     </SafeAreaView>
       
             {this.TransactionButtons()}
          
          </SafeAreaView>
      </SafeAreaView>
           </ApplicationProvider>
            </>
           );
        }
        
     }
      else if (this.state.token != null && this.state.token != "") {
         return (<>
           <IconRegistry icons={EvaIconsPack} />
           <ApplicationProvider {...eva} theme={eva.light}>
                 {Platform.OS === 'ios' && (  <View style={{height:18,  backgroundColor: "#c6cfda",}}></View>)}
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                 {this.TopNavigationImageTitleShowcase()}
                 <Card style={{flex:1, marginTop: "0%"}} status='primary'>
                    <Menu style={{height:"90%" ,borderWidth:7,
                    borderStyle: 'solid',
                    borderColor:'#DCDCDC',
                    borderLeftColor:'#DCDCDC',borderRadius:3}}
                    selectedIndex={this.state.selectedIndex}
                    onSelect={index => this.selectedItemChange(index)}>
                     <MenuItem style={{height:100}} title='Numune Sarf Oluştur' />
                     <MenuItem style={{height:100}} title='Numune Sarf Hareketlerini Listele'/>
                  </Menu>
                </Card>
                </View>
            </View>
           </ApplicationProvider>
      </>
           );
      }
      else if (this.state.serverURL != "" && this.state.stakeholderGLN != "") {
        return (
           <>
           <IconRegistry icons={EvaIconsPack} />
           <ApplicationProvider {...eva} theme={eva.light}>
                {Platform.OS === 'ios' && (  <View style={{height:18,  backgroundColor: "#c6cfda",}}></View>)}
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                  {this.LoginHeader()}
                  {this.UserControlContent()}
                </View>
            </View>
           </ApplicationProvider>
           </>
        );
      }
      else {
        
        return (
           <ApplicationProvider {...eva} theme={eva.light}>
                {Platform.OS === 'ios' && (  <View style={{height:18,  backgroundColor: "#c6cfda",}}></View>)}
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    
                    {this.LoginHeader()}
                    {this.StakeholderControlContent()}

                </View>
            </View>
           </ApplicationProvider>
           
        );

      }
            
    }
  }
}

const styles = EStyleSheet.create({
   titleContainer: {
    flexDirection: 'row',
        alignItems: 'center'
  },
  logo: {
    marginHorizontal: 16,
  },
  indicator:{
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    margin: 2,
  },
  alternativeContainer: {
    width:"100%",
    borderRadius: 4,
    marginVertical: 2,
    backgroundColor: '#3366FF',
    alignItems: 'center',
  },
  VisioTTLogoHeader: {
      width: wp('50%'),
      height: hp('9.5%'),
      alignSelf:"flex-end",
      top:hp('2.5%')
  },
  VisioTTLogoFooter: {
      width: wp('38%'),
      height: hp('18%'),
      marginTop: hp('-5%'),
      marginLeft: wp('2%'),
  },
  FooterLineImage: {
      width: "100%",
      height:  "30%",
      marginTop:hp('-1.4%')
  },
  HeaderLineImage: {
      width: "100%",
      height: "5%",
      marginTop: hp("3%")
    },
  QrButtonImage: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    marginTop: '0%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 'auto'
  },
  QrButton: {
    backgroundColor: 'white',
    height: "50%",
    width: "50%",
    marginTop: '10%',
    alignSelf: 'center',
  },
  QrButtonImageSmall: {
      width: '100%',
      height: '100%',
      alignSelf: 'center',
      marginTop: '0%',
      alignItems: 'center',
    },
    SafeImage: {
      width: wp("12%"),
      height: hp("12%"),
      alignSelf:"center",
      marginTop: hp("3%"),
    },
    QrButtonSmall: {
      bottom:0,
      backgroundColor: 'rgba(0, 0, 0, 0)',

      height: hp('6%'),
      width: wp('10%'),
      alignSelf: 'center',
    },
  Oval: {
      width: "100%",
      height: "100%",
  },
  visioTTlogo: {
    width: "70%",
    height: "70%",
      
    top:"25%"
  },
  container: {
    '@media ios': {
    },
  flex:1,
   width: "100%",
       height: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white"
  },
  contentContainer: {
       flex:1,
      height: "100%",
      width: "100%",
      flexDirection: "column",
      backgroundColor: "white",
      justifyContent: 'space-between'
  },
  topContainer: {
      flex: 5,
    backgroundColor: "#364150",
    height: "100%",
    width: "100%",
    justifyContent: "flex-start",
      
  },
  middleContainer: {
    flex: 55,
    height: "100%",
    width: "100%",
    backgroundColor: "white",
      alignItems: "center",
      justifyContent: "center",
  },
   middleContainerHeader: {
    flex: 90,
    height: "100%",
    width: "100%",
    backgroundColor: "white",
      alignItems: "center",
      justifyContent: "center",
  },

  middleContainerProduct : {
    flex: 175,
    height: "70%",
    width: "100%",
    backgroundColor: "white",
      alignItems: "center",
      justifyContent: "center",
  },
  bottomContainer: {
      flex: 10,
      height: "100%",
      flexDirection: "row",
      backgroundColor: "white",
      justifyContent: 'space-between' ,
      top:0,
  },
  topContainerVisioTT: {
    flex: 29,
      position: 'absolute',
      width: wp("100"),
      height: hp("13%"),
      flexDirection: "column",
      backgroundColor: "white",
      
      top:0
  },
  
  bottomContainerVisioTT: {
      position: 'absolute',
      bottom:0,
      width: wp("100"),
      height: hp("10.2%"),
      backgroundColor: "white",
      flexDirection: "row",
      
  },
  bottomContainerVisioTTResult: {
    bottom:0,
    flex: 10,
    height: "100%",
    backgroundColor: "white",
    
},
  topContainerVisioTTResult: {
      flex: 12.8,
      height: "100%",
      backgroundColor: "white",
      top:0
  },
  middleContainerVisioTTResult: {
      flex:74,
      height: "100%",
      backgroundColor: "#d6d7da",
  },
  pdf: {
    flex:1,
    width:Dimensions.get('window').width,
  },
  
  ResultTextPartMenu: {
    flex: 6,
    backgroundColor: "#d6d7da",
    flexDirection: "row",
    alignContent:"center",
    justifyContent:"space-between"
    
},
ResultTextPartMenuB: {
  flex: 2,
  height: "90%",
  width:"90%",
  backgroundColor: "#d6d7da",
  flexDirection: "row",
  alignItems:"center",
  top:hp("0.2%"),
},

ResultPdfPart: {flex: 92,
  height: "100%",
  backgroundColor: "white",},

ResultTextPartMenu1: {
  alignItems:"center",
  flex:5,
  height: "100%",
  width:"100%",
  backgroundColor: "#d6d7da",
  alignSelf:"center",
  borderRadius: 5,
  borderWidth: 0.5,
  borderColor: '#d6d7da',
  alignContent: "center",
},
ResultTextPartMenuText1:{
  top:hp("0.4%"),
  height: "100%",
  color:"white",
  fontFamily: "VisioTTMEDIUM",
  '@media ios': {
    fontFamily : "DINbek Medium"
    },
      textAlign: "center",
      color: 'black',
      fontSize: "15rem",
      marginLeft: "10rem",
      marginRight: "10rem",
      alignItems:"center",
  alignSelf:"center",
},
ResultTextPartMenuText2:{
  top:hp("0.7%"),
  fontFamily: "VisioTTMEDIUM",
  '@media ios': {
    fontFamily : "DINbek Medium"
    },
  alignContent:"center",
      color: 'black',
      fontSize: "15rem",
      marginLeft: "10rem",
      marginRight: "10rem",
},
ResultTextPartMenu2: {
  alignContent: "center",
  alignItems:"center",
  flex:5,
  height: "100%",
  backgroundColor: "white",
  alignSelf:"center",
  borderRadius: 5,
  borderWidth: 0.5,
  borderColor: '#d6d7da',
},
  ResultTextPart: {
      flex: 60,
      height: "100%",
      backgroundColor: "#d6d7da",
  },
  ResultSafetyPart: {
      flex:22,
      height: "100%",
      flexDirection: "row",
    backgroundColor: 'white'
  },
  ResultSafetyPart1: {
      flex:5,
      alignSelf:"center"
  },
  ResultSafetyPart2: {
      flex:3,
      height: "100%",
      backgroundColor: "white",
      alignItems:"center"
  },
  ResultSafetyPart3: {
      flex:5,
      alignSelf:"center"
  },
  ResultReScanPart: {
      flex: 10,
      height: "100%",
      flexDirection: "column",
      backgroundColor: "white",
      justifyContent: 'space-between' ,
      
  },
  ResultGoHomePart: {
    position: 'absolute',
    top:hp("15"),
    width: wp("13"),
    height: hp("4%"),
},
FlashPart: {
  position: 'absolute',
  top:(Platform.OS === 'ios' ? hp("63.5") : hp("67.5")),
  width: wp("13"),
  height: hp("4%"),
  alignSelf:"flex-end"
},

  stringContent: {
      marginTop: "15%",
      alignItems: 'center',
  },
  descriptionText: {
    fontFamily: "VisioTTMEDIUM",
  '@media ios': {
    fontFamily : "DINbek Medium"
    },
      fontSize: "12rem",
      marginLeft: "10rem",
      marginRight: "10rem",
      alignSelf:"center",
      color:"#808080"
  },
  descriptionTextHeader: {
    fontFamily: "VisioTTMEDIUM",
  '@media ios': {
    fontFamily : "DINbek Medium"
    },
    fontSize: "20rem",
    color:"#212c64",
    marginLeft: "10rem",
    marginRight: "10rem",
    alignSelf:"center",
},
  TextHeader: {
    fontFamily: "VisioTTBOLD",
  '@media ios': {
    fontFamily : "DINbek Bold"
    },
      marginTop: hp('1%'),
      textAlign: "center",
      color: 'black',
      fontSize: "18rem",
      marginLeft: "10rem",
      marginRight: "10rem",
    },
    TextLeft: {
      fontFamily: "VisioTT",
  '@media ios': {
    fontFamily : "DINBek"
    },
      marginTop: hp('1%'),
      fontSize: "16rem",
      marginLeft: "25rem",
      marginRight: "25rem",
      color:"#808080"
    },
    TextLeftBlue: {
      fontFamily: "VisioTTMEDIUM",
  '@media ios': {
    fontFamily : "DINbek Medium"
    },
      color: '#212c64',
      marginTop: hp('1%'),
      fontSize: "16rem",
      marginLeft: "25rem",
      marginRight: "25rem",
    },
    TextRight: {
      fontFamily: "VisioTTMEDIUM",
  '@media ios': {
    fontFamily : "DINbek Medium"
    },
      color: 'black',
      marginLeft: "10rem",
      fontSize: "16rem"
    },
    TextRightBlue: {
      fontFamily: "VisioTTMEDIUM",
  '@media ios': {
    fontFamily : "DINbek Medium"
    },
      color: '#212c64',
      marginLeft: "10rem",
      fontSize: "16rem"
    },
    TextRightForInfo: {
      fontFamily: "VisioTT",
      '@media ios': {
        fontFamily : "DINBek"
        },
      color: 'black',
      marginLeft: "10rem",
      marginRight: "10rem",
      fontSize: "16rem"
    },
    TextRightBlueUnderline: {
      fontFamily: "VisioTTMEDIUM",
  '@media ios': {
    fontFamily : "DINbek Medium"
    },
      color: '#212c64',
      marginLeft: "10rem",
      fontSize: "16rem",
      textDecorationLine: 'underline',
    },
    SafeTextLeft: {
      fontFamily: "VisioTTBOLD",
      '@media ios': {
        fontFamily : "DINbek Bold"
        },
      color: '#04BC17', fontWeight: 'bold', fontSize: "14rem",
      marginLeft: "10rem",
      marginRight: "10rem",
      alignSelf:"flex-end"
    },
    SafeTextRight: {
      fontFamily: "VisioTTBOLD",
  '@media ios': {
    fontFamily : "DINbek Bold"
    },
      color: '#04BC17', fontWeight: 'bold',fontSize: "14rem",
      marginLeft: "10rem",
      marginRight: "10rem",
      alignSelf:"flex-start"
    },
    SafeTextLeftW: {
      fontFamily: "VisioTTBOLD",
      '@media ios': {
        fontFamily : "DINbek Bold"
        },
      color: 'red', fontWeight: 'bold', fontSize: "14rem",
      marginLeft: "10rem",
      marginRight: "10rem",
      alignSelf:"flex-end"
    },
    SafeTextRightW: {
      fontFamily: "VisioTTBOLD",
      '@media ios': {
        fontFamily : "DINbek Bold"
        },
      color: 'red', fontWeight: 'bold',fontSize: "14rem",
      marginLeft: "10rem",
      marginRight: "10rem",
      alignSelf:"flex-start"
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: "100%",
      height:"100%"
    },
  '@media (min-width: 900) and (max-width:1400) and (min-height: 500) and (max-height: 850) ': { // media queries
      contentContainer: {
          width: HWPercentage > 1.4 && HWPercentage <= 1.45 ? "69%" :
                 HWPercentage >1.45 && HWPercentage <= 1.5 ? "67%" :
                 HWPercentage > 1.5 && HWPercentage <= 1.55 ? "65%" :
                 HWPercentage > 1.55 && HWPercentage <= 1.6  ? "63%" :
                 HWPercentage > 1.6 && HWPercentage <= 1.65  ? "61%" :
                 HWPercentage > 1.65 && HWPercentage <= 1.7 ? "59%" :
                 HWPercentage > 1.7  && HWPercentage <= 1.75 ? "%57" : "56%",//1280-752  %57, 1280-720 & 960-552  %56, 1024-720  %69,1280-844 %65
          aspectRatio: 1 ,
          flexDirection: "column",
          backgroundColor: "white",
      },
      VisioTTLogo: {
          flex:8,
          width: HWPercentage > 1.4 && HWPercentage <= 1.55 ? wp("29%") : wp("25%"),//1024-720 & 1280-844 %29
          height: hp('11%'),
          alignSelf: 'center',
          marginTop: hp('-22%'),
      },
      VisioTTLogoFooter: {
          width: wp('11%'),
          height: hp('9%'),
          marginTop: 0,
          marginLeft: wp('1%'),
      },
      middleContainer: {
          flex: 54,
          width:"55%",
          height: "100%",
          backgroundColor: "white",
          alignSelf: "center",
      },
      descriptionText: {
          fontSize: "4rem",
          marginLeft: "10rem",
          marginRight: "10rem",
          alignSelf:"center"
      },
      bottomContainer: {
          flex: 10,
          width:"55%",
          height: "100%",
          alignSelf: "center",
          backgroundColor: "white",
      },
      FooterLineImage: {
          width: "100%",
          height:"5%",
          alignSelf: "center",
      },
  },
 
});
