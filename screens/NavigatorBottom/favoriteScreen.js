import React, {useEffect, useState} from "react";
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, ScrollView,Image,Alert} from "react-native"; 
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as GETAPI from '../../util/fetchApi';
import { SetHTTP } from "../../util/setHTTP";
import truncate from "../../util/truncate";
import { FormatNumber } from "../../util/formatNumber";
import Label, {Orientation} from "react-native-label";
import Star from 'react-native-star-view';
import LottieView from "lottie-react-native";
import LoadingCircle from "../StartScreens/loadingCircle";
import {updatequantityFavorite} from '../../redux/reducer/product.reducer';
import { useDispatch } from "react-redux";

export default function FavoriteScreen (props,{navigation}){
    const [Dataproduct, setDataproduct] = useState([]);
    const [DataAnsynStore, setDataAnsynStore] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    const [countItemcart, setcountItemcart] = useState(0)
    const dispatch = useDispatch();

    useEffect(() => {
        const set =  props.navigation.addListener('focus',()=>
        {
            setisLoading(true)
            getDataAnsynStore()
        })
    
        return set;
    }, [])
    const getDataAnsynStore = async()=>{
        let arr = [];
        const getData = await AsyncStorage.getItem('FAVORITE');
        if(getData !== null){ 
            arr = JSON.parse(getData);
            // console.log(arr)
            let countCart = arr.length;
            const data1 = {"data": getData}
            const res = await GETAPI.postDataAPI('/order/getProductFavorite',data1);
            setcountItemcart(countCart)
            dispatch(updatequantityFavorite(countCart))
            setDataproduct(res);
            setDataAnsynStore(arr);
            setisLoading(false);
        }else{
            setDataproduct([]);
            setcountItemcart(0);
            dispatch(updatequantityFavorite(0))
            setisLoading(false);
        }
    }

    const removeAllFavorite = async()=>{
        try {
        await AsyncStorage.removeItem("FAVORITE")
            setDataAnsynStore([])
            getDataAnsynStore()

        } catch (error) {
            console.log(error)
        }
    }

    const DeleteAll =()=>{
        if(DataAnsynStore.length == 0){
            alert('FashionHQ','There are no favorite products!!')
    
        }else{
            Alert.alert('FashionHQ','You want to delete your favorite products !!!',[
                {
                    text: 'Cancel',
                    style:'cancel'
                },
                {
                    text: "Ok",
                    onPress:()=>{removeAllFavorite()
                            }
                    }
                ])
        }
    }
    const renderitem = (item)=>{
        const name = item[0].name;
        let star = item[0].reviewStar;
        let quanityReview = 0;
        if(item[0].reviewStar===null){
            star = 5
        }else{
            quanityReview = item[0].quanityReview;
            star = item[0].reviewStar
        }
        const titleSale = 100-(Math.round((item[0].promotional*100)/item[0].price))
        return(
            <View key={item[0].id} >
                <TouchableOpacity 
                    onPress={()=>{
                            props.navigation.navigate('productDetail',{
                            idProduct : item[0].id,
                            idProductType : item[0].idProductType
                        });
                    }}
                    onLongPress={()=>{
                        Alert.alert('FashionHQ','You want to remove this product from your favorites list !!',
                        [
                            {
                                text: 'Cancel',
                                style: "cancel"
                            },
                            {
                                text: 'OK',
                                onPress:async()=>{
                                    let dataAnsynstore = DataAnsynStore;
                                    if(dataAnsynstore.length > 1){
                                        for(let j = 0;j<=dataAnsynstore.length-1;j++){ 
                                            if(dataAnsynstore[j].id==item[0].id){
                                                dataAnsynstore.splice(j,1)
                                                await AsyncStorage.setItem("FAVORITE",JSON.stringify(dataAnsynstore))
                                                getDataAnsynStore()
                                            
                                            }
                                        }
                                    }else{
                                        removeAllFavorite();
                                    }
                                }
                            }
                        ])
                    }}>
                    {item[0].promotional > 0 ? 
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
                                <View >
                                    <Image 
                                        source={{ uri:SetHTTP(item[0].image)}} 
                                        resizeMode='contain'
                                        style={{ 
                                            width : windowW*0.46,
                                            height : windowH*0.35,
                                            borderRadius:6,
                                        }}
                                    />
                                </View >
                                    <View style={{ flexDirection:"row",paddingLeft:5 }}>
                                        <Text>{truncate(name)}</Text>
                                    </View>
                                    <View style={{ flex : 1, justifyContent:"space-between", marginHorizontal: 3, marginTop: 3 ,flexDirection:"row",}}>
                                            <Text style={{...styles.price ,color : "#777777", textDecorationLine:"line-through", marginRight:5 }}>{FormatNumber(item[0].price)}$</Text>
                                            <Text style={{ ...styles.price ,color:"red",marginRight:10}}>{FormatNumber(item[0].promotional)}$</Text>
                                        
                                        {/* <Text style={{ ...styles.price, color:'red' }}>{FormatNumber(item.price)}$</Text> */}
                                    </View>  
                                    <View style={{ flex:1,flexDirection:"row"}}>
                                        <Star score={star} style={{width:80,height:15}}/>
                                        <Text style={{ fontSize :12}}>{`( ${quanityReview} review )`}</Text>
                                    </View>
                                        
                            </Label>
                        </>:<>
                        <View style={{...styles.cart_item, justifyContent: "center",alignContent: "center" }}>
                                <View >
                                    <Image 
                                            source={{ uri:SetHTTP(item[0].image)}} 
                                            resizeMode='contain'
                                            style={{ width : windowW*0.46,
                                                height : windowH*0.35,
                                                borderRadius:6,
                                            }}
                                        />
                                </View>
                                    <View style={{ flexDirection:"row",paddingLeft:5 }}>
                                        <Text>{truncate(name)}</Text>
                                    </View>
                                    <View style={{ flex : 1, marginHorizontal: 3, marginTop: 3  ,flexDirection:"row",}}>
                                        <Text style={{ ...styles.price, color:'red' }}>{FormatNumber(item[0].price)}$</Text>
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
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Text style={{ color: 'black', fontWeight: "bold", fontSize:18, marginLeft: 15}}>Favorite (</Text>
                <Text style={{ color: 'red', fontWeight: "bold", fontSize:18, }}>{countItemcart}</Text>
                <Text style={{ color: 'black', fontWeight: "bold", fontSize:18,}}>)</Text>
                </View>
                
                <TouchableOpacity onPress={()=>{DeleteAll()}} style={{ paddingRight:15 }}>
                    <AntDesign name="delete" size={20} color="black" />
                </TouchableOpacity>
            </View>
            {isLoading ?
            <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems:'center' }}>
               <LoadingCircle/>
            </View>:<>
            {Dataproduct.length > 0 ? 
                <>
                <View style ={{ position: 'absolute', marginTop: 45 , flexDirection:'column',justifyContent:'center'}}>
                    <LottieView  
                            source={require('../../assets/lottierfiles/lovehearts12.json')}
                            style={{ width:'100%', height:windowH*0.9,marginLeft: windowW*0.06 }}
                            autoPlay
                            loop                   
                        />
                </View>
                <ScrollView style={{ backgroundColor: 'transparent' }}>                               
                    <ScrollView contentContainerStyle={styles.scrollviewitem}>
                    {Dataproduct!==undefined &&
                        Dataproduct.map(e=>{
                            return(
                                renderitem(e)
                            )
                        })}
                    </ScrollView>
                </ScrollView>
            </>:
            <View>
                    <LottieView  
                        source={require('../../assets/lottierfiles/lovehearts12.json')}
                        style={{ width:windowW*0.4, height:windowH*0.9,marginLeft: windowW*0.06,opacity:0.5}}
                        autoPlay
                        loop                   
                    />
                        <View style= {{width:'100%', height: '100%', position:'absolute',flexDirection: 'column', justifyContent: 'center', backgroundColor:'transparent',alignContent:'center' }}>
                            <Text style= {{ textAlign:'center', color: 'gray' }}>There are no favorite products...</Text>
                        </View>
                        
            </View>
            
            
            }

            </>}

        </View>
    )

}

const windowW = Dimensions.get('window').width;
const windowH = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection:'column'

    },
    scrollviewitem: {
        flex:1,
        justifyContent:"space-between",
        flexDirection:"row",
        backgroundColor: 'white',
        flexWrap:'wrap',
        backgroundColor:'transparent'

    },
    header:{
        borderBottomWidth: 0.5,
        borderBottomColor: "#D3D3D3",
        height: 45,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems:"center",
        shadowColor: "rgb(180, 180, 180)",
        shadowOffset:{
            width:0,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 2,
        paddingBottom:10,
        paddingTop:10,
    },
    cart_item:{
        width: windowW*0.47,
        height: windowH*0.50,
        margin: 5,
        // backgroundColor: "#F8F9F9",
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'purple',
        // shadowColor:'#000',
        // shadowOffset:{
        //     width:0,
        //     height: 2,
        // },
        // shadowOpacity : 0.35,
        // shadowRadius: 3.4,
        // elevation:5,
        backgroundColor: 'transparent'
    },
    price:{ fontSize :14,
        
    }
})