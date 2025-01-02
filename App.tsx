import { CameraCapturedPicture, CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Appbar, Dialog, FAB, IconButton, Portal, TextInput, Button, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

interface PhotoInfo {
  photoMode : boolean,
  error : string,
  photo? : CameraCapturedPicture
  info : string,
  name? : string,
}

const App : React.FC = () : React.ReactElement =>  {

  const cameraRef : any = useRef<CameraView>();

  const [photoInfo, setPhotoInfo] = useState<PhotoInfo>({
    photoMode : false,
    error : '',
    info : ''
  });

  const [permission, requestPermission] = useCameraPermissions();
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [photoName, setPhotoName] = useState<string>('');
  
  const openCamera = async () : Promise<void> => {
    
    if (permission?.granted) {
      setPhotoInfo({
        ...photoInfo,
        photoMode : true, 
        error : '',
        name : '',
      })
    } else {
      requestPermission();
      setPhotoInfo({
        ...photoInfo,
        error : 'No permission to access camera'
      });
    }
  }

  const takePhoto = async () : Promise<void> => {
    setPhotoInfo({
      ...photoInfo,
      info : 'Taking photo...'
    })

    if (cameraRef.current) {
      const helperPhoto : CameraCapturedPicture = await cameraRef.current.takePictureAsync();

      setPhotoInfo({
        ...photoInfo,
        photoMode : false,
        photo : helperPhoto,
        info : ''
      });
      setDialogVisible(true);
    }
  }

  const hideDialog = () : void => {
    setDialogVisible(false);
    setPhotoName('');
  }

  const handleSavePhotoName = async () : Promise<void> => {
    setPhotoInfo({
      ...photoInfo,
      name : photoName,
    });

    hideDialog();
  }

  useEffect(() => {
    console.log(photoInfo);
  }, [photoInfo]);

  return (
  <PaperProvider>
    <SafeAreaProvider>

      {(photoInfo.photoMode)
        ? <CameraView style={styles.photoMode} ref={cameraRef}>
          {(Boolean(photoInfo.info))
            ? <Text style={{ color: '#fff' }}>{photoInfo.info}</Text>
            : null
          }
          <View style={styles.bottomCenterContainer}>
          <FAB 
            style={styles.buttonTakePhoto}
            icon='camera'
            onPress={takePhoto}
          />
          </View>
          <FAB 
            size='small'
            style={styles.buttonClose}
            icon='close'
            onPress={() => setPhotoInfo({...photoInfo, photoMode : false})}
          />
        </CameraView>
        : <View>
            <Appbar.Header>
              <View style={styles.iconContainer}>
                <IconButton 
                  icon='camera' 
                  onPress={openCamera}
                  size={30}
                />
              </View>
            </Appbar.Header>

            <View>
              {(Boolean(photoInfo.photo)) 
                ? <View style={styles.photoContainer}>
                    <Image
                      style={styles.photo}
                      source={{ uri: photoInfo.photo!.uri }}
                    />
                    {photoInfo.name 
                      ? <Text style={styles.photoName}>{photoInfo.name}</Text>
                      : null
                     }
                  </View>
               : null
              }
          </View>
        </View>
      }

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
            <Dialog.Title>Save Photo</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Photo Name"
                value={photoName}
                onChangeText={setPhotoName}
                mode="outlined"
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Cancel</Button>
              <Button onPress={() => handleSavePhotoName()}>Save</Button>
            </Dialog.Actions>
          </Dialog>
      </Portal>
      </SafeAreaProvider>
      </PaperProvider>
  );
}

const styles = StyleSheet.create({
  photoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  photo: {
    width: 300,
    height: 400,
    resizeMode: 'stretch',
  },
  photoName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoMode : {
    flex : 1,
    alignItems : 'center',
    justifyContent : 'center',
  },
  buttonClose : {
    position : 'absolute',
    borderRadius : 50,
    margin : 20,
    top : 20,
    right : 0,
  },
  buttonTakePhoto : {
    borderRadius : 50,
  },
  bottomCenterContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default App;