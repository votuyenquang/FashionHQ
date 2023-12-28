import React ,{memo} from "react";
import {View, Text, StyleSheet,Dimensions, TouchableOpacity,FlatList, Image} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import Label, {Orientation} from "react-native-label";
import { SetHTTP } from "../../util/setHTTP";
import { FormatNumber } from "../../util/formatNumber";
import { LoadingSkeletonSieuSale } from "../StartScreens/loadingSkeleton";
import { pure } from "recompose";

function ProductHot(props){
    const data = props.Data
  
    const productDetail = (idProduct, idProductype)=>{
        props.navigation.navigate('productDetail',{
            idProduct : idProduct,
            idProductType : idProductype
        });
     }
    const renderitem = ({item,index})=>{
    const titleSale = 100-(Math.round((item.promotional*100)/item.price))
    return(
        <View style={{ marginHorizontal: 6 }}>
         <TouchableOpacity onPress={()=>{
                                        productDetail(item.id,  item.idProductType)
                                        //  props.navigation.navigate('productDetail',{
                                        //     idProduct : item.id,
                                        //     idProductType : item.idProductType
                                            
                                        // });
                               }}>
            <Label
                orientation={Orientation.TOP_RIGHT}
                containerStyle={styles.productsaleLable}
                title={`${titleSale}%`}
                color="red"
                distance={15}
                extent={0.0}
                style={{fontSize: 10,
                    color: 'white',
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                        }}
                shadowProps={{ shadowColor: "#C8C8C8",
                                    shadowOffset: { width: 0, height: 12, },  
                                    shadowOpacity: 0.2, shadowRadius: 8, 
                                    elevation: 2 }}
            >
                
                <View style={{...styles.itemdetail, backgroundColor: "#FDE0C7"}}>
                <Image source={{uri :SetHTTP(item.image) }} 
                    resizeMode='contain'
                    style={{ width : windowW*0.27, height : windowH*0.17}}/>
                    <View style={{ flex : 1, justifyContent:"space-around", margin : 3 ,flexDirection:"row",}}>
                        <Text style={{fontSize : 10,color : "#777777", textDecorationLine:"line-through", marginRight:5 }}>{FormatNumber(item.price)}đ</Text>
                        <Text style={{ fontSize :10,color : "red"}}>{FormatNumber(item.promotional)}đ</Text>
                    </View>
                </View>
            </Label>
            </TouchableOpacity>
        </View>
    )
    }
    return(

        <View>
            { data==undefined || data.length===0 ? 
            <><LoadingSkeletonSieuSale/></>:
            <>
            <LinearGradient  colors= {["#C790E5","#EDDAF5"]} style={styles.container}>
                    <LinearGradient  colors= {["#6C2DC6","#9C30FF","#C482F7","#B7A4F7"]} style={styles.Sale}>
                    <View style={styles.LogoSale}>
                        <LinearGradient colors= {["#9C30FF","#C482F7","#B7A4F7","#FEFFFF"]} style={styles.deal}>
                            <Text style={{...styles.text,color : '#E0FF4E'}}>SUPER SALE</Text>  
                        </LinearGradient>
                    </View>
                    <View style={styles.productsale}>
                    
                    <FlatList
                        horizontal
                        data={data}
                        keyExtractor={item=>item.id}
                        renderItem={renderitem}
                    />
                    </View>
                </LinearGradient>
            </LinearGradient>
            </>}
        </View>
    )
}
// export default React.memo(ProductHot)
const windowW = Dimensions.get('window').width;
const windowH = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container:{
        height: windowH*0.33,
    },
    Sale:{
        marginHorizontal: 6,
        marginTop: 10,
        height:windowH*0.31,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 20,
    },
    LogoSale:{

        justifyContent: "center",
        alignContent : "center",
        alignItems:"center"
    },
    deal:{ 
        backgroundColor: "white" , 
        width: 120,
        height: 40,
        borderBottomRightRadius: 30,
        borderBottomLeftRadius:30,
        borderWidth: 2,
        borderColor:"#51FEC7",
        justifyContent: "center",
        alignContent:"center",
        alignItems:"center", 
        padding:10
    },
    text:{
        
        fontWeight : 'bold',
        textAlign: 'center'
    },
    productsale:{
        flexDirection: "row",
        justifyContent: 'space-around',
        alignContent: "space-around",
        alignItems: "center",
        marginTop: 10,
        marginLeft:5
    },
    productsaleLable:{
        width: windowW*0.28,
        backgroundColor: "white",
        height : windowH*0.206,
        borderRadius : 10,
    },
    productitemsale:{
         shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    itemdetail:{ 
        flex:1,
        backgroundColor: "white",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    }
})

export default memo(ProductHot);