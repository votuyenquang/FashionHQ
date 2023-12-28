import React from 'react';
import {FlatList,ScrollView} from 'react-native';
import { pure } from 'recompose';
// import { ScrollView } from 'react-native-gesture-handler';
 function VirtualizedView(props) {
  
    return(
      <ScrollView 
      // nestedScrollEnabled
        contentContainerStyle={{ paddingTop:90,elevation:5 }}
        showsVerticalScrollIndicator={false}
        onScroll={(e)=>{
          props.setValue(e);
        }} 
      >
        {props.children}
      </ScrollView>
    )
 
  }
  export default React.memo(VirtualizedView)