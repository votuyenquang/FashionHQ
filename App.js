import React from 'react';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native'
import TabNavigation from './screens/NavigatorBottom/tabNavigation';
import SplashScreen from './screens/StartScreens/splash';
import CollapsibleHeader1 from './screens/products/test';
import SearchScreen from './screens/StartScreens/search';
import ProductDetail from './screens/products/productDetail';
import CartScreen from './screens/NavigatorBottom/cartScreen';
import Test2 from './screens/products/test2';
import ResultSearch from './screens/StartScreens/resultSearch';
import CheckOut from './screens/products/checkout';
import Login from './screens/StartScreens/login';
import SignUp from './screens/StartScreens/signup';
import DetailsBill from './screens/StartScreens/detailsBill';
import ProductCategory from './screens/products/productCategory';
import EditProfile from './screens/StartScreens/editProfile'
const Tab = createStackNavigator();

const App = ()=>{

  return(
      <NavigationContainer>
        <Tab.Navigator
        initialRouteName="splash"
        screenOptions={{ headerShown:false}}
        >
          <Tab.Screen name="aa" component={Test2}/>
          <Tab.Screen name="checkout" component={CheckOut}/>
          <Tab.Screen name="cart" component={CartScreen}/>
          <Tab.Screen name="home" component={TabNavigation}/>
          <Tab.Screen name='splash' component={SplashScreen}/>
          <Tab.Screen name="test" component ={CollapsibleHeader1}/>
          <Tab.Screen name="search" component ={SearchScreen}/>
          <Tab.Screen name="productDetail" component ={ProductDetail}/>
          <Tab.Screen name="resultSearch" component ={ResultSearch}/>
          <Tab.Screen name="login" component={Login}/>
          <Tab.Screen name="signup" component={SignUp}/>
          <Tab.Screen name="deatilbill" component={DetailsBill} />
          <Tab.Screen name="productCategory" component={ProductCategory} />
          <Tab.Screen name="editProfile" component={EditProfile} />
        </Tab.Navigator>
      </NavigationContainer>
  )

}

export default App;
