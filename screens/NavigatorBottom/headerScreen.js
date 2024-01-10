import React ,{memo} from "react";
import {View, Text, StyleSheet, Dimensions,TouchableOpacity,Animated } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { pure } from 'recompose';
function HeaderScreen(props){
    const {bgWhite, hideSearch, heightHeader,statusUser} = props;
    const handleAccount = ()=>{
        console.log(statusUser)
        if(statusUser){
            console.log("1")
            props.navigation.navigate("Profile")
        }else{
            console.log("2")
            props.navigation.navigate("login")
        }
    }
    const handleCart = ()=>{
        props.navigation.navigate("Cart")
    }
    return(
        <Animated.View>
        <LinearGradient
            colors={["#764FE2",'#9C30FF']}
            style= {{ ...style.container, height: heightHeader }}
        >
            <View style= {bgWhite?{...style.header,backgroundColor:'white'}:{...style.header}}>
                <Text style={bgWhite?{...style.label,color:'tomato'}:{...style.label}}>FashionHQ</Text>
                <View style={{ flexDirection:'row' }}>
                    {/* <AntDesign name="shoppingcart" color={bgWhite?"black":"white"} size={24} style={{marginRight:10}}/> */}
                    <TouchableOpacity onPress={() =>  props.navigation.navigate("Cart")}>
                        <AntDesign name="shoppingcart" color={bgWhite?"black":"white"} size={24} style={{marginRight:10}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAccount}>
                        <Feather name="user" color={bgWhite?"black":"white"} size={24}/>
                    </TouchableOpacity>
                </View>
            </View>
            {hideSearch==true ?
            <>
             <View style={{...style.search1,backgroundColor:props.colorSearch}}>
                <View style={style.input} >
                    <TouchableOpacity onPress={()=>{props.navigation.navigate('search')}}>
                    {/* Nhấn vào input  hoặc button cho nhảy sang trang search */}
                        {/* <TextInput style={{ ...style.textinput}}/> */}
                        <Text style={{ ...style.textinput}}>{props.textsearch}</Text>
                    </TouchableOpacity>
                        <LinearGradient 
                            colors={["#C790E5",'#9C30FF','#BEE6F0']}
                            style={style.search}
                        >
                            <TouchableOpacity onPress={()=>{props.navigation.navigate('search')}}>
                                <Text style= {{ color: 'white', fontSize: 12 }}>Search</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
            </>:null}
        </LinearGradient>
        </Animated.View>
    )
}

const windowW = Dimensions.get('window').width;
const windowH = Dimensions.get('window').height;

const style = StyleSheet.create({
    container:{
        
        // height : windowH*0.145,
        backgroundColor : "#764FE2",
    },
    input:{
        justifyContent: "space-between",
        flexDirection:"row",
        height : windowH*0.048,
        width : windowW*0.9,
        borderWidth : 1,
        borderColor: '#764FE2',
        backgroundColor: 'white',
        borderRadius : 50,
        marginTop : 15,
        // marginBottom:65,
        
    },
    textinput:{
        flex:1,
        paddingLeft: 10,
        paddingTop: 2,
        marginLeft: 8,
        backgroundColor : 'white',
        height : windowH*0.035,
        width : windowW*0.58,
        // borderWidth : 1,
        borderTopLeftRadius : 50,
        borderBottomLeftRadius:50,
        fontSize: 12,
        paddingTop:7
    },
    search:{
        marginRight:3,
        marginBottom:1,
        backgroundColor : "red",
        height : windowH*0.038,
        width : windowW*0.23,
        borderRadius :50,
        marginTop : 2,
        textAlign: "center",
        justifyContent : "center",
        alignContent : "center",
        alignItems:"center"
    },
    header:{
        flexDirection: "row",
        justifyContent: 'space-between',
        paddingRight : 15,
        paddingTop:10,
   
    },
    search1:{
        justifyContent : "center",
        alignContent : "center",
        alignItems:"center",
        paddingBottom:10
    },
    label:{
        color:'white',
        fontWeight:'bold',
        fontSize:18,
        marginLeft:10,
        marginTop:2
    }
})

export default memo(HeaderScreen);