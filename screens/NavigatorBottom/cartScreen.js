import React, {useEffect, useState} from "react";
import { View, Text,Image,StyleSheet,FlatList, Dimensions, TouchableOpacity, Alert, StatusBar} from "react-native"; 
import * as GETAPI from '../../util/fetchApi';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SetHTTP } from "../../util/setHTTP";
import { FormatNumber } from "../../util/formatNumber";
import truncate from "../../util/truncate";
import LoadingCircle from '../StartScreens/loadingCircle'
import LinearGradient from "react-native-linear-gradient";
import LottieView from "lottie-react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import {updateQuanityProduct} from '../../redux/reducer/product.reducer';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function CartScreen (props, {navigation}){
const [Dataproduct, setDataproduct] = useState([]);
const [DataAnsynStore, setDataAnsynStore] = useState([]);
const [isLoading, setisLoading] = useState(true);
const [countItemcart, setcountItemcart] = useState(0)
const [checkAll, setcheckAll] = useState(true);


const dispatch = useDispatch();
var sold = [];
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
    const getData = await AsyncStorage.getItem('CART');
    if(getData !== null){ 
        arr = JSON.parse(getData);
        const countCart = arr.length;
        const data1 = {"data": getData}
        const res = await GETAPI.postDataAPI('/order/getProductByCartApp',data1);
        console.log(res)
        setcountItemcart(countCart)
        dispatch(updateQuanityProduct(countCart))
        setDataproduct(res);
        setDataAnsynStore(arr);
        setisLoading(false);
    }else{
        setDataproduct([]);
        setcountItemcart(0);
        dispatch(updateQuanityProduct(0))
        setisLoading(false);
    }
    
}

const Increase = async(id,option)=>{
    const idInventory = {id : id};
    let qty = 0;
    const res = await GETAPI.postDataAPI('/product/getProductInventory',idInventory);
    for(let i = 0; i < res.length ; i++){
        if(res[i].size == option){
            qty = res[i].quanity-res[i].sold;
        }
    }
    // console.log(qty)
    let dataAnsynstore = DataAnsynStore;
    for(let i = 0; i < dataAnsynstore.length ; i++){
        if(dataAnsynstore[i].id == id && dataAnsynstore[i].option == option ){
            if(qty == 0){
                dataAnsynstore[i].quanity =0;
                Alert.alert('FashionHQ',`Products in stock are out of stock, please !!`)
            }else{
                if(dataAnsynstore[i].quanity >= qty){
                    Alert.alert('FashionHQ',`Only left in stock: ${qty} products, please !!`)
                }else if(dataAnsynstore[i].quanity >= 5){
                    Alert.alert('FashionHQ',`Maximum 5 products, please!!`)
                    // dataAnsynstore[i].quanity +=1;
                }else{
                    dataAnsynstore[i].quanity +=1;
                }
            }

        }
    }

    await AsyncStorage.setItem('CART',JSON.stringify(dataAnsynstore));
    getDataAnsynStore()
}

const Reduce = async(id,option)=>{
    let dataAnsynstore = DataAnsynStore;
    console.log(id)
    console.log(option)
    console.log(dataAnsynstore)
    for(let i = 0; i < dataAnsynstore.length ; i++){
        if(dataAnsynstore[i].id == id && dataAnsynstore[i].option == option  ){
            if(dataAnsynstore[i].quanity == 1){
                Alert.alert('FashionHQ','You want to delete this product!!!',[
                    {
                        text: 'Cancel',
                        style:'cancel'
                    },
                    {
                        text: "Ok",
                        onPress:async()=>{
                            if(dataAnsynstore.length > 1){
                                for(let j = 0;j<=dataAnsynstore.length-1;j++){ 
                                    if(dataAnsynstore[j].id==id){
                                        dataAnsynstore.splice(j,1)
                                        await AsyncStorage.setItem("CART",JSON.stringify(dataAnsynstore))
                                        getDataAnsynStore()
                                    }
                                }
                            }else{
                                removeAllCart();
                            }
                        }  
                    }
                ])
            }else{
                dataAnsynstore[i].quanity -=1;
            }

        }
    }
    await AsyncStorage.setItem('CART',JSON.stringify(dataAnsynstore));
    getDataAnsynStore()
}

