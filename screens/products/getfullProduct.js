import React ,{memo} from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Image} from "react-native";
import { SetHTTP } from "../../util/setHTTP";
import Label, {Orientation} from "react-native-label";
import { FormatNumber } from "../../util/formatNumber";
import truncate from "../../util/truncate";
import Star from 'react-native-star-view';
import { pure } from "recompose";
import { FlatList } from "react-native";
import FastImage from 'react-native-fast-image';
 function GetfullProduct(props){

    const datafullproduct=props.DatafullProduct;
    // console.log("test dataproduct : ",datafullproduct)
    const productDetail = (idProduct, idProductype)=>{
        props.navigation.navigate('productDetail',{
            idProduct : idProduct,
            idProductType : idProductype
        });
     }
    const renderitem =  (item)=>{
        
        const name = item.name;
        let star = item.reviewStar;
        let quanityReview = 0;
        if(item.reviewStar===null){
            star = 5
        }else{
            quanityReview = item.quanityReview;
            star = item.reviewStar
        }
        const titleSale = 100-(Math.round((item.promotional*100)/item.price))
        return(
            <View key={item.id} >
                   <TouchableOpacity onPress={()=>{
                       productDetail(item.id,item.idProductType)
                                    //     props.navigation.navigate('productDetail',{
                                    //     idProduct : item.id,
                                    //     idProductType : item.idProductType
                                    // });
                                    }}>
                        {item.promotional > 0 ? 
                        <>
                        <Label
                            orientation={Orientation.TOP_RIGHT}
                            containerStyle={styles.cart_item}
                            title={`${titleSale}%`}
                            distance={18}
                            extent={0.0}
                            style={{
                                    fontSize: 15,
                                    color: 'white',
                                    // textAlign: 'center',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                            }}
                            shadowProps={{ 
                                    shadowColor: "#C8C8C8",
                                    shadowOffset: { width: 0, height: 12, },  
                                    shadowOpacity: 0.2, shadowRadius: 8, 
                                    elevation: 2 
                                }}
                        >
                                <View>
                                <FastImage 
                                        // source={{ uri:SetHTTP(item.image)}} 
                                        source={{ uri:SetHTTP(item.image) , priority: FastImage.priority.normal}} 
                                        
                                        // resizeMode='contain'
                                        resizeMode= {FastImage.resizeMode.contain}
                                        style={{ 
                                            width : windowW*0.46,
                                            height : windowH*0.35,
                                            borderRadius:6,
                                        }}
                                    />
                                    {/* <Image 
                                            source={{ uri:SetHTTP(item.image)}} 
                                            resizeMode= "contain"
                                            style={{ width : windowW*0.46,
                                                height : windowH*0.35,
                                                borderRadius:6,
                                            }}
                                        /> */}
                                </View>
                                    <View style={{ flexDirection:"row",paddingLeft:5 }}>
                                        <Text>{truncate(name)}</Text>
                                    </View>
                                    <View style={{ flex : 1, justifyContent:"space-between", marginHorizontal: 3, marginTop: 3 ,flexDirection:"row",}}>
                                            <Text style={{...styles.price ,color : "#777777", textDecorationLine:"line-through", marginRight:5 }}>{FormatNumber(item.price)}đ</Text>
                                            <Text style={{ ...styles.price ,color:"red",marginRight:10}}>{FormatNumber(item.promotional)}đ</Text>
                                        
                                        {/* <Text style={{ ...styles.price, color:'red' }}>{FormatNumber(item.price)}đ</Text> */}
                                    </View>  
                                    <View style={{ flex:1,flexDirection:"row"}}>
                                        <Star score={star} style={{width:80,height:15}}/>
                                        <Text style={{ fontSize :12}}>{`( ${quanityReview} review )`}</Text>
                                    </View>
                                        
                            </Label>
                        </>:<>
                        <View style={{...styles.cart_item, justifyContent: "center",alignContent: "center" }}>
                                <View >
                                    <FastImage 
                                            source={{ uri:SetHTTP(item.image),  priority: FastImage.priority.normal}} 
                                            resizeMode= {FastImage.resizeMode.contain}
                                            style={{ width : windowW*0.46,
                                                height : windowH*0.35,
                                                borderRadius:6,
                                            }}
                                        />
                                        {/* <Image 
                                            source={{ uri:SetHTTP(item.image)}} 
                                            resizeMode= "contain"
                                            style={{ width : windowW*0.46,
                                                height : windowH*0.35,
                                                borderRadius:6,
                                            }}
                                        /> */}
                                </View>
                                    <View style={{ flexDirection:"row",paddingLeft:5 }}>
                                        <Text>{truncate(name)}</Text>
                                    </View>
                                    <View style={{ flex : 1, marginHorizontal: 3, marginTop: 3  ,flexDirection:"row",}}>
                                        <Text style={{ ...styles.price, color:'red' }}>{FormatNumber(item.price)}đ</Text>
                                    </View>  
                                    <View style={{flex:1, flexDirection:"row"}}>
                                        <Star score={star} style={{width:80,height:15}}/>
                                        <Text style={{ fontSize :12}}>{`( ${quanityReview} review )`}</Text>
                                    </View>
                            </View>
                        </>}
                    </TouchableOpacity>
            </View>
        )
    }

    return(

        <ScrollView contentContainerStyle={styles.container}>
          {/* datafullproduct!==undefined && */}
            {  datafullproduct!== undefined &&  
                datafullproduct.map( e=>{
                          return(
                             renderitem(e)
                         )
                     })
                     }  
            
     
        </ScrollView>

    //     <ScrollView contentContainerStyle={styles.container} horizontal={true}>
          
    //     <FlatList contentContainerStyle={styles.flatlist}
    //       data={datafullproduct}
    //       numColumns={2}
    //       renderItem={({item}) => renderitem(item)}
    //     />
          
    //   </ScrollView>
    )
}
const windowW = Dimensions.get('window').width;
const windowH = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:"space-between",
        flexDirection:"row",
        backgroundColor: 'white',
        flexWrap:'wrap',

    },
    flatlist: {
        flexDirection: "column"
    },
    cart_item:{
        width: windowW*0.47,
        height: windowH*0.50,
        margin: 5,
        backgroundColor: "#F8F9F9",
        borderRadius: 5,
        shadowColor:'#000',
        shadowOffset:{
            width:0,
            height: 2,
        },
        shadowOpacity : 0.35,
        shadowRadius: 3.4,
        elevation:5,

    },
    price:{ fontSize :14,
        
    }
})

export default memo(GetfullProduct);