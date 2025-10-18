import { initializeApp } from "firebase/app";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  // your firebase config
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// connect to local emulator
connectStorageEmulator(storage, "localhost", 9199);
import { storage } from './firebase';
import { ref, uploadBytes } from 'firebase/storage';

const uploadFile = async (file) => {
  const fileRef = ref(storage, `uploads/${file.name}`);
  await uploadBytes(fileRef, file);
  console.log('Uploaded file to emulator successfully!');
};
