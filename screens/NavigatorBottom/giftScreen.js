import React, {useEffect,useState} from "react";
import { View, Text,StyleSheet, Dimensions, ScrollView} from "react-native"; 
import * as GETAPI from '../../util/fetchApi';
import { FormatNumber } from "../../util/formatNumber";
export default function GiftScreen (){
    const currentTime = Date.now();
    const [GoingOn, setGoingOn] = useState([]);
    const [Finished, setFinished] = useState([]);
    const [Upcomming, setUpcomming] = useState([]);

    useEffect(() => {
     getPromotion();
    }, [])

    const getPromotion = async()=>{
        const goingon = [];
        const finish = [];
        const upcomming = [];
        const res = await GETAPI.getAPI('/promotion/getFullPromotion');
        for(let i = 0 ; i < res.length ;i++){
            const TimeStart = new Date(res[i].date_start);
            const TimeFinish = new Date(res[i].expired);
            // console.log(TimeStart)
            // console.log(res[i].date_start)
            if(TimeStart > currentTime){
                goingon.push(res[i]);
                // console.log('sắp diển ra')
            }else if(TimeFinish < currentTime){
                // console.log('đã kết thúc')
                finish.push(res[i]);
            }else{
                upcomming.push(res[i]);
                // console.log("đang diển ra")
                
            }
          
        }
        setGoingOn(goingon);
        setFinished(finish);
        setUpcomming(upcomming);
        
    }

    const renderitem = (item)=>{
        return(
            <View key={item.id} style={styles.wrapitem}>
                <Text style= {{ color: 'purple', fontWeight: "bold", fontSize:14 }}>{item.name_event_sale}</Text>
                <View style={{ flex:1, flexDirection: 'row',marginBottom: 5 }}>
                    <Text  style= {{ color: 'black',  fontSize:14 }}>Insert code </Text>
                    <Text  style= {{ color: 'red', fontWeight: "bold", fontSize:14 }}>{item.code_sale}</Text>
                    <Text style= {{ color: 'black',  fontSize:14 }}> receive immediately </Text>
                    <Text style= {{ color: 'green', fontWeight: "bold", fontSize:14 }}>{FormatNumber(item.cost_sale)}đ</Text>
                    
                </View>
                <View style={{ flex:1, flexDirection: 'row',marginBottom: 5 }}>
                    <Text style= {{ color: 'black',  fontSize:14  }}>Codes left </Text>
                    <Text style= {{ color: 'red', fontWeight: "bold", fontSize:14 }}>{item.quanity}</Text>
                    <Text style= {{ color: 'black', fontSize:14 }}> code</Text>
                </View>
                
                {new Date(item.date_start) <= currentTime && new Date(item.expired) >= currentTime ?
                    <View style={{ flex:1, flexDirection: 'row',marginBottom: 5 }}>
                    <Text style= {{ color: 'black',  fontSize:14 }}>Event end time date </Text>
                    <Text style= {{ color: 'black', fontWeight: "bold", fontSize:14 }}>{item.expired.substring(0, 10)}</Text>
                    </View>:
                    <View>
                        <View style={{ flex:1, flexDirection: 'row',marginBottom: 5 }}>   
                        <Text style= {{ color: 'black',  fontSize:14 }}>Event start time </Text>
                        <Text style= {{ color: 'black', fontWeight: "bold", fontSize:14 }}>{item.date_start.substring(0, 10)}</Text>
                        </View>
                        <View style={{ flex:1, flexDirection: 'row',marginBottom: 5 }}>   
                        <Text style= {{ color: 'black',  fontSize:14 }}>Event end time date </Text>
                        <Text style= {{ color: 'black', fontWeight: "bold", fontSize:14 }}>{item.expired.substring(0, 10)}</Text>
                        </View>
                    </View>
                }
            </View>
        )
    }

    return(
        <View style= {styles.container}>
            
            {Upcomming.length > 0 ? 
            <View style = {styles.header}>
                <Text style={{ color: 'black', fontWeight: "bold", fontSize:16, marginLeft: 15 }}>(</Text>
                <Text style={{ color: 'red', fontWeight: "bold", fontSize:16, }}>{Upcomming.length}</Text>
                <Text style={{ color: 'black', fontWeight: "bold", fontSize:16, }}>) EVENTS GOING ON</Text>
            </View>:
            <View style = {styles.header}>
               <Text style={{ color: 'black', fontWeight: "bold", fontSize:16,paddingLeft:10 }}>STORE EVENTS</Text> 
            </View>}

            {/* View promotion upcomming */}
            
            <ScrollView>
                {/* sự kiện đang diển ra */}
                {Finished.length > 0 ?
            <ScrollView>
            <Text style={{ color: 'purple', fontWeight: "bold", fontSize:15, marginLeft: 10, marginVertical: 10 }}>EVENTS GOING ON</Text>
            {Upcomming.length > 0 &&
            Upcomming.map(e=>{
                return(
                    renderitem(e)
                )
            })} 
            </ScrollView>:null}
            {GoingOn.length > 0 ?
                <ScrollView>
                <Text style={{ color: 'blue', fontWeight: "bold", fontSize:15, marginLeft: 10, marginVertical: 10 }}>UPCOMING EVENTS</Text>
                {GoingOn.length > 0 &&
                    GoingOn.map(e=>{
                        return(
                            renderitem(e)
                        )
                    })} 
                </ScrollView>:null}
            {Finished.length > 0 ?
            <ScrollView>
            <Text style={{ color: 'red', fontWeight: "bold", fontSize:15, marginLeft: 10, marginVertical: 10 }}>EVENT HAS ENDED</Text>
            {Finished.length > 0 &&
            Finished.map(e=>{
                return(
                    renderitem(e)
                )
            })} 
            </ScrollView>:null}
            </ScrollView>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:'column'
    },
    header:{
        flexDirection:'row',
        height: 45,
        borderBottomWidth: 0.5,
        borderBottomColor: "#D3D3D3",
        shadowColor: "rgb(180, 180, 180)",
        shadowOffset:{
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 3,
        alignItems: "center"

    },
    wrapitem:{
        flex:1,
        marginHorizontal: 3,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset:{
            width: 0,
            height: 2
        },
        shadowOpacity: 0.45,
        shadowRadius: 3,
        elevation: 3,
        padding: 20,
        marginBottom: 10,
    }
})