import React,{useState, useEffect} from "react";
import { View,Text,StyleSheet, Dimensions,TouchableOpacity,TextInput,StatusBar,FlatList } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
import { useDispatch } from "react-redux";
import {updateDataSearch} from '../../redux/reducer/product.reducer';
import AntDesign from 'react-native-vector-icons/AntDesign';
export default function SearchScreen({ navigation }){
    const [searhHistory, setsearhHistory] = useState('');
    const route = useRoute();
    const [dataSearchHistory, setdataSearchHistory] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        navigation.setOptions({
            headerShown:true,
            title:"Tìm kiếm"
        })
    },[])
    useEffect(() => {
        getHistory()
    },[route.name])
    
    const getHistory = async()=>{
        const history = await AsyncStorage.getItem('SEARCHHISTORY');
        if(history!==null){
            const arrH = JSON.parse(history)
            setdataSearchHistory(arrH)
        }
    }
    
    const addhistory = async()=>{
        if(searhHistory!==""){
            let arrHistorySearch = [];
            const getArrAsync = await AsyncStorage.getItem('SEARCHHISTORY');

            if(getArrAsync == null){
                arrHistorySearch = [{name: searhHistory}]
            }else{
                arrHistorySearch = JSON.parse(getArrAsync);
                const index = arrHistorySearch.findIndex(x=> x.name===searhHistory)
                if(index===-1){
                    let add = [{name: searhHistory}]
                    arrHistorySearch= add.concat(arrHistorySearch)
                }
            }
            await AsyncStorage.setItem('SEARCHHISTORY',JSON.stringify(arrHistorySearch))
        }
    }
    const handleSearch = ()=>{
        if(searhHistory!==""){
            navigation.replace("resultSearch")
            dispatch(updateDataSearch(searhHistory))
        }
    }
    const handleSearchByHistoty = (data)=>{
        if(data!==""){
            navigation.replace("resultSearch")
            dispatch(updateDataSearch(data))
        }
    }
    const removeHistory = async(data)=>{
        const history = await AsyncStorage.getItem('SEARCHHISTORY');
        if(history !== null){
            let arr = JSON.parse(history)
            const index = arr.findIndex(x=>x.name===data)
            arr.splice(index,1)
            await AsyncStorage.setItem('SEARCHHISTORY',JSON.stringify(arr));
            getHistory();
        }

    }
    const renderItemHistory = ({item,index}) =>{
        if(index<6){
        return(
            <TouchableOpacity 
                    style={{ 
                        width:'30%',
                        padding:5,
                        borderRadius:50,
                        marginLeft:5,
                        backgroundColor:'#F3F3F3',
                        marginBottom:10,
                        paddingLeft:10,
                        flexDirection:"row",
                        justifyContent : "space-between",
                    }}
                    onPress={()=>handleSearchByHistoty(item.name)}
                >
                <Text>{item.name}</Text>
                <TouchableOpacity 
                    style={{ 
                        padding:2,
                        borderRadius:50,
                        backgroundColor:'rgba(180, 180, 180, 0.2)' 
                    }} 
                    onPress={()=>removeHistory(item.name)}
                >
                    <AntDesign name="close" size={16}/>
                </TouchableOpacity>

            </TouchableOpacity>
        )
        }
    }
    return(
        <View style={style.container}>
            <StatusBar 
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            <View style={{...style.search1}}>
                <View style={style.input} >
                    <TouchableOpacity>
                    {/* Nhấn vào input  hoặc button cho nhảy sang trang search */}
                        <TextInput  
                            style={{ ...style.textinput}} 
                            returnKeyType="search"
                            placeholder={'Enter the product name...'}
                            value = {searhHistory}
                            onChangeText={(value)=>setsearhHistory(value)} 
                            onSubmitEditing={()=>{
                                addhistory();
                                handleSearch()
                            }}
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
                </View>
                <View style= {{ flex:1,padding:20}}>
                   <Text style={{ fontWeight:'bold',fontSize: 15}}>Search history</Text>
                   <FlatList 
                        data={dataSearchHistory}
                        renderItem={renderItemHistory}
                        numColumns={3}
                        keyExtractor={(item) => item.name}
                        style={{ marginTop:10 }}
                   />
                </View>
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
        paddingBottom:10,
        backgroundColor:'white'
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