import * as FileSystem from "expo-file-system";
import mime from "mime";

async function FetchImageAsFile(url: string, filename: string) {
  // console.log(url,"url test")

  const downloadDest = `${FileSystem.documentDirectory}${filename}`;
  const mimeType = mime.getType(url) || "application/octet-stream";

  const res = await FileSystem.downloadAsync(url, downloadDest);

  const file = {
    uri: res.uri,
    type: mimeType,
    name: filename,
  };
  // console.log(file,"test")
  return file;
}
export default FetchImageAsFile;