const Check = async(id,option)=>{
    const idInventory = {id : id};
    let qty1 = 0;
    const res = await GETAPI.postDataAPI('/product/getProductInventory',idInventory);
    for(let i = 0; i < res.length ; i++){
        if(res[i].size == option ){
            qty1 = res[i].quanity-res[i].sold;
        }
    }
    let dataAnsynstore = DataAnsynStore;
    for(let i = 0; i < dataAnsynstore.length ; i++){
        if(dataAnsynstore[i].id == id && dataAnsynstore[i].option == option  ){
            if(dataAnsynstore[i].quanity <= qty1 ){//nếu = sản phẩm trong kho thì true
                dataAnsynstore[i].status = true;
            }else{//nếu lớn hơn số lượng trong kho thì bằng max của qty.
                Alert.alert('FashionHQ',`Only left in stock: ${qty1} products, please !!`)
                dataAnsynstore[i].quanity = qty1;
                dataAnsynstore[i].status = true;
            }
            
        }
    }
    await AsyncStorage.setItem('CART',JSON.stringify(dataAnsynstore));
    getDataAnsynStore()
    setcheckAll(true)
}

const UnCheck = async(id,option)=>{
    let dataAnsynstore = DataAnsynStore;
    for(let i = 0; i < dataAnsynstore.length ; i++){
        if(dataAnsynstore[i].id == id && dataAnsynstore[i].option == option){
            dataAnsynstore[i].status = false;
        }
    }

    await AsyncStorage.setItem('CART',JSON.stringify(dataAnsynstore));
    getDataAnsynStore()
    setcheckAll(true)
}

const UnCheckall = async()=>{
    let dataAnsynstore = DataAnsynStore;
    for(let i = 0; i < dataAnsynstore.length ; i++){
            dataAnsynstore[i].status = false;       
    }
    await AsyncStorage.removeItem("CART")
    await AsyncStorage.setItem('CART',JSON.stringify(dataAnsynstore));
    console.log(dataAnsynstore)
    getDataAnsynStore()
    setcheckAll(true)
}

const Checkall = async()=>{
    let dataAnsynstore = DataAnsynStore;
    for(let i = 0; i < dataAnsynstore.length ; i++){
            dataAnsynstore[i].status = true;       
    }
    await AsyncStorage.removeItem("CART")
    await AsyncStorage.setItem('CART',JSON.stringify(dataAnsynstore));
    console.log(dataAnsynstore)
    getDataAnsynStore()
    setcheckAll(false)
}

const CartTotal = (data)=>{
    var tong=0;
    
    for( let item = 0;item<=data.length-1;item++){
        if (data[item].status==true){
            if(data[item][0].promotional > 0){
                tong +=(data[item][0].promotional*data[item].quanity);
            }else{
                tong +=(data[item][0].price*data[item].quanity);
            }
        }
        
    }
    return tong;
}


const removeAllCart = async()=>{
    try {
    await AsyncStorage.removeItem("CART")
        setDataAnsynStore([])//render lai
        getDataAnsynStore()// kg chiu render lai
    } catch (error) {
        console.log(error)
        
    }
}
const DeleteAll =()=>{
    if(DataAnsynStore.length == 0){
        alert('FashionHQ','Your shopping cart is empty !!')

    }else{
        Alert.alert('FashionHQ','You want to delete the shopping cart !!!',[
            {
                text: 'Cancel',
                style:'cancel'
            },
            {
                text: "Ok",
                onPress:()=>{removeAllCart()
                        }
                }
            ])
    }
}

