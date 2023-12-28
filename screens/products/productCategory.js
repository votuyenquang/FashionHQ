import React,{ useEffect, useState} from 'react'
import {View,FlatList,Text,TouchableOpacity,ScrollView,Dimensions} from 'react-native';
import * as GETAPI from '../../util/fetchApi';
import GetfullProduct from "./getfullProduct";
import LoadingCircle from '../StartScreens/loadingCircle'
export default function ProductCategory({navigation,route}){
    const {idCategory,nameCategory} = route.params; 
    const [dataProductCategory, setdataProductCategory] = useState();
    const [productType, setproductType] = useState();
    const [showContent, setshowContent] = useState(false);
    const [selectType, setselectType] = useState();
    useEffect(() => {
        navigation.setOptions({
            headerShown:true,
            title:`Product Category ${nameCategory.toLowerCase()}`,
            headerStyle: {
                height:50
            },
            headerTitleStyle: {
                fontSize:16
            },
        })
        setshowContent(false)
        getProductCategory();
    },[selectType])
    const getProductCategory = async()=>{
        const res = await GETAPI.postDataAPI("/product/getProductByCategory",{id:idCategory})
        const product_type = await GETAPI.postDataAPI("/product/getProductTypeByCategory",{id:idCategory})
        setproductType(product_type)
        if(selectType== null){
            setdataProductCategory(res)
        }else{
            let arr = []
            res.map(e=>{
                if(e.idProductType===selectType){
                    arr.push(e)
                }
            })
            setdataProductCategory(arr)
        }
        setshowContent(true)
    }
    const renderItemProductype = ({item,index})=>{
        return(
            <View>
                <TouchableOpacity
                    style={selectType!==item.id?
                    {
                        padding:15,
                        borderRightColor:'gray',
                        borderEndWidth:0.5
                    }:{
                        padding:15,
                        borderColor:'red', 
                        borderWidth:1.5
                    }}
                    onPress={()=>{
                        if(item.id!==selectType){
                            setselectType(item.id)
                        }else{
                            setselectType()
                        }
                    }}
                >
                    <Text>{`${item.name}`}</Text>
                </TouchableOpacity>
            </View>
        )
    }
    return(
        <View style={{ flex:1 }}>
            {showContent?
            <View style={{ flex:1 }}>
                <View>
                    <FlatList 
                        data={productType}
                        renderItem={renderItemProductype}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                       
                    />
                </View>
                {dataProductCategory.length!==0 ?
                <ScrollView
                    contentContainerStyle={{ minHeight:Dimensions.get('window').height*0.9 }}
                >
                    <GetfullProduct DatafullProduct={dataProductCategory} navigation={navigation} />
                </ScrollView>
                :
                <View style={{ flex:1,justifyContent:'center',alignItems: 'center' }}>
                    <Text>
                        No products...
                    </Text>
                </View>
                }
            </View>
            :
            <View style={{ flex:1,justifyContent:'center',alignItems: 'center'}}>
                <LoadingCircle/>
            </View>
            }
        </View>
    )
}