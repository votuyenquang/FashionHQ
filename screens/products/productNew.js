import React ,{memo} from "react";
import {View, Text, StyleSheet,Dimensions, Image,TouchableOpacity} from 'react-native';
import {SliderBox} from 'react-native-image-slider-box';
import { SetHTTP } from "../../util/setHTTP";
import truncate from "../../util/truncate";
import { LoadingSkeletonSliderbox } from "../StartScreens/loadingSkeleton";
import { pure } from 'recompose';
function ProductNew(props){

    const dataImage = props.Data
    const dataNewProduct = props.DataNewproduct

    const productDetail = (idProduct, idProductype)=>{
        props.navigation.navigate('productDetail',{
            idProduct : idProduct,
            idProductType : idProductype
        });
     }
    console.log("re-render-new")
    // console.log(dataNewProduct)
    const renderitem = (item)=>{
        return(
            <TouchableOpacity key={item.id} style={styles.wrapperitemProductNew}
            onPress={()=>{
                productDetail(item.id, item.idProductType)
            //     props.navigation.navigate('productDetail',{
            //     idProduct : item.id,
            //     idProductType : item.idProductType
                
            // });
         }}>
                <View  >
                    <Image 
                        source={{ uri:SetHTTP(item.image)}} 
                        resizeMode='contain'
                        style={{ width : windowW*0.2, height : windowH*0.1 ,borderRadius:20}}
                    />
                </View>
                <View style={{ flex:1 }} >
                    <Text style={{ fontSize:10 }}>{truncate(item.name)}</Text>
                </View>
            </TouchableOpacity>
        )
    } 

    return(

        <View>
            {dataNewProduct.length===0 || dataNewProduct==undefined  ? 
            <><LoadingSkeletonSliderbox/></>:
            <>
            <View style={styles.container}>
                <View style = {{ ...styles.box,backgroundColor:'#E7E9EB'}}> 
                    <SliderBox
                        sliderBoxHeight={windowH*0.4}
                        parentWidth={windowW*0.475}            
                        images={props.images}
                        onCurrentImagePressed={index => {
                            // console.log(dataImage[index])
                            props.navigation.navigate('productDetail',{
                                idProduct : dataImage[index].id,
                                idProductType : dataImage[index].idProductType
                                
                            });
                           
                            
                        }}
                        dotColor="#FFEE58"
                        inactiveDotColor="#90A4AE"
                        // paginationBoxVerticalPadding={20}
                        autoplay
                        circleLoop
                />
                    </View>
                        <View style =  {{ ...styles.box,backgroundColor:'#E7E9EB' }}> 
                            {dataNewProduct!==undefined &&
                                dataNewProduct.map(e=>{
                                    return(
                                        renderitem(e)
                                    )
                                })
                            }
                </View>
                
            </View>
            </>}
        </View>
    )
}
// export default React.memo(ProductNew)
const windowW = Dimensions.get('window').width;
const windowH = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container:{
        height: windowH*0.42,
        backgroundColor: 'white',
        flexDirection: "row",
        justifyContent: "space-around",

    },
    box:{
        width: windowW*0.475,
        height: windowH*0.4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4,
        elevation: 4,
        borderRadius: 5,
        justifyContent: "center",
        alignContent:"center",
        alignItems:"center",
        padding:5
    },
    wrapperitemProductNew:{
        flex:1,
        width: windowW*0.44,
        flexDirection: "row",
        backgroundColor:"white",
        margin:5,
        padding:5,
        borderRadius:6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        
        elevation: 5,
    }
})

export default memo(ProductNew);