const renderItem = ({item, index})=>{
    // console.log('2343')
    return(
        <View style={{ marginBottom:  3}}>
            <View style={styles.wrapItem}>
                {item.status == false ? 
                <>
                <TouchableOpacity 
                    onPress={()=>{
                        Check(item[0].id,item.option)
                    }}
                    style={{ justifyContent:'center',alignItems:'center',paddingLeft:10 }}
                >
                    <View>
                        <Image 
                            source={ require('../../assets/icons/uncheck.png')}
                            resizeMode="contain" style={{ width: windowW*0.055, height: windowH*0.055 }} 
                        /> 
                    </View>
                </TouchableOpacity>
                </>:
                <>
                <TouchableOpacity 
                    onPress={()=>{UnCheck(item[0].id,item.option)}}
                    style={{ justifyContent:'center',alignItems:'center',paddingLeft:10 }}
                >
                    <View>
                        <Image source={ require('../../assets/icons/check.png')}
                        resizeMode="contain" style={{ width: windowW*0.055, height: windowH*0.055 }} /> 
                    </View>
                </TouchableOpacity>
                </>}
                <TouchableOpacity onPress={()=>{
                    props.navigation.navigate('productDetail',{
                        idProduct : item[0].id,
                        idProductType : item[0].idProductType
                        })
                    }}>
                    <Image source={{uri:SetHTTP(item[0].image)}} resizeMode='contain'
                    style={{ width: windowW*0.25, height: windowH*0.11 }}/>  
                </TouchableOpacity>
                
                <TouchableOpacity 
                        onLongPress={()=>{
                            Alert.alert('FashionHQ','You want to delete this product !!',
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
                                                if(dataAnsynstore[j].id==item[0].id && dataAnsynstore[j].option==item.option) {
                                                    dataAnsynstore.splice(j,1)
                                                    await AsyncStorage.setItem("CART",JSON.stringify(dataAnsynstore))
                                                    getDataAnsynStore()
                                                
                                                }
                                            }
                                        }else{
                                            removeAllCart();
                                        }
                                    }
                                }
                            ])
                        }}
                        style={{ flexDirection: "column",flex:1}}>
                    <Text style={{ color: 'black', fontSize: 13, fontWeight: "bold" }}>{truncate(item[0].name)}</Text>
                    <View style={{ flexDirection: 'row',justifyContent: 'flex-start', marginTop : 10  }}>
                        <Text style={{ color: 'grey', fontSize: 13,  }}>Size/Color : </Text>
                        <Text style={{ color: 'grey', fontSize: 13, marginLeft: 10  }}>{item.option}</Text>
                    </View>
                    <View style= {{ flexDirection: 'row',justifyContent: 'space-between',width:'100%', marginTop: 10 }}>
                        <View style= {{ flexDirection: 'row'}}>
                            {item[0].promotional > 0 ? 
                            <>
                            <Text style={{ color: 'grey', fontSize: 13, textDecorationLine: "line-through"  }}>{FormatNumber(item[0].price)} đ</Text>
                            <Text style={{ color: 'red', fontSize: 13, marginLeft: 10  }}>{FormatNumber(item[0].promotional)} đ</Text>
                            </>:
                            <Text style={{ color: 'red', fontSize: 15,  }}>{FormatNumber(item[0].price)} đ</Text>
                            }
                        </View>
                        <View style= {{ flexDirection: 'row', marginRight: 10}}>
                                <TouchableOpacity onPress={()=>{Reduce(item[0].id, item.option)}}>
                                    <Text style={{ width:20 , textAlign: "center", borderWidth: 0.5, borderColor: 'gray',fontWeight: 'bold', borderRadius: 40, color:'black', backgroundColor:"rgba(180, 180, 180, 0.2)"}}> - </Text> 
                                </TouchableOpacity>
                                    <Text style={{ width: windowW*0.08 , textAlign: "center",fontWeight: 'bold'}}>{item.quanity}</Text>
                                <TouchableOpacity onPress={()=>{Increase(item[0].id,item.option)}}>
                                    <Text style={{ width: 20 , textAlign: "center", borderWidth: 0.5, borderColor: 'gray',fontWeight: 'bold', borderRadius: 40, color:'black', backgroundColor:"rgba(180, 180, 180, 0.2)"}}> + </Text>
                                </TouchableOpacity>
                        </View>
                    </View>   
                </TouchableOpacity>
                
            </View>
        </View>
    )
}


    return(
        <View style={styles.container}>
            {/* <StatusBar backgroundColor="white" barStyle="dark-content"/> */}
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <Text style={{ color: 'black', fontWeight: "bold", fontSize:18, marginLeft: 15}}>My cart (</Text>
                    <Text style={{ color: 'red', fontWeight: "bold", fontSize:18, }}>{countItemcart}</Text>
                    <Text style={{ color: 'black', fontWeight: "bold", fontSize:18,}}>)</Text>
                </View>

                <TouchableOpacity onPress={()=>{DeleteAll()}} style={{ paddingRight:15 }}>
                    <AntDesign name="delete" size={20} color="black" />

                </TouchableOpacity>
        </View>
        {isLoading === true ? 
        <View style={{ flex:1, justifyContent:'center', alignContent:'center' }}>
            <LoadingCircle/>
        </View>:
        <> 
            {Dataproduct.length == 0 ?  
            <View style={{  flex:1,
                            flexDirection: 'column',
                            justifyContent:"center", 
                            alignContent: 'center', 
                            alignItems:'center',
                             }}>
                <LottieView  
                    source={require('../../assets/lottierfiles/empty-cart.json')}
                    style={{ width:windowW*0.5, height:windowH*0.5}}
                    autoPlay
                    loop                   
                />
            </View>:
            <View style={{  flex: 1 }}>
               <FlatList
                data = {Dataproduct}
            
                keyExtractor= {(item,index)=>index}
                renderItem={renderItem}
            />
            </View>}
        </>}

                <View style={styles.BottompaymentItem}>
                    <View style={{ flexDirection: 'row', justifyContent: "flex-start", alignItems:'center',paddingVertical: 10, paddingLeft: 15 }}>
                        {checkAll ? 
                        <>
                        <TouchableOpacity onPress={()=>{Checkall()}}>
                            <Image source={ require('../../assets/icons/uncheck.png')}
                            resizeMode="contain" style={{ width: windowW*0.055, height: windowH*0.055 }} /> 
                        </TouchableOpacity>
                        </>:
                        <>
                        <TouchableOpacity onPress={()=>{UnCheckall()}}>
                           <Image source={ require('../../assets/icons/check.png')}
                            resizeMode="contain" style={{ width: windowW*0.055, height: windowH*0.055 }} /> 
                         </TouchableOpacity>
                        </>}
                        <Text style={{ marginLeft : 10 , fontSize: 13}}>All</Text>
                    </View>
                    <View style={{ flexDirection: 'column',flex:1 , paddingVertical: 5}}>
                        <View style={{ flexDirection: 'row',justifyContent: 'flex-end' }}>
                            <Text style={{color: 'green', fontSize : 12}}>Total : </Text>
                            <Text style={{color: 'red'}}> {FormatNumber(CartTotal(Dataproduct))} đ </Text>
                        </View>
                        <View style={{ flexDirection: 'row',justifyContent: 'flex-end' }}>
                            <Text style={{ marginLeft : 10 , fontSize: 10}}>Transport fee : </Text>
                            {CartTotal(Dataproduct) > 0 ? <Text style={{color: 'red'}}> {FormatNumber(30000)} đ </Text> : 
                            <Text style={{color: 'red'}}> 0 đ </Text> }
                            
                            
                        </View>
                        
                    </View>
                    <TouchableOpacity onPress={()=>{
                            let arr = [];
                            console.log(CartTotal(Dataproduct))
                            for( let item = 0;item<=Dataproduct.length-1;item++){
                                if (Dataproduct[item].status==true && Dataproduct[item].quanity > 0 ){
                                    arr.push(Dataproduct[item]);
                                    
                                }
                            }
                            if(arr.length == 0 ){
                                Alert.alert('FashionHQ','Please select product before payment!')
                            }else{
                                props.navigation.navigate('checkout',
                                {
                                    'data': arr,
                                    'CartTotal': CartTotal(Dataproduct),

                                })
                            }


                        
                    }}>
                    <LinearGradient
                        colors={['#7C007C','#B16FD8','#CB9ADC' ]}
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                        style={{ 
                            width: windowW*0.32, 
                            height: 38, 
                            marginTop: 6, 
                            marginRight: 5, 
                            flexDirection:'row', 
                            justifyContent:"center",
                            alignItems:"center",
                            alignContent:'center',
                            borderRadius: 40, 
                            marginLeft:5
                        }}
                    >
                        <Text style={{ fontWeight:'bold', color:'white' }}>
                            Payment
                        </Text>
                    </LinearGradient>
                    </TouchableOpacity>
                </View>
           
        </View>
    )
}

const windowW = Dimensions.get('window').width;
const windowH = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    BottompaymentItem:{
        flexDirection: "row",
        justifyContent: "flex-start",
        bottom: 0,
        position: 'absolute',
        backgroundColor: 'green',
        width: windowW,
        height: 50,
        borderTopWidth: 1,
        borderTopColor:'#D3D3D3',
        backgroundColor: 'white'
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
        paddingTop:10
    },
    wrapItem: {
        backgroundColor:'white',
        flexDirection: 'row',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        paddingBottom: 8,
        shadowColor:'#000',
        shadowOffset:{
            width: 0,
            height:2
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 4,
        paddingTop: 10,
        borderRadius: 5,
        backgroundColor:'white',
        
    }
})