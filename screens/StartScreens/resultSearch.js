import React,{useState, useEffect} from "react";
import {View, Text,TextInput,StyleSheet,Dimensions,TouchableOpacity,ScrollView,StatusBar} from "react-native";
import LoadingCircle from "./loadingCircle";
import LinearGradient from "react-native-linear-gradient";
import { useSelector,useDispatch } from "react-redux";
import {updateDataSearch} from '../../redux/reducer/product.reducer';
import GetfullProduct from '../products/getfullProduct';
import * as GETAPI from '../../util/fetchApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LottieView from "lottie-react-native";
export default function ResultSearch ({navigation}){
    const datasearch = useSelector(e=>e.productReducer.datasearch);
    const dispatch = useDispatch();
    const [dataProduct, setdataProduct] = useState([]);
    const [showContent, setshowContent] = useState(false);
    useEffect(() => {
        getDataProduct()
    },[])
    const getDataProduct = async()=>{
        setshowContent(false)
        const res = await GETAPI.postDataAPI("/product/searchProduct",{"datasearch":datasearch});
        setdataProduct(res)
        setshowContent(true)
    }
    const addhistory = async()=>{
        if(datasearch!==""){
            let arrHistorySearch = [];
            const getArrAsync = await AsyncStorage.getItem('SEARCHHISTORY');

            if(getArrAsync == null){
                arrHistorySearch = [{name: datasearch}]
            }else{
                arrHistorySearch = JSON.parse(getArrAsync);
                const index = arrHistorySearch.findIndex(x=> x.name===datasearch)
                if(index===-1){
                    let add = [{name: datasearch}]
                    arrHistorySearch= add.concat(arrHistorySearch)
                }
            }
            await AsyncStorage.setItem('SEARCHHISTORY',JSON.stringify(arrHistorySearch))
        }
    }
    const handleSearch = ()=>{
        if(datasearch!==""){
            getDataProduct()
        }
    }
    return(
        
        <View style={style.container}>
            <StatusBar 
                backgroundColor="white"
                barStyle="dark-content"
            />
            {showContent ?
            <View style={{...style.search1}}>
                <View style={style.input} >
                    <TouchableOpacity>
                        <TextInput  
                            style={{ ...style.textinput}} 
                            placeholder={'Search'}
                            value = {datasearch}
                            onChangeText={(value)=>dispatch(updateDataSearch(value))} 
                        />
                        </TouchableOpacity>
                        <LinearGradient 
                            colors={["#C790E5",'#9C30FF','#BEE6F0']}
                            style={style.search}
                        >
                            <TouchableOpacity onPress={()=>{addhistory();handleSearch()}}>
                                <Text style= {{ color: 'white', fontSize: 12 }}>Search</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                    {dataProduct.length == 0 ? 
                    <View style={{justifyContent: "center", marginTop: windowH*0.2}}>
                    <LottieView  
                        source={require('../../assets/lottierfiles/search_not_found.json')}
                        style={{ width:windowW*0.4, height:windowH*0.4}}
                        autoPlay
                        loop                   
                    />
                    </View>: 
                        <ScrollView contentContainerStyle={{ paddingBottom:20 }}>
                            <GetfullProduct DatafullProduct={dataProduct} navigation={navigation}/>
                        </ScrollView>
                    }

             </View>:
                <View style={{ flex:1,justifyContent:'center',alignItems:'center' }}>
                    <LoadingCircle />
                </View>
               }
        </View>
    )
}

const windowW = Dimensions.get('window').width;
const windowH = Dimensions.get('window').height;

const style = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white'
        
    },
    input:{
        justifyContent: "space-between",
        flexDirection:"row",
        marginBottom:10,
        height : windowH*0.059,
        width : windowW*0.9,
        borderWidth : 1,
        borderColor: 'white',
        backgroundColor: 'white',
        borderRadius : 50,
        marginTop : 10,
        shadowColor: "#000",
        shadowOffset:{
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 4,
        },
    textinput:{
        flex:1,
        paddingLeft: 15,
        textAlign:"left",
        marginLeft: 8,
        backgroundColor : 'white',
        height : windowH*0.05,
        width : windowW*0.60,
        borderTopLeftRadius : 50,
        borderBottomLeftRadius:50,
        fontSize: 12,
       
    },
    search:{
        marginRight:3,
        marginBottom:1,
        backgroundColor : "red",
        height : windowH*0.05,
        width : windowW*0.25,
        borderRadius :50,
        marginTop : 2,
        textAlign: "center",
        justifyContent : "center",
        alignContent : "center",
        alignItems:"center"
    },
    search1:{
        justifyContent : "center",
        alignContent : "center",
        alignItems:"center",
        backgroundColor:'white', 
        // borderBottomWidth: 1,
        // borderColor: "#9999"
    },
    label:{
        color:'white',
        fontWeight:'bold',
        fontSize:18,
        marginLeft:10,
        marginTop:5 
    }
})