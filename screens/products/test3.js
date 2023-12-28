import * as React from 'react';
import {
  Text, 
  View,
  SafeAreaView, TouchableOpacity } from 'react-native';

import Carousel from 'react-native-snap-carousel';

export default class App extends React.Component {

 
    constructor(props){
        super(props);
        this.state = {
          activeIndex:0,
          carouselItems: [
          {
              title:"Item 1",
              text: "Text 1",
          },
          {
              title:"Item 2",
              text: "Text 2",
          },
          {
              title:"Item 3",
              text: "Text 3",
          },
          {
              title:"Item 4",
              text: "Text 4",
          },
          {
              title:"Item 5",
              text: "Text 5",
          },
        ]
      }
    }

    _renderItem({item,index}){
        return (
            <TouchableOpacity onPress={() => { alert(item.title) }}> 
            <View style={{
              backgroundColor:'floralwhite',
              borderRadius: 5,
              height: 250,
              padding: 50,
              marginLeft: 25,
              marginRight: 25, }}>
            <Text style={{fontSize: 30}}>{item.title}</Text>
            <Text>{item.text}</Text>
          </View>
          </TouchableOpacity>
  

        )
    }

    render() {
        return (
          <SafeAreaView style={{flex: 1, backgroundColor:'rebeccapurple', paddingTop: 50, }}>
            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', }}>
                <Carousel
                //   layout={"default"}
                vertical={true}
                swipeThreshold={30}
                layout={'tinder'} layoutCardOffset={`24`}
                  ref={ref => this.carousel = ref}
                  data={this.state.carouselItems}
                  activeSlideOffset={10}
                  callbackOffsetMargin={20}
                  sliderHeight={300}
                  itemHeight={300}
                  renderItem={this._renderItem}
                  loop={true}
                    />
            </View>
          </SafeAreaView>
        );
    }

}

