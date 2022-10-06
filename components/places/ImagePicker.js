import { useState } from "react";
import { View, Text, Alert, Image, StyleSheet } from "react-native";
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { Colors } from "../constants/colors";
import OutlinedButton from "../ui/OutlinedButton";

function ImagePicker({ onTakePicture }) {
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  const [takenPhotoUri, setTakenPhotoUri] = useState("");

  async function verifyPermissions() {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Unable to take photo",
        "Please grant permission to access photos to use this app"
      );
      return false;
    }

    return true;
  }

  async function takePhotoHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const image = await launchCameraAsync({
      quality: 0.5,
      allowsEditing: true,
      aspect: [16, 9],
    });
    setTakenPhotoUri(image.uri);
    onTakePicture(image.uri);
  }

  let previewImage = <Text>Image Preview</Text>;
  if (takenPhotoUri) {
    previewImage = (
      <Image style={styles.image} source={{ uri: takenPhotoUri }} />
    );
  }
  return (
    <View>
      <View style={styles.imagePreview}>{previewImage}</View>
      <OutlinedButton icon="camera" onPress={takePhotoHandler}>
        Take Photo
      </OutlinedButton>
    </View>
  );
}

export default ImagePicker;

const styles = StyleSheet.create({
  imagePreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 6,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },
});
