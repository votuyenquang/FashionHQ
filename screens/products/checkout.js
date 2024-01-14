import React,{useEffect,useState,useRef} from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView,Image, TextInput, TouchableOpacity,Alert} from "react-native"; 
import { useSelector } from "react-redux";
import LottieView from "lottie-react-native";
import * as GetAPI from '../../util/fetchApi';
import LoadingCircle from '../StartScreens/loadingCircle'
import { SetHTTP } from "../../util/setHTTP";
import { FormatNumber } from "../../util/formatNumber"; 
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {updateQuanityProduct} from '../../redux/reducer/product.reducer';
import { useDispatch } from "react-redux";
import * as yup from 'yup';
import { Formik } from 'formik';
const paymentValidationSchema = yup.object().shape({
    name: yup
        .string()
        .min(5, ({ min }) => `Full name has at least ${min} characters`)
        .required('Enter your name!!')
    ,
    email: yup
        .string()
        .email("Please enter the correct Email format")
        .required('Enter Email !!')
    ,  
    phone: yup
        .string()
        .min(10, ({ min }) => `Phone number has at least ${min} characters`)
        .required("Please enter the phone number!")
    , 
    address: yup
        .string()
        .min(5, ({ min }) => `The address has at least ${min} characters`)
        .required('Please enter your address!!')
    ,
})
export default function CheckOut (props,{navigation}){

    const [DataInforUser, setDataInforUser] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    const [idUser, setidUser] = useState('');
    const [message, setmessage] = useState('');
    const [methodpayment, setmethodpayment] = useState(2);
    const [codeSale, setcodeSale] = useState('');
    const [DataSale, setDataSale] = useState([]);
    const [promotionPrice, setpromotionPrice] = useState(0);

    const dispatch = useDispatch();
    const Data = props.route.params.data;
    const TotalPRD = props.route.params.CartTotal;
    // console.log(Data)
    const currentUser = useSelector(state=>state.userReducer.currentUser);
    let formRef = useRef();

    useEffect(() => {
        getInforUser();
        setidUser(currentUser.id);

    }, [])

    const getInforUser = async()=>{
        if(currentUser.id != undefined){
            const res = await GetAPI.postDataAPI('/user/getInforUser',{'idUser': currentUser.id})
            console.log(res)
            setDataInforUser(res);
            setisLoading(false);      
            formRef.current.setValues({...res[0]})
            if(res[0].phone==null){
                formRef.current.setValues({...formRef.current.values,phone:""})
            }
            if(res[0].address==null){
                formRef.current.setValues({...formRef.current.values,address:""})
            }
        }else{
            setDataInforUser([]);
            setisLoading(false);
        }
    }

const GetCodeSale = async()=>{
    if(codeSale===""){
        Alert.alert('FashionHQ',"You have not entered the promotional code yet !")
    }else{
        const res = await GetAPI.postDataAPI("/order/getSaleByCode",{"code":codeSale.toUpperCase()})
        if(res.msg){
            if(res.msg==="Sale not exist"){
                Alert.alert('FashionHQ',"This code does not exist !")
            }
        }else if(res!=undefined){
            handleDay(res[0]);
        }
    }
}
const handleDay = (data)=>{
    const currentTime = Date.now();
    const timeStart = new Date(data.date_start);
    const timeExpired = new Date(data.expired);
    if(currentTime<timeStart){
        Alert.alert('FashionHQ',"Event time has not started yet !")
    }else if(currentTime>timeExpired){
        Alert.alert('FashionHQ',"The event has ended !")
    }else if(data.quanity-data.used===0){
        Alert.alert('FashionHQ',"Số lượng mã này đã hết !")
    }
    else{
        setDataSale(data);
        setpromotionPrice(data.cost_sale);
    }
}


const TotalPrice = (item)=>{
    let Total = 0;
    if(item[0].promotional > 0){
        Total = item[0].promotional*item.quanity;
    }else{
        Total = item[0].price*item.quanity;
    }
    return Total;
}

const Order = async()=>{
    let DataProduct = Data;
    let idSale = null;
    let total = TotalPRD+5;
    const {name,email,address,phone} = formRef.current.values
    if(promotionPrice > 0){
        idSale= DataSale.id;
        total = TotalPRD-promotionPrice+5;
    }
    const data = {
        "name": name,
        "address": address,
        "email" : email,
        "phone" : phone,
        "total_price":total,
        "message":message,
        "dataProduct":DataProduct,
        "methodPayment":methodpayment,
        "user": idUser,
        "idSale":idSale,
    }
    const res = await GetAPI.postDataAPI("/order/addBill",data);
    if(res.msg){
        if(res.msg==="success"){
            Alert.alert('FashionHQ','Order Success ! Thank you for your trust and support !!!');
            const dataAsycn = await AsyncStorage.getItem('CART');
            let arr = JSON.parse(dataAsycn);
            if(DataProduct.length === arr.length){
                await AsyncStorage.removeItem('CART');
                dispatch(updateQuanityProduct(0));
            }else{
                for(let i = 0 ; i < DataProduct.length;i++){
                    for(let j = 0; j <arr.length; j++ ){
                        if(DataProduct[i][0].id === arr[j].id){
                            arr.splice(j,1);
                        }
                    }
                }
                dispatch(updateQuanityProduct(arr.length));
                // await AsyncStorage.removeItem('CART');
                await AsyncStorage.setItem('CART',JSON.stringify(arr));
            }


            props.navigation.navigate('home');
        }else{
            console.log(res.msg)
        }
    }
    
}
const renderitem = (item)=>{
    return(
        <View key={item[0].id} 
        style={styles.ItemProduct}>
            <View style={{ flexDirection:'row',
                           justifyContent: 'flex-start',
                           }}>
                    <Image source={{uri:SetHTTP(item[0].image)}} resizeMode='contain'
                             style={{ width: windowW*0.16, height: windowH*0.12 }}/> 
                    <View style={styles.infoProduct}>
                        <Text style={{ fontWeight:'bold',color: 'black',maxWidth: windowW*0.65 }}> {item[0].name} </Text>
                        <View style={{ flexDirection:'row', justifyContent:'flex-start' , marginTop:5}}>
                            <Text style={{ color: 'black' }}> Size/Color:  </Text>
                            <Text style={{ color: 'black', marginLeft : 10 }}> {item.option}  </Text>
                        </View>
                        <View style={{ flexDirection:'row', justifyContent:'flex-start' ,marginTop:5}}>
                            <Text style={{ color: 'black' }}> Quantity :  </Text>
                            <Text style={{ color: 'black', marginLeft : 10, fontWeight:'bold' }}> X{item.quanity}  </Text>
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'flex-start' ,marginTop:5}}>
                            <Text style={{ color: 'red' }}> Total :  </Text>
                            <Text style={{ color: 'red', marginLeft : 10, fontWeight:'bold' }}> {FormatNumber(TotalPrice(item))} $</Text>
                        </View>

                    </View>
            </View>

        </View>
    )
}
    return(
        <View style={ styles.container}>
            <View style={styles.header}>
                <Text style={{ fontWeight: 'bold' ,paddingHorizontal: 15, color:'black',fontSize:16 }}>Check your order</Text>
            </View>
           
            <ScrollView style={{ marginBottom: 70, }}>
                <View style={{ marginTop: 10,  }}>
                    <Text style={{ fontWeight:'bold', fontSize: 13, color: 'black', marginLeft: 10, marginBottom: 5}}>Delivery address</Text>
                </View>
                    {isLoading ? 
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
                            <LoadingCircle/>
                        </View>:
                        <View style={styles.inforCustomer}>
                        <Formik
                            validationSchema={paymentValidationSchema}
                            innerRef={formRef}
                            initialValues={{ email:'',name: '',phone:'',address:'' }}
                            onSubmit={()=>Order()}
                        >
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            errors,
                            isValid,
                            touched
                        }) => (
                        <View>
                            <View>
                                <LottieView  
                                    source={require('../../assets/lottierfiles/location-lottie-animation.json')}
                                    style={{ width:45, height:30}}
                                    autoPlay
                                    loop           
                                />
                            </View>
                            <View style={{ flexDirection: 'column', justifyContent: 'flex-start',alignItems:'center',padding:10 }}>
                                <TextInput 
                                    placeholder='Name' 
                                    style={styles.textinput}
                                    value={values.name}
                                    onChangeText={handleChange('name')}
                                    onBlur={handleBlur('name')}
                                />
                                {(errors.name &&touched.name)&&
                                    <Text style={styles.errorText}>{errors.name}</Text>
                                }
                                <TextInput 
                                    placeholder='Phone'
                                    style={styles.textinput} 
                                    keyboardType="numeric" 
                                    value={values.phone}
                                    onChangeText={handleChange('phone')}
                                    onBlur={handleBlur('phone')}
                                />
                                {(errors.phone &&touched.phone)&&
                                    <Text style={styles.errorText}>{errors.phone}</Text>
                                }
                                <TextInput 
                                    placeholder='Email' 
                                    style={styles.textinput} 
                                    value={values.email}
                                    onBlur={handleBlur('email')}
                                    onChangeText={handleChange('email')}
                                    editable={currentUser.id===undefined}
                                />
                                {(errors.email &&touched.email)&&
                                    <Text style={styles.errorText}>{errors.email}</Text>
                                }
                                <TextInput 
                                    placeholder='Address'
                                    style={styles.textinput}
                                    value={values.address}
                                    onBlur={handleBlur('address')}
                                    onChangeText={handleChange('address')}
                                />
                                {(errors.address &&touched.address)&&
                                    <Text style={styles.errorText}>{errors.address}</Text>
                                }
                            </View>
                        </View>
                        )}
                            </Formik>
                        </View>
                    }
                    <View style={{ marginTop: 10, }}>
                        <Text style={{ fontWeight:'bold', fontSize: 13, color: 'black', marginLeft: 10, marginBottom: 5}}>Product information</Text>
                    </View> 
                    <ScrollView style={styles.wrapItem}>
                    {Data.map(e=>{
                            return(
                                renderitem(e)
                            )
                        })}
                    </ScrollView>
                    <View style={{ marginTop: 5 }}>
                             <Text style={{ fontWeight:'bold', fontSize: 13, color: 'black', marginLeft: 10, marginBottom: 5}}>Promotion code </Text>
                    </View> 
                    {DataInforUser.length == 0  ? 
                        <View>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                    <TouchableOpacity onPress={()=>{props.navigation.navigate('login')}}>
                                        <Text style={{  fontSize: 13, color: 'green', marginLeft: 10}}>Login</Text>
                                    </TouchableOpacity>
                                    
                                    <Text style={{  fontSize: 13, color: 'red'}}> to receive this offer ! </Text>
                                </View>
                                <View style={{ flexDirection:'row', justifyContent:'flex-start',marginLeft: 8, marginTop: 5 }}>
                                    <TextInput placeholder='Enter promotion code'style={{width: windowW*0.75,height: 39, borderWidth: 0.5, borderColor: 'purple',borderRadius: 6, }} editable={false}/>
                                    <View style={{ borderRadius: 5,width:windowW*0.19,borderWidth:0.5, borderColor: 'purple', flexDirection:'column', justifyContent:'center', alignContent:'center',marginLeft: 5, }}>
                                        <Text style={{ color:'green', fontSize: 11,textAlign:'center' }}>APPLY</Text>
                                    </View>
                                 </View>
                        </View>:
                        <View style={{ flexDirection:'row', justifyContent:'flex-start',marginLeft: 8, marginTop: 5 }}>
                                    <TextInput placeholder='Enter promotion code'
                                                style={{width: windowW*0.75,height: 39, borderWidth: 0.5, borderColor: 'purple',borderRadius: 6, }}
                                                value={codeSale}
                                                onChangeText={setcodeSale}
                                                />
                                    <TouchableOpacity  onPress={()=>{GetCodeSale()}}
                                    style={{ borderRadius: 8,width:windowW*0.19,borderWidth:0.5, borderColor: 'purple', flexDirection:'column', justifyContent:'center', alignContent:'center',marginLeft: 5, }}>
                                        <Text style={{ color:'green', fontSize: 11,textAlign:'center' }}>APPLY</Text>
                                    </TouchableOpacity>
                        </View>}
                        {promotionPrice > 0 ? 
                            <View style={{ flex:1, flexDirection: 'row', justifyContent:'flex-start', marginHorizontal: 10, marginTop: 5 }}>
                                <Text style={{ color:'green' }}>You get a promotion </Text>
                                <Text style={{ color:'red' }}>{FormatNumber(promotionPrice) } $</Text>
                                <Text style={{ color:'green' }}> từ FashionHQ!!!</Text>
                            </View>:null}

                    <View style={{ marginTop: 5}}>
                            <Text style={{ fontWeight:'bold', fontSize: 13, color: 'black', marginLeft: 10, marginBottom: 5, marginTop: 5}}>Order value</Text>
                    </View> 
                    
                    <View style={{ ...styles.wrapItembill,width:'95%', flexDirection: 'row', justifyContent: 'space-between', padding : 10, marginBottom: 10}}>
                        <View style={styles.bill}>
                            <View style={{ flexDirection:'row' }}>
                                <Text style={{ color: 'grey', fontWeight:'bold', fontSize:13 , marginBottom: 10}}>Money (provisional)</Text>
                                <Text  style={{ color: 'grey' }}>({Data.length} sản phẩm) : </Text>
                            </View>
                            <Text style={{ color: 'grey', fontWeight:'bold', fontSize:13 , marginBottom: 10}}>Promotion:  </Text>
                            
                            <Text style={{ color: 'grey', fontWeight:'bold', fontSize:13 , marginBottom: 10}}>Transport fee  : </Text>
                            <Text style={{ color: 'red', fontWeight:'bold', fontSize:13 , marginBottom: 10}}>Total : </Text>
                        </View>           
                        <View style={{...styles.bill, alignItems:'flex-end'}}>
                        <Text style={{ color: 'grey', fontWeight:'bold', fontSize:13 , marginBottom: 10}}>{FormatNumber(TotalPRD)} $ </Text>
                        {promotionPrice <= 0 ? <Text style={{ color: 'grey', fontWeight:'bold', fontSize:13 , marginBottom: 10}}>0 $ </Text>:<Text style={{ color: 'grey', fontWeight:'bold', fontSize:13 , marginBottom: 10}}>-{FormatNumber(promotionPrice)} $</Text> }
                        
                        <Text style={{ color: 'grey', fontWeight:'bold', fontSize:13 , marginBottom: 10, borderBottomWidth: 0.5, borderColor: 'purple'}}>30,000 $ </Text>

                        {promotionPrice > 0 ? 
                            <Text style={{ color: 'red', fontWeight:'bold', fontSize:13 , marginBottom: 10}}>{FormatNumber(TotalPRD-promotionPrice+5)} $ </Text>:
                            <Text style={{ color: 'red', fontWeight:'bold', fontSize:13 , marginBottom: 10}}>{FormatNumber(TotalPRD+5)} $ </Text>
                        }
                        </View>
                    </View>
                    <View style={{ marginTop: 5}}>
                            <Text style={{ fontWeight:'bold', fontSize: 13, color: 'black', marginLeft: 10, marginBottom: 5, marginTop: 5 }}>Select a payment method</Text>
                            {methodpayment ==2 ? 
                            <ScrollView                            
                                    horizontal={true}
                                    style={{ flexDirection:'row', marginHorizontal: 10 }}>
                                    <TouchableOpacity  
                                            onPress={()=>{
                                                setmethodpayment(2);
                                            }}
                                            style={{...styles.wrapmethod, backgroundColor:'pink'}}
                                    >
                                            <Image source={require('../../assets/image/unnamed.png')} resizeMode='contain' style={{width: 35, height: 40}}/>
                                            <Text style={{ marginLeft: 20, }}>Payment on delivery</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity  
                                        onPress={()=>{
                                            setmethodpayment(1);
                                                }}
                                        style={styles.wrapmethod}>
                                        <Image source={require('../../assets/image/cart.jpg')} resizeMode='contain' style={{width: 35, height: 40}}/>
                                        <Text style={{ marginLeft: 20, }}>Payment via credit card </Text>
                                    </TouchableOpacity>
                                </ScrollView>
                                :
                                <ScrollView
                                    horizontal={true}
                                    style={{ flexDirection:'row', marginHorizontal: 10 }}>
                                <TouchableOpacity  
                                            onPress={()=>{
                                            setmethodpayment(2);
                                                }}
                                        style={{...styles.wrapmethod}}>
                                        <Image source={require('../../assets/image/unnamed.png')} resizeMode='contain' style={{width: 35, height: 40}}/>
                                        <Text style={{ marginLeft: 20, }}>Payment on delivery </Text>
                                </TouchableOpacity>
                                <TouchableOpacity  
                                    onPress={()=>{
                                        setmethodpayment(1);
                                            }}
                                    style={{...styles.wrapmethod, backgroundColor:'pink'}}>
                                    <Image source={require('../../assets/image/cart.jpg')} resizeMode='contain' style={{width: 35, height: 40}}/>
                                    <Text style={{ marginLeft: 20, }}>Payment via credit card </Text>
                                </TouchableOpacity>
                         </ScrollView>
                    }
                            
                    </View > 
                    <View style={{ marginTop: 5 }}>
                            <Text style={{ fontWeight:'bold', fontSize: 13, color: 'black', marginLeft: 10, marginBottom: 5, marginTop: 5 }}>Order notes</Text>
                            <TextInput value={message} onChangeText={setmessage} placeholder='Note for FashionHQ' style={{ height: 60, marginHorizontal: 12, borderWidth: 0.5, borderColor: 'red', borderRadius: 10}}/>
                    </View > 

            </ScrollView>
                <View style={styles.Vieworder}>
                    <View style={{ flexDirection:'row' , justifyContent:'center', alignContent:'center', alignItems:'center'}}>
                        <Text style={{ color:'#F45705', fontWeight: 'bold' }}>Total : </Text>

                        {promotionPrice > 0 ? 
                            <Text style={{ color: '#F45705', fontWeight:'bold', fontSize:13 }}>{FormatNumber(TotalPRD-promotionPrice+5)} $ </Text>:
                            <Text style={{ color: '#F45705', fontWeight:'bold', fontSize:13 }}>{FormatNumber(TotalPRD+5)} $ </Text>
                        }

                    </View>
                    <TouchableOpacity 
                        onPress={()=>{
                            if(formRef!==undefined){
                                formRef.current.handleSubmit();
                            }
                        }}
                    >
                        <LinearGradient
                            colors={['red','#F45705','#F79303' ]}
                            start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                            style={{ 
                                width: windowW*0.46, 
                                height: 40,
                                flexDirection:'row', 
                                justifyContent:"center",
                                alignItems:"center",
                                alignContent:'center',
                                borderRadius: 10, 
                                marginLeft:5
                            }}
                        >
                            <Text style={{ fontWeight:'bold', color:'white' }}>
                                Order
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                
                </View>
                
        </View>

    )
   
}
const windowH = Dimensions.get('window').height;
const windowW = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        
    },
    header:{
        height: 45,
        backgroundColor: '#F1F3F4',
        flexDirection:'row',
        alignContent: 'center',
        alignItems:'center',
        shadowColor: '#000',
        shadowOffset:{
            width:0,
            height: 2,
        },
        shadowOpacity: 0.45,
        shadowRadius: 5,
        elevation: 5

    },
    inforCustomer:{
        borderRadius:6,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        margin: 10,
        padding: 5,
        shadowColor: '#000',
        shadowOffset:{
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 2
    },
    address:{
        marginHorizontal: 15
    },
    wrapItem:{ 
            flex:1,
            marginTop:10,
            marginHorizontal: 10, 
            borderRadius: 6,
            shadowColor: '#000',
            shadowOffset:{
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.5,
            shadowRadius: 3,
            elevation: 2,
            marginBottom: 20
            
            },
            ItemProduct:{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 10,
                borderBottomWidth: 0.5,
                borderColor: '#D3D3D3',
            },
            infoProduct:{
                flexDirection: 'column',
                justifyContent: 'flex-start', 
                marginLeft: 10,              
            },
    textinput:{
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 5,
        width: windowW*0.8,
        height: 35,
        marginVertical: 5,
        paddingLeft:10
    },
    bill:{
        
        flexDirection:'column',

    },
    wrapItembill:{ 
        flex:1,
        marginTop:10,
        marginHorizontal: 10, 
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset:{
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 2,
        marginBottom: 20
        
        },
    Vieworder:{ 
        position:'absolute',
        flex: 1, 
        backgroundColor:'#F1F3F4',
        height: 50,
        width:windowW,
        bottom:0,
        flexDirection:'row',
        justifyContent: "space-between",
        borderTopColor:'#D3D3ED',
        borderTopWidth:0.5,
        alignContent:'center',
        alignItems: 'center',
        paddingHorizontal: 15

    },
    wrapmethod:{
        width: windowW*0.8,
        height: 60, 
        borderRadius: 10,
        marginRight:10,
        padding: 10,
        shadowColor:'#000',
        shadowOffset:{
            width:0,
            height:2
        },
        shadowOpacity: 0.45,
        shadowRadius: 5,
        elevation: 2,
        marginBottom: 15,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignContent:'center',
        alignItems:'center'

    },
    errorText: {
        marginLeft:10,
        fontSize: 14,
        color: 'red',
    },
})
