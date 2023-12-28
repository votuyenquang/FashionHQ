import React from 'react';
import {FlatList,ScrollView} from 'react-native';

export default function VirtualizedViewFlaslist(props) {

    return (
      <FlatList
        bounces={false}
        data={[]}
        contentContainerStyle={{elevation:5 }}
        scrollEventThrottle={16}
        ListEmptyComponent={null}
        keyExtractor={() => "dummy"}
        renderItem={null}
        ListHeaderComponent={() => (
          <React.Fragment>{props.children}</React.Fragment>
        )}
      >
        
      </FlatList>
    );
  }