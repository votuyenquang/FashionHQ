import React,{useState,useEffect} from "react";
import { SafeAreaView,StyleSheet,StatusBar,Animated,Dimensions,Alert,ToastAndroid} from "react-native"; 
import HeaderScreen from "./headerScreen";
import CategoryScreen from "../products/category";
import VirtualizedView from "../../util/VirtualizedView";
import ProductHot from "../products/productHot";
import ProductNew from "../products/productNew";
import GetfullProduct from "../products/getfullProduct";
import Flashsales from "../products/flashsale";
import RecommendationProduct from "../products/recommendation";

import * as GETAPI from '../../util/fetchApi';
import { SetHTTP } from "../../util/setHTTP";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {updateQuanityProduct,updatequantityFavorite} from '../../redux/reducer/product.reducer';
import { useDispatch } from "react-redux";
import {getUser} from '../../util/getUser';
import {updateUser} from '../../redux/reducer/user.reducer';



export default function HomeScreen({navigation}){
    const [bgcolorStatusBar, setbgcolorStatusBar] = useState("#764FE2");
    const [colorSearch, setcolorSearch] = useState(null);
    const [DataProducthot, setDataproducthost] = useState([]);
    const [DataProductFlashsale, setDataProductFlashsale] = useState([]);
    const [Datacategory, setDatacategory] = useState([]);
    const [bgHeader, setbgHeader] = useState(false);
    const [textsearch, settextsearch] = useState('FashionHQ WELCOME !!!');
    const [DataProductNew, setDataProductNew] = useState([]);//data hiển thị sản phẩm mới nhất trong box
    const [DataProductNewImageSlideBox, setDataProductNewImageSlideBox] = useState([]);//hình ảnh hiển thị lên slide
    const [DataProductNewSlideBox, setDataProductNewSlideBox] = useState([]);//data khi click vào slider
    const [Datafullproduct, setDatafullproduct] = useState([])
    const dispatch = useDispatch();
    const [statusUser, setstatusUser] = useState(false);
    
    //Animation header
    const scrollY = new Animated.Value(0);
    const diffClamp = Animated.diffClamp(scrollY,0,50);
    const translateY = diffClamp.interpolate({
        inputRange:[0,50],
        outputRange:[0,-50]
    })
    useEffect(() => {
        navigation.addListener('focus',()=>{
            checkUser()
        })
        
    })
    useEffect(() => {
      
        getCategory();
        getProductSale();
        getdatasale();
        getDataBox();
        getDatafullProduct();
        getHistory();      
        updateQuanityCart();
        updataFavorite();
        
 
       
    },[0])
    const checkUser = async()=>{
        const token =  await AsyncStorage.getItem('@token');
        // console.log(token)
        if(token===undefined||token===null){
            setstatusUser(false);
            dispatch(updateUser({}));
        }else{ 
            const status = await getUser(token,dispatch);
            if(status===false){
                ToastAndroid.show("Login session expired !", ToastAndroid.SHORT);
                setstatusUser(false)
            }else if(status=="block"){
                Alert.alert('FashionHQ','Your account is locked !!')
                setstatusUser(false)
            }else{
               
                setstatusUser(true);
            }
        }
    }
    const updateQuanityCart = async()=>{
        const getData = await AsyncStorage.getItem('CART');
        if(getData !== null){
           const arr = JSON.parse(getData);
            dispatch(updateQuanityProduct(arr.length))
        }else{
            dispatch(updateQuanityProduct(0))
        }
    }

    const updataFavorite = async()=>{

        const data = await AsyncStorage.getItem('FAVORITE');
        if(data != null){
            const arr = JSON.parse(data);
            dispatch(updatequantityFavorite(arr.length))
        }else{
            dispatch(updatequantityFavorite(0))
        }
    }
    
    const getHistory = async()=>{
        const history = await AsyncStorage.getItem('SEARCHHISTORY');
        
        if(history!==null){
            const arrH = JSON.parse(history)
            if(arrH.length !== 0){
                const interval = setInterval(()=>{
                    const random = Math.floor((Math.random()*arrH.length));
                    settextsearch(arrH[random].name)
                    // console.log(arrH[random].name)
                },5000);
                return () => {cleanup(interval)}                   
            }
            
        }
    }

    const getProductSale= async()=>{    
        const res = await GETAPI.getAPI('/product/getTopProductSale');
        setDataproducthost(res);

    }
    const getdatasale= async()=>{
        const res = await GETAPI.getAPI('/product/getproductSale')
        setDataProductFlashsale(res) 
    }
    const getCategory = async()=>{
        
        const res = await GETAPI.getAPI('/product/getCategory');
        // console.log("chay ne ",res )
        setDatacategory(res)
    }
    const getDataBox = async()=>{
        const ArrDtaImage = [];
        const ArrDtaProductImage = [];
        const ArrProductNew = [];
        const res = await GETAPI.getAPI('/product/getProductNew/1');
        // console.log('resa', res)
        // lấy 4 sản phẩm đầu tiên
        for(let i = 0; i <= 4; i++){
            ArrDtaProductImage.push(res?.item[i])
            ArrDtaImage.push(SetHTTP(res?.item[i].image))
        }
        // lấy 3 sản phẩm sau cùng
        for(let j = 5; j <= res?.item.length-1; j++){
            ArrProductNew.push(res?.item[j])
        }
        // console.log(ArrProductNew)
        setDataProductNewImageSlideBox(ArrDtaImage)
        setDataProductNew(ArrProductNew)
        setDataProductNewSlideBox(ArrDtaProductImage)
        
    }

    const getDatafullProduct = async()=>{
        const res = await GETAPI.getAPI('/product/getFullProduct');
        // console.log("Full Product :",res)
       setDatafullproduct(res);
      
    }



    //Animation header
    const handleSetValueScrollY = (e)=>{
        const value = e.nativeEvent.contentOffset.y;
        if(value<0){
          scrollY.setValue(0)
        }else{
            if(value>windowH*0.9){
                setbgcolorStatusBar("white")
                setcolorSearch("white")
                setbgHeader(true)
            }else{
                setbgcolorStatusBar("#764FE2")
                setcolorSearch(null)
                setbgHeader(false) 
            }
            scrollY.setValue(value)
        } 
    }
   
  
    return(
        
            <SafeAreaView style= {{ flex: 1 }}>
               
                {/* barStyle="dark-content" */}
                <StatusBar  backgroundColor={bgcolorStatusBar} 
                            animated 
                            barStyle={bgcolorStatusBar=="white"?"dark-content":"light-content"}/>
                    <Animated.View style={{
                                    transform:[{translateY:translateY}], 
                                    position:'absolute',
                                    top:0,
                                    left:0,
                                    right:0,
                                    zIndex:1
                                    }} >
                    
                        <HeaderScreen 
                            navigation={navigation} 
                            textsearch={textsearch} 
                            hideSearch={true} 
                            heightHeader={windowH*0.145} 
                            colorSearch={colorSearch} 
                            bgWhite={bgHeader}
                            statusUser={statusUser}
                        />
                    </Animated.View>
                
                    <VirtualizedView setValue={handleSetValueScrollY} >      
                        <CategoryScreen navigation={navigation} Data={Datacategory} />
                        <ProductHot Data={DataProducthot} navigation={navigation}/>
                        <RecommendationProduct Data={DataProductFlashsale} navigation={navigation}/>
                        <Flashsales Data={DataProductFlashsale} navigation={navigation}/>
                        <ProductNew images ={DataProductNewImageSlideBox} Data = {DataProductNewSlideBox} navigation={navigation} DataNewproduct= {DataProductNew}/>
                        <GetfullProduct DatafullProduct={Datafullproduct} navigation={navigation} />

                    </VirtualizedView>
                {/* </SkeletonContent> */}
            </SafeAreaView>

    )
    
}
const windowH = Dimensions.get('window').height;

const styles = StyleSheet.create({
    fakebox:{
        height : 250,
        margin : 16,
        borderRadius:18
    },
    scroll_view:{
        flex:1
    },
    
})

