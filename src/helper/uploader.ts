import { account, ID } from "../lib/appwrite";

export async function sendXmlHttpRequest(data: any, sessionToken: string) {
  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;

      if (xhr.status === 201) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject(`Request Failed: ${xhr.status} - ${xhr.response}`);
      }
    };

    xhr.open(
      "POST",
      "https://fra.cloud.appwrite.io/v1/storage/buckets/69079e2d000f3880501a/files/"
    );
    xhr.withCredentials = true;

    xhr.setRequestHeader("X-Appwrite-Session", sessionToken);
    xhr.setRequestHeader("X-Appwrite-Project", "688c4e16000d8a8d27f4");
    xhr.setRequestHeader("X-Appwrite-Response-Format", "0.15.0");

    xhr.send(data);
  });
}

export async function uploadImageToAppwrite(imageUri: string) {
  if (!imageUri) throw new Error("No image selected.");

  const filename = imageUri.split("/").pop();
  const match = /\.(\w+)$/.exec(imageUri);
  const type = match ? `image/${match[1]}` : `image`;

  const formData = new FormData();
  formData.append("fileId", `${ID.unique()}`);
  formData.append("file", {
    uri: imageUri,
    name: filename,
    type,
  });

  const currentSession = await account.getSession("current");

  const response: any = await sendXmlHttpRequest(formData, currentSession.$id);

  return `https://fra.cloud.appwrite.io/v1/storage/buckets/69079e2d000f3880501a/files/${response.$id}/view?project=688c4e16000d8a8d27f4`;
}
