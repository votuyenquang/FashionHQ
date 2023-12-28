import React from "react";
import {View, Text, Modal, StyleSheet, Pressable} from 'react-native';
import LottieView from "lottie-react-native";
export default function ModalFavorite(props){

    return (
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={props.ModalVisible}
            
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{props.text}</Text>
                <View>
                    <LottieView  
                        source={props.require}
                        // style={{ width:120, height:120}}
                        style={{ width: props.width, height: props.height }}
                        autoPlay
                        // loop                   
                    />
                </View>

                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => props.setModalVisible(false)}
                >
                  <Text style={styles.textStyle}>OK</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        
      },
      modalView: {
        margin: 20,
        // backgroundColor: "transparent",
        backgroundColor: 'white',

        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
    });