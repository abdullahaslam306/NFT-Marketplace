import NodeRSA from "node-rsa";

const encodedEncryptionKey = process.env.NEXT_PUBLIC_REACT_APP_ENCRYPTION_KEY;

const key = new NodeRSA();

key.setOptions({
  encryptionScheme: "pkcs1",
});

export const encryptValue = (val) => {
  try {
    let encryptionKey;
    if (encodedEncryptionKey) {
      const decodedEncryptionKey = Buffer.from(
        encodedEncryptionKey,
        "base64"
      ).toString();
      encryptionKey = decodedEncryptionKey.replace(/\\n/g, "\r\n");
    }
    key.importKey(encryptionKey, "pkcs8-public");
    return key.encrypt(val, "base64");
  } catch (exp) {
    console.log(exp);
  }
};

export const getVersionId = () => {
  return process.env.NEXT_PUBLIC_REACT_APP_ENCRYPTION_KEY_VERSION;
};
