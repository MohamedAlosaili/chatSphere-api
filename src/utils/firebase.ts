require("dotenv").config({ path: "./src/config/.env.local" });

import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export interface UploadedFile {
  type: string;
  url: string;
}

export default async function uploadToStorage(
  file: Express.Multer.File,
  root: string,
  fileName: string
) {
  if (!file) throw new Error("uploadToStorage missing file argument");

  const fileRef = ref(storage, `${root}/${fileName}`);

  await uploadBytes(fileRef, file.buffer, { contentType: file.mimetype });

  const url = await getDownloadURL(fileRef);

  return { type: file.mimetype, url } as UploadedFile;
}
