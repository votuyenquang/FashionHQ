import {PermissionsAndroid} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Grant Camera permissions",
          message:"The application needs Camera permissions",
          buttonNeutral: "Later",
          buttonNegative: "Exit",
          buttonPositive: "Allow"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission given");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
}

export const handleChoosePhotoCamera = ()=>{
    let options = {
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
    };
    return new Promise((resolve, reject) => {
    launchCamera(options,(response) => {
        requestCameraPermission();
        console.log('Response = ', response);
        if (response.didCancel) {
            console.log('User cancelled image picker');
            resolve(false);
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
            resolve(false);
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
            alert(response.customButton);
            resolve(false);
        } else {
            console.log('response', JSON.stringify(response));
            
            const obj = response.assets;
            console.log('uri',obj[0].uri);
            // setdataImageURI(obj[0].uri);
            
            resolve(obj[0]);
        }
        });
    })
}
export const handleChoosePhotoLibrary = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    return new Promise((resolve, reject) => {
      launchImageLibrary(options,(response) => {
          console.log('Response = ', response);
          if(response.didCancel) {
            console.log('User cancelled image picker');
            resolve(false);
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
            resolve(false);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
            alert(response.customButton);
            resolve(false);
          } else {
            console.log('response', JSON.stringify(response));
            const obj = response.assets;
            console.log('uri',obj[0].uri);
            // setdataImageURI(obj[0].uri);
            resolve(obj[0]);
          }
          });
      })
}