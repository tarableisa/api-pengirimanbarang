// backend/config/gcs.js
import { Storage } from "@google-cloud/storage";
import path from "path";

const storage = new Storage({
  keyFilename: path.join(process.cwd(), "config", "gcs-key.json"), 
  projectId: "if-b-08", 
});

const bucketName = "bukti-upload"; 
const bucket = storage.bucket(bucketName);

export default bucket;
