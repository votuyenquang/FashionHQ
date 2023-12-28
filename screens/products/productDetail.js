import React, { useState, useEffect, createRef } from 'react';
import { View, Text, StyleSheet ,Image,Dimensions, ScrollView,TouchableOpacity,StatusBar, Alert } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import ActionSheet from "react-native-actions-sheet";
import HeaderScreen from '../NavigatorBottom/headerScreen';
import * as GETAPI from '../../util/fetchApi';
import {SliderBox} from 'react-native-image-slider-box';
import { SetHTTP } from '../../util/setHTTP';
import { FormatNumber } from '../../util/formatNumber';
import LoadingCircle from '../StartScreens/loadingCircle';
import Star from 'react-native-star-view';
import LottieView from "lottie-react-native";
import RenderHtml from 'react-native-render-html';
import Carousel from 'react-native-snap-carousel';
import truncate from '../../util/truncate';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Check } from '../../util/checkProduct';
import ModalFavorite from '../StartScreens/modal';
import {updateQuanityProduct, updatequantityFavorite} from '../../redux/reducer/product.reducer';
import { useDispatch } from "react-redux";
const actionSheetRef = createRef();
const ActionSheetPopup = React.memo(props => {
    const {image,name} = props.data
    const dataenventory = props.dataenventory;
    const quantity = props.quantity;
    const quantityDisplayScreen = props.quantityDisplayScreen;
    return(
    <View>
        <ActionSheet ref={actionSheetRef}>
            <View style= { styles.Actionsheet}>
                <View style={{ flexDirection: 'row',
                        justifyContent: 'flex-start',
                        marginHorizontal: 15,
                        marginVertical: 7,
                        borderBottomWidth: 0.5,
                        borderColor: '#D3D3D3',
                        width: windowW*0.33,
                        }}>
                
                    <Image source={{ uri: SetHTTP(image) }} resizeMode='cover' 
                    style={{ width: windowW*0.33, height: windowH*0.20,}}
                    />
                    <View style={{ flexDirection:'column',
                                    justifyContent: 'flex-start',
                                    marginLeft:15,
                                    width: windowW*0.64}}>
                        <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', paddingRight: 15 }}>{name}</Text>
                    </View>
                </View>
                <View 
                    style = {{ flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: 5,
                                    marginLeft: 10,
                                    alignContent: 'center'       
                            }}
                >
                        <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold',marginTop : 12}}>  Size/Color :</Text>

                        <Picker
                            selectedValue={props.selectValue}
                            style={{ height: 40, width: 150}}
                            placeholder="Select Size/Color"
                            onValueChange={(itemValue, itemIndex) => 
                                {
                                // xét lại props cho value option và số lươngj sau khi chọn value
                                props.setSelectedValue(itemValue)
                                props.setquantity( dataenventory[itemIndex].quanity-dataenventory[itemIndex].sold)
                                //nếu chọn lại size xét lại số lượng
                                props.setquantityDisplayScreen(1) 
                                }}
                        >
                            {
                            dataenventory.map((item)=>{
                                
                                return(
                                    <Picker.Item key={item.size}  label={item.size} value ={item.size}/>                                                              
                                )
                            })}                      
                        </Picker>
                    </View>
                    <View style= {{ flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        marginTop: 5,
                                        marginLeft: 15 }}>
                            <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold' }}>Product is still in stock :</Text>
                            <Text style={{ fontSize: 16 }}> {quantity} product</Text>
                    </View>
                    <View style = {{ flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        marginTop: 20,
                                        marginLeft: 15
                                        }}>
                            <Text style={{ color: 'red', fontSize: 18, fontWeight: 'bold' }}>Quantity:</Text>
                            <View style ={{ flexDirection: 'row', justifyContent:'flex-start',marginLeft : 90 }}>
                                <TouchableOpacity onPress={()=>{props.Reducer()}}>
                                        <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold', textAlign:'center', borderWidth: 1, borderColor: 'red', width: 35}}>-</Text>
                                </TouchableOpacity>
                                
                                        <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold', textAlign:'center', borderWidth: 1, borderColor: '#764FE2', width: 60}}>{quantityDisplayScreen}</Text>
                                <TouchableOpacity onPress={()=>{props.Increase()}}>
                                        <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold', textAlign:'center', borderWidth: 1, borderColor: 'red', width: 35}}>+</Text>
                                </TouchableOpacity>

                            </View>
                    </View>
            </View>
                {dataenventory.length == 0 ? 
                <>
             <TouchableOpacity  onPress ={()=>{actionSheetRef.current?.hide(); }} >
                <View style={ styles.btnaddcartPopUp}>
                    <View style={styles.btnaddNotEnventory} >
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold',marginTop: 8 }}>This product is out of stock</Text>
                    </View>
                </View>
            </TouchableOpacity>
                </>:
                <>
            <TouchableOpacity onPress ={()=>{ props.AddCart()}}>
                <View style={ styles.btnaddcartPopUp}>
                    <View style={styles.btnadd} >
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold',marginTop: 8 }}>Add to Cart</Text>
                    </View>
                </View>
            </TouchableOpacity>
                </>}

        </ActionSheet>
    </View>
    )
}
)
export default function Productdetail(props,{navigation}){
    const [textsearch, settextsearch] = useState('');
    const [colorSearch, setcolorSearch] = useState(null);
    const [bgHeader, setbgHeader] = useState(true);
    const [DataProductDetail, setDataProductDetail] = useState([]);
    const [DataProductType, setDataProductType] = useState([]);
    const [imageslidebox, setimageslidebox] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    const [isLoading1, setisLoading1] = useState(true);
    const [star,setstar] = useState(5);
    const [quantityReview, setquantityReview] = useState(0);
    const [description, setdescription] = useState({})
    const [checkPromotional, setcheckPromotional] = useState(null);
    const [isFavourite, setisFavourite] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
    const [modalVisibleAddcart, setmodalVisibleAddcart] = useState(false)
    const [selectedValue, setSelectedValue] = useState();
    const [DataEnventory, setDataEnventory] = useState([]);
    const [quantity, setquantity] = useState(0);// số lượng của sản phẩm trên enventory
    const [quantityDisplayScreen, setquantityDisplayScreen] = useState(1);// số lượng xét giá trị tăng giảm số lượng
    const dispatch = useDispatch();

    const Data = props.route.params;
    const idProduct= {id: Data.idProduct}
    const idProductType= {id: Data.idProductType}
    useEffect(() => {
        getProductDetail();
        getProductType();
        DisplayProductFavorite();
        getInventory();
    }, [])

    const getProductDetail = async()=>{
        try {
            const imageslide = [];
            const res = await GETAPI.postDataAPI('/product/getProductDetails',idProduct);
            setDataProductDetail(res);
            imageslide.push(SetHTTP(res[0].image));
            res[0].imageDecription1 != null ? imageslide.push(SetHTTP(res[0].imageDecription1)): null;
            res[0].imageDecription2 != null ? imageslide.push(SetHTTP(res[0].imageDecription2)): null;
            res[0].imageDecription3 != null ? imageslide.push(SetHTTP(res[0].imageDecription3)): null;
            res[0].imageDecription4 != null ? imageslide.push(SetHTTP(res[0].imageDecription4)): null;
            if(res[0].reviewStar!==null){
                setstar(Math.round(res[0].reviewStar*10)/10)
                setquantityReview(res[0].quanityReview)
            }
            if(res[0].promotional !==null){
                setcheckPromotional(res[0].promotional)
            }
            if(res[0].description!==null){
                setdescription({html: res[0].description})
            }else{
                setdescription({html:` <h3 style={color:'red'}>PRODUCT NO DESCRIPTION</h3> `})
            }
            setimageslidebox(imageslide)
            setisLoading(false);
        } catch (error) {
            console.log(error)
        }
    }
    const getProductType = async()=>{
        try {
            const res = await GETAPI.postDataAPI('/product/getProductByType',idProductType);
            for( let i= 0; i < res.length ; i++){//xoa bỏ sản phẩm đã hiển thị
                if(res[i].id === Data.idProduct){
                    res.splice(i,1);
                }
            }
            setDataProductType(res);
            setisLoading1(false)
        } catch (error) {
            
        }
    }
    const getInventory = async()=>{
        try {
            const res = await GETAPI.postDataAPI('/product/getProductInventory',idProduct);
            for( let i= 0; i < res.length ; i++){//xoa bỏ sản phẩm có quannity = 0 ra khỏi mảng
                if(res[i].quanity === 0){
                    res.splice(i,1);
                }
                if(i === res.length-1){
                    // xét mặt định cgo SelectedValue và quantiy của sản phẩm
                    setDataEnventory(res)
                    setSelectedValue(res[0].size)
                    setquantity(res[0].quanity-res[0].sold)
                }
            }
        } catch (error) {
            
        }
    }


    const addFavorite = async()=>{
        try {       
            let arr = [];
            let id = DataProductDetail[0].id;
            let getData = await AsyncStorage.getItem("FAVORITE");
            if(getData == null){
                arr = [{'id': id }]
                // alert('đã thêm sản phẩm'+DataProductDetail[0].name+'vào danh mục yêu thích');
                setisFavourite(true)
                setModalVisible(true)
            }else{
                arr = JSON.parse(getData);
                arr = arr.concat([{'id':id}]);
                // alert('đã thêm sản phẩm'+DataProductDetail[0].name+'vào danh mục yêu thích');
                setisFavourite(true)
                setModalVisible(true)
                
            }
            await AsyncStorage.setItem('FAVORITE', JSON.stringify(arr))
            dispatch(updatequantityFavorite(arr.length))
        } catch (error) {
            console.log(error)
        }
    }
    
    
    const DeleteFavorite = async()=>{
        try {
            let id = DataProductDetail[0].id;
            let arr = [];
            let getData = await AsyncStorage.getItem('FAVORITE');
            if(getData != null){
                arr = JSON.parse(getData);
                if(arr.length===1){
                    await AsyncStorage.removeItem("FAVORITE");
                }else{
                    for(let i = 0; i < arr.length; i++){
                        if(arr[i].id === id){
                            arr.splice(i,1);
                        }
                    }
                    await AsyncStorage.setItem("FAVORITE",JSON.stringify(arr))
                }
              
            }
            setisFavourite(false)
            setModalVisibleDelete(true)
        } catch (error) {
            console.log(error)
        }
        
    }

    const DisplayProductFavorite = async()=>{
        try {
            let id = Data.idProduct;
            let arr = [];
            let getData = await AsyncStorage.getItem('FAVORITE')
            if(getData != null){
                arr = JSON.parse(getData);
                for(const item of arr){
                    if(item.id == id){
                        setisFavourite(true)
                        return 0;
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    
    }
    const RemoveCart = async()=>{
        // await AsyncStorage.removeItem('CART');
        // alert('xoa thanh cong')
        const a= await AsyncStorage.getItem('CART')
        console.log(a)
    }
    
    var Increase =()=>{
        if(quantityDisplayScreen >= quantity){
            Alert.alert('FashionHQ',' Product quantity is not enough, please choose another product!')
        }else if(quantityDisplayScreen >= 5){
            alert('Maximum purchase of 5 products!')
        }else{
            let increase = quantityDisplayScreen+1;
            setquantityDisplayScreen(increase)
        }

        // console.log(increase)
        console.log(quantity)
    }

    var Reducer =()=>{
        if(quantityDisplayScreen <= 1){
            Alert.alert('FashionHQ','Add to cart at least 1 product !')
        }else{
            const reducer = quantityDisplayScreen-1;
            setquantityDisplayScreen(reducer)
        }
    }


    const AddCart = async()=>{
        try {
            let id = Data.idProduct;
            console.log('cart arr')
            console.log(id)
            let arr = [];
            let getData = await AsyncStorage.getItem('CART');
            if(getData == null){
                arr = [{'id' : id, 'quanity': quantityDisplayScreen , 'option': selectedValue, 'status': false}]
                actionSheetRef.current?.hide();
                setmodalVisibleAddcart(true)
            }else{
                arr = JSON.parse(getData);
                let police = arr.some(x => x.id===id && x.option===selectedValue);
                if(police){
                    let index = arr.findIndex(x=>  x.id===id && x.option===selectedValue);
                    let newQuanity = arr[index].quanity+quantity;
                    arr[index].quanity = newQuanity;
                    actionSheetRef.current?.hide();
                    Alert.alert('FashionHQ','Products already in the cart !');
        
                }else{
                    const arr1 = [{'id' : id, 'quanity': quantityDisplayScreen , 'option': selectedValue, 'status': false}]
                    arr = arr1.concat(arr);
                    actionSheetRef.current?.hide();
                    setmodalVisibleAddcart(true)
                    
                }
            }
    
            await AsyncStorage.setItem('CART',JSON.stringify(arr));
            dispatch(updateQuanityProduct(arr.length))
        } catch (error) {
            console.log(error)
        }
    }


    const ViewOrder = ()=>(
        <View style={styles.wrapperBottom}>
            <TouchableOpacity style={{ flexDirection:'column',alignItems:'center',flex:0.25 }}
                            onPress={()=>{
                                props.navigation.navigate('cart')
                            }}
                            >
                <Entypo name="shop" color="red" size={20}/>
                <Text>Giỏ hàng</Text>
            </TouchableOpacity>
            <View style={styles.verticleLine}></View>
            <TouchableOpacity style={{flexDirection:'column',alignItems:'center',flex:0.25 }} onPress={()=>{RemoveCart()}} >
                <MaterialCommunityIcons name="message-processing-outline" size={20}  color="gray"/>
                <Text>Message</Text>
            </TouchableOpacity>
            <View style={{ flex:0.5,flexDirection:"row",justifyContent:'flex-end' }}>
                <TouchableOpacity  style={{
                                         backgroundColor:'red',
                                         borderRadius:15,
                                         padding:10,
                                         alignItems:'center',
                                         marginRight:10,flex:1 }}
                                    onPress={()=>{
                                        // AddCart()
                                        actionSheetRef.current?.show();
                                        }}>
                    <Text style={{ color:'white',fontWeight:'bold' }}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
    const renderItemproductype = ({item, index})=>{
            let star1 = 0;
            let quantytiReview1 = 0;
            if(item.reviewStar == null){
                star1 = 5;
            }else{
                quantytiReview1 = item.quanityReview;
                star1= item.reviewStar;
            }
            // console.log(star1)
        return(
            <View style={styles.itemCart}>
                <StatusBar backgroundColor="white" barStyle="dark-content"/>
                <TouchableOpacity 
                    onPress={()=>
                        {
                            props.navigation.replace('productDetail',{
                            idProduct : item.id,
                            idProductType : item.idProductType
                                
                        });
                    }}
                >
                <View style={styles.viewItem}>
                    <Image source={{ uri: SetHTTP(item.image) }}
                        resizeMode='cover' 
                        style={{ width: windowW*0.55, height: windowH*0.45,}} />
                </View>
                </TouchableOpacity>
                <View style={styles.viewItem}>
                    <Text style={{ color: 'black', fontWeight: 'bold' }}>{truncate(item.name)}</Text>
                </View>
                {item.promotional > 0 ? 
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginHorizontal: 30,marginTop: 7 }}>
                <Text style={{ color: 'red',fontSize: 13, fontWeight:'bold' }}>{FormatNumber(item.promotional)} đ</Text>
                <Text style={{color: 'grey', textDecorationLine: 'line-through', marginLeft: 15  }}>{FormatNumber(item.price)} đ</Text>
                <Text style={{ color: 'red', fontSize: 16, marginLeft :15, backgroundColor: '#D3D3D3', borderRadius: 20}}>  -{100-(Math.round((item.promotional*100)/item.price))}%  </Text>
                </View>:
                <>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginHorizontal: 30,marginTop: 7 }}>
                <Text style={{ color: 'red',fontSize: 13, fontWeight:'bold' }}>{FormatNumber(item.price)} đ</Text>
                </View>
                </>}
                <View style={styles.viewItemStar}>
                <Star score={star1} style={{width:80,height:15, marginLeft : 5}}/> 
                 <Text style = {{ marginLeft :5 }}>({quantytiReview1} review)</Text>
                </View>
                
            </View>
        )

    }

    return(
            <View style={{ flex: 1, paddingBottom:20 }}>
                
                <HeaderScreen navigation={navigation} textsearch={textsearch} hideSearch={false} heightHeader={windowH*0.07} colorSearch={colorSearch} bgWhite={bgHeader}/>
                {!isLoading && !isLoading1? 
                <>
                <ScrollView >
                    <View style= {styles.box}>
                        <SliderBox
                            sliderBoxHeight={windowH*0.5}
                            parentWidth={windowW*0.9}            
                            images={imageslidebox}
                            dotColor="#FFEE58"
                            inactiveDotColor="#90A4AE"
                            // paginationBoxVerticalPadding={20}
                            resizeMode='contain'
                            circleLoop
                        />
                    </View>
                    <View style={styles.Price}>
                            <View style={{...styles.priceItem}}>
                            {checkPromotional == null ? 
                            <>
                                <Text style={{ color: 'red', fontSize: 19, marginTop: 5,fontWeight:'bold'}}>{FormatNumber(DataProductDetail[0].price)} đ</Text>
                            </>: 
                            <>
                                <Text style={{ color: 'red', fontSize: 19, marginTop: 5,fontWeight: 'bold'}}>{FormatNumber(DataProductDetail[0].promotional)} đ</Text>
                                <View style = {{ flexDirection: 'row', justifyContent: 'flex-start' }}> 
                                    <Text style={{ color: '#888', fontSize: 16, marginTop: 5, textDecorationLine:'line-through' }}>{FormatNumber(DataProductDetail[0].price)} đ</Text>
                                    <Text style={{ color: 'red', fontSize: 16, marginTop: 5, marginLeft :15, backgroundColor: '#D3D3D3', borderRadius: 20}}>  -{100-(Math.round((DataProductDetail[0].promotional*100)/DataProductDetail[0].price))}%  </Text>
                                </View>
                            </>}   
                            </View>
                            {isFavourite ?
                                <TouchableOpacity style={{ paddingRight:10 }}
                                                    onPress={()=>{  
                                                        DeleteFavorite()
                                                         
                                                        }}>
                                  
                                    <View>
                                        <LottieView  
                                            source={require('../../assets/lottierfiles/ccc.json')}
                                            style={{ width:40, height:40}}
                                            autoPlay
                                            loop                   
                                        />
                                    </View>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={{ paddingRight:10 }}
                                                 onPress={()=>{ 
                                                     addFavorite()
                                                    }}>
                                    <View>
                                        <LottieView  
                                            source={require('../../assets/lottierfiles/hearts-loading.json')}
                                            style={{ width:40, height:40,marginRight:5}}
                                            autoPlay
                                            loop                   
                                        />
                                    </View>
                                </TouchableOpacity>
                                }
                                    
                           
                        </View>
                        <View style = {{ borderBottomWidth: 1, borderColor: "#D3D3D3", }}>
                            <Text style={{ color: 'black', fontSize: 14, marginTop: 5,fontWeight: 'bold', marginLeft: 15}}>{DataProductDetail[0].name} </Text>   
                            <View style ={{ flexDirection: 'row', marginTop : 5, marginLeft: 15 }}>
                                <Text>{star}/5</Text>
                                <Star score={star} style={{width:80,height:15, marginLeft : 5}}/> 
                                <Text style = {{ marginLeft :5 }}>({quantityReview} review)</Text>
                            </View>
                        </View> 
                        <View style = {{ marginTop: 10, borderBottomWidth: 1, borderBottomColor: '#D3D3D3'}}>
                                <View style = {{  marginLeft: 15 , flexDirection: 'row', justifyContent: 'space-between'  }}>
                                    <Text style = {{  fontSize : 12, fontWeight: 'bold'}}>DELIVERY FORM</Text>
                                    <View style = {{   flexDirection: 'row', justifyContent: 'space-between'  }} >
                                    {/* <Text style = {{  fontSize : 12, fontWeight: 'bold', marginRight: 5 }}>qq</Text> */}
                                    
                                    <View>
                                        <LottieView  
                                            source={require('../../assets/lottierfiles/location-lottie-animation.json')}
                                            style={{ width:25, height:20}}
                                            autoPlay
                                            loop           
                                        />
                                     </View>
                                    <Text style = {{  fontSize : 12, fontWeight: 'bold', marginRight: 5 }}>Ngu Hanh Son, Da Nang</Text>
                                    </View>
                                </View>
                                <View style = {{ marginLeft: 15, flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                    <Text style = {{  fontSize : 11 }}>Standard Delivery</Text>
                                    <Text style = {{  fontSize : 12,fontWeight: 'bold', color: 'black', }}>22.000 đ   </Text>
                                </View>
                        </View> 
                        <View style={{ marginTop : 5, borderBottomWidth: 1, borderBottomColor: "#D3D3D3"}}>
                            <View style={{ marginTop : 5, marginHorizontal : 15 }}>
                                <Text>PRODUCT DETAILS</Text>
                                <RenderHtml
                                    contentWidth={windowW}
                                    source={description}
                                />
                            </View>
                        </View>
                            <Text style={{ marginTop: 10 , marginLeft: 15,  color: 'red'}}>RECOMMENDED PRODUCTS </Text>
                                <View style={styles.CarouselCart}>
                                {DataProductType.length == 0 ? 
                                <>
                                    <Text style={{ fontSize: 14, color: 'red', textAlign: 'center' }}>SOLD OUT! THERE ARE NO MORE PRODUCTS LIKE THIS PRODUCT!</Text>
                                </>:
                                <>
                                    <Carousel           
                                             
                                        layout={"stack"}
                                        activeSlideOffset={5}
                                        data={DataProductType}
                                        sliderWidth={windowW*0.9}
                                        itemWidth={windowW*0.9}
                                        callbackOffsetMargin={20}
                                        layoutCardOffset={24}
                                        renderItem={renderItemproductype}
                                        loop={true}
                                    />
                                </>}

                                
                                </View>
                    </ScrollView>
                    <ViewOrder />
                    <ActionSheetPopup   
                        data={DataProductDetail[0]}
                        selectValue={selectedValue} 
                        setSelectedValue={(e)=>setSelectedValue(e)} 
                        dataenventory ={DataEnventory} 
                        quantity = {quantity} 
                        setquantity={(e)=>setquantity(e)}
                        setquantityDisplayScreen={(e)=>setquantityDisplayScreen(e)}
                        Increase={()=>Increase()} 
                        Reducer={()=>{Reducer()}} 
                        quantityDisplayScreen ={quantityDisplayScreen}
                        AddCart={()=>{AddCart()}}
                    />
                    <ModalFavorite ModalVisible= {modalVisible} setModalVisible={(e)=>setModalVisible(e)} require= {require('../../assets/lottierfiles/modalFavorite.json')} text={'Đã thêm vào danh mục yêu thích'} width={120} height={120}/>
                    <ModalFavorite ModalVisible= {modalVisibleDelete} setModalVisible={(e)=>setModalVisibleDelete(e)} require= {require('../../assets/lottierfiles/broken-heart.json')} text={'Đã xóa sản phẩm yêu thích'} width={120} height={120}/>
                    <ModalFavorite ModalVisible= {modalVisibleAddcart} setModalVisible={(e)=>setmodalVisibleAddcart(e)} require= {require('../../assets/lottierfiles/addtocart.json')} text={'Đã thêm giỏ hàng !'} width={120} height={120}/>
                </>:
                <View style={{ flex:1, justifyContent: 'center', alignContent: 'center' }}>
                    <LoadingCircle/>
                </View>                
                }
            </View>

        )
    
}
const windowH = Dimensions.get('window').height;
const windowW = Dimensions.get('window').width;
const styles = StyleSheet.create({
    box:{   
        flex: 1, 
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomWidth: 0,
        borderBottomColor: "#D3D3D3",
        
    },
    Price:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 2,
        marginTop: 5,
        
    },
    priceItem:{
        marginHorizontal: 10,   
    },
    itemCart:{
        backgroundColor:'white',
        borderRadius: 5,
        height: windowH*0.6,
        marginLeft: 25,
        marginRight: 25,
        marginTop: 50,
        marginBottom: 50,
        shadowColor: "#000",
        shadowOffset:{
            width:0,
            height: 2
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 4,
        borderWidth: 0.4,
        borderColor: 'red'
    },
    CarouselCart:{flex:1,
                    marginTop : -20, 
                    marginBottom:40,
                    flexDirection: 'column', 
                    justifyContent: 'center',
                    alignItems:'center',
                    alignContent:'center',  
                    height: windowH*0.7
    },
    viewItem:{
            flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8
    },
    viewItemStar:{
        flexDirection: 'row',
        marginTop: 8,
        marginLeft: 15
    },
    wrapperBottom:{
        borderTopColor:'gray',
        borderTopWidth:0.2,
        flex:1,
        backgroundColor:'white',
        flexDirection:'row',
        position:'absolute',
        width:'100%',
        alignItems:'center',
        bottom:0,
        height:50,
        shadowColor: "#000",
        shadowOffset:{
            width:0,
            height: 2
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 4,
    },
    verticleLine: {
        height: '80%',
        width: 1,
        backgroundColor: '#808080',
    },
    Actionsheet:{
        height: windowH*0.6,

    },

    btnaddcartPopUp:{
        height:50,
        width: windowW,
        flexDirection: 'row',
        justifyContent: 'center',
        bottom: 5
    },
    btnadd:{
        width: windowW*0.94,
        backgroundColor: 'red',
        flexDirection: 'row',
        justifyContent:'center',
        height: 40,
        borderRadius: 5,
    },
    btnaddNotEnventory:{
        width: windowW*0.94,
        backgroundColor: 'grey',
        flexDirection: 'row',
        justifyContent:'center',
        height: 40,
        borderRadius: 5, 
    }


   
})