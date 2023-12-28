import React from "react";
import {View, Text,Dimensions,StyleSheet} from 'react-native';
import LottieView from "lottie-react-native";


export default function LoadingCircle(){
 return (
   <View style={styles.container}>
          <LottieView
                source={require('../../assets/lottierfiles/chuLoading.json')}
                style={{ width: 200, height:200}}
                colorFilters={[
                  {
                    keypath: 'button',
                    color: '#F00000',
                  },
                  {
                    keypath: 'Sending Loader',
                    color: '#F00000',
                  },
                ]}
                autoPlay
                loop
              />
   </View>

 )
}
const windowW = Dimensions.get('window').width;
const windowH = Dimensions.get('window').height;
const styles = StyleSheet.create({
container:{
  justifyContent: 'center',
  alignItems: "center"
}

})