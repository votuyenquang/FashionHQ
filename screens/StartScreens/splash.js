import React, {useEffect,useRef} from "react";
import {View, Text, StatusBar, Dimensions,StyleSheet, Animated, SafeAreaView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function SplashScreen({navigation}){
    const moveAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(()=>{
        Animated.timing(fadeAnim,{
            duration : 2000,
            toValue : 1,
            delay  :2000,
            useNativeDriver : false
        }).start()
        Animated.sequence([
        Animated.timing(moveAnim,{
            duration: 2000,
            toValue : windowW/3,
            delay: 0,
            useNativeDriver : false,
        }),
        Animated.timing(moveAnim,{
            duration: 2000,
            toValue : -6,
            delay: 0,
            useNativeDriver : false,
        }),
    ]).start(()=>{
        navigation.replace('home');
    })
    },[moveAnim,fadeAnim]);

        return (
            <SafeAreaView style={styles.container}>
                <StatusBar 
                    backgroundColor="#F2AF90"
                    barStyle="dark-content"
                />
                <LinearGradient
                // colors={["#B0FCFC",'#FDB3D8']}
                colors={["#F2AF90",'#F4F7D8',"#F4EDE8"]}
                style={{ ...styles.container,width: windowW, height : windowH}}
                >
                    <View style={styles.contentContainer}>
                        <Animated.Image  source={require('../../assets/image/new_logo.png')}
                         style={{ width : windowW*0.65 , height: windowH*0.5 , opacity : fadeAnim}} resizeMode="contain">
                         </Animated.Image>
                    </View>
                    <Animated.View style={{...styles.logoContainer,alignItems:"center", marginLeft : moveAnim}}>
                        <Animated.Text style={{...styles.logoText,color : "#295A8A", opacity : fadeAnim, paddingTop : 4}}> Wellcome to FashionHQ</Animated.Text>
                    </Animated.View>
                </LinearGradient>
            </SafeAreaView>
        )
    }
const windowW = Dimensions.get('window').width;
const windowH = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container:{
        display :"flex",
        flex: 1,
        backgroundColor: "white",
        justifyContent : "center",
        alignContent : "center",
        alignItems : "center"
    },
    contentContainer:{
        alignItems : "center",
    },

    logoText:{
        fontSize : 18,
        fontWeight: "bold",
        color : "red",
        
        
        
        
    },
    logoContainer : {
        flexDirection:"row"
    }
})