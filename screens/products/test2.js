import React, {createRef} from "react";
import {View,TouchableOpacity,Text, StyleSheet, Dimensions} from "react-native";
import ActionSheet from "react-native-actions-sheet";

const actionSheetRef = createRef();
export default function Test2(){
  return (
    <View style={{
        justifyContent: "center",
        flex: 1
      }}
    >
      <TouchableOpacity
        onPress={() => {
          actionSheetRef.current?.show();
        }}
      >
        <Text>Open ActionSheet</Text>
      </TouchableOpacity>

      <ActionSheet  ref={actionSheetRef}>
        <View style= { styles.container}>
          <Text>YOUR CUSTOM COMPONENT INSIDE THE ACTIONSHEET</Text>
          <Text>YOUR CUSTOM COMPONENT INSIDE THE ACTIONSHEET</Text>
          <Text>YOUR CUSTOM COMPONENT INSIDE THE ACTIONSHEET</Text>
          <Text>YOUR CUSTOM COMPONENT INSIDE THE ACTIONSHEET</Text>
        </View>
        <TouchableOpacity onPress ={()=>{actionSheetRef.current?.hide();}}>
              <View style={ styles.addcart}>
                <Text>Theem gior hangf</Text>
              </View>
        </TouchableOpacity>

      </ActionSheet>
    </View>
  );
};
const windowW = Dimensions.get('window').width;
const windowH = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    height: windowH*0.6,

  },
  addcart:{
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderRadius: 50,
    width: windowW,
    bottom:0,
    backgroundColor:'pink'
  }
})