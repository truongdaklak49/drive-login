export function generateRandomString(length: number, characters: string) {
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  let password = "";
  for (let i = 0; i < length; i++) {
    password += characters.charAt(array[i] % characters.length);
  }
  return password;
}

export function generatePassword(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|<>?-=[];,.";
  return generateRandomString(length, characters);
}

export function generatePin(length: number = 6) {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  return generateRandomString(length, characters);
}

export function encodeCredentials(owner: string, password: string) {
  return Buffer.from(`${owner}:${password}`).toString("base64");
}

export function decodeCredentials(credentials: string) {
  const decoded = Buffer.from(credentials, "base64").toString("utf8");
  const lastColonIndex = decoded.lastIndexOf(":");
  if (lastColonIndex === -1) {
    return { owner: decoded, password: "" };
  }
  const owner = decoded.substring(0, lastColonIndex);
  const password = decoded.substring(lastColonIndex + 1);
  return { owner, password };
}

export function formDataToJson(formData: FormData): { [key: string]: string } {
  const jsonObject: { [key: string]: string } = {};
  formData.forEach((value, key) => {
    jsonObject[key] = value as string;
  });
  return jsonObject;
}
