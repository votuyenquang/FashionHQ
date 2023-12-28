import  React  from 'react';
import {View, Text, Image, } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import HomeScreen from './homeScreen';
import CartScreen from './cartScreen';
import FavoriteScreen from './favoriteScreen';
import GiftScreen from './giftScreen';
import ProfileScreen from './profileScreen';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
const Stack = createBottomTabNavigator();
export default function TabNavigation(){
    const quanityCart = useSelector(state=>state.productReducer.quanityCart);
    const quantityFavorite = useSelector(state=>state.productReducer.quantityFavorite);
        return(
            <View style={{ flex:1 }}>
            <Stack.Navigator
                screenOptions={{
                        headerShown:false,
                        tabBarStyle:[{  
                            style:{
                                position : "absolute",
                                borderTopLeftRadius  :11, 
                                borderTopRightRadius : 11,
                                height : 60,
                                elevation : 0,
                                backgroundColor : '#ffffff',
                                ...styles.shadow,
                            }
                        }],
                        tabBarShowLabel: false
                }}
            >

        <Stack.Screen name="Home" component={HomeScreen}
                options={{
                tabBarIcon: ({focused})=>(
                    <View style={{ alignItems : "center", justifyContent : "center",top:3}}>
                        <Ionicons name="home-outline" size={22} color={focused ? '#e32f45' : '#748c94'}/>
                        <Text style={{ color : focused ? '#e32f45' : '#748c94', fontSize : 12}}>Home</Text>
                    </View>
                )
            }}
        />
        <Stack.Screen name="Favorite" component={FavoriteScreen}
                options={{
                    tabBarIcon: ({focused})=>(
                        <View style={{ alignItems : "center", justifyContent : "center",top:3}}>
                            <Feather name="heart" size={22} color={focused ? '#e32f45' : '#748c94'}/>
                            <Text style={{ color : focused ? '#e32f45' : '#748c94', fontSize : 12}}>Favorite</Text>
                        </View>
                    ),
                    tabBarBadge : quantityFavorite > 0 ? quantityFavorite :null
                }}        
        />
         <Stack.Screen name="Gift" component={GiftScreen}
                 options={{
                    tabBarIcon: ({focused})=>(
                        <View style={{ alignItems : "center", justifyContent : "center",top:3}}>
                            <Ionicons name="gift-outline" size={22} color={focused ? '#e32f45' : '#748c94'}/>
                            <Text style={{ color : focused ? '#e32f45' : '#748c94', fontSize : 12}}>Promotion</Text>
                        </View>
                    )
                }}       
        />       
        <Stack.Screen name="Cart" component={CartScreen}
                options={{
                    tabBarIcon: ({focused})=>(
                        <View style={{ alignItems : "center", justifyContent : "center" ,top:3}}>
                            <AntDesign name="shoppingcart" size={24} color={focused ? '#e32f45' : '#748c94'}/>
                            <Text style={{ color : focused ? '#e32f45' : '#748c94', fontSize : 12}}>Cart</Text>
                        </View>
                    ),
                    tabBarBadge : quanityCart > 0 ? quanityCart :null
                }}    
        />

        <Stack.Screen name="Profile" component={ProfileScreen}
                options={{
                    tabBarIcon: ({focused})=>(
                        <View style={{ alignItems : "center", justifyContent : "center",top:3 }}>
                            <Feather name="user" size={24} color={focused ? '#e32f45' : '#748c94'}/>
                            <Text style={{ color : focused ? '#e32f45' : '#748c94', fontSize : 12}}>Account</Text>
                        </View>
                    )
                }}     
        />
    </Stack.Navigator>

    </View> 
    )
    
}

const styles = StyleSheet.create({
    shadow : {
        shadowColor :"#7F5DF0",
        shadowOffset :{
            width : 0,
            height : 10,

        },
        shadowOpacity  :0.25,
        shadowRadius : 3.5,
        elevation : 5
    }
})