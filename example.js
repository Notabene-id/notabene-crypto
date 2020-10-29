const {
  createEncriptionKeyPair,
  serializeKey,
  deserializeKey,
  encrypt,
  decrypt,
} = require("./pkg");

//Create pair of keys
const alice = createEncriptionKeyPair();
console.log(serializeKey(alice));
/*
 {
  publicKeyB64: '...',
  secretKeyB64: '...'
 }
*/

//Get bob key
const bobSerializedKeys = {
  publicKeyB64: "vBTvb1MGLOahUPgzAJJB/fPqi6GOG4kcaaNAqD3SDzU=",
  secretKeyB64: "iKVZwIFyONUNga0dKlZqD1mlVRBVUmVnsiFICkTY9Vk=",
};
console.log(bobSerializedKeys);

const bob = deserializeKey(bobSerializedKeys);

//Encrypt a message from alice to bob
encrypt(alice, bob.publicKey, "sensitive data").then(enc => {
  console.log(enc);
  /*
    {
    ciphertext: '...',
    nonce: '...',
    fromPublicKey: '...',
    toPublicKey: 'vBTvb1MGLOahUPgzAJJB/fPqi6GOG4kcaaNAqD3SDzU=',
    version: 'x25519-xsalsa20-poly1305'
    }
  */

  //Decrypt message with bob secretKey
  const message = decrypt(bob.secretKey, enc);
  console.log(message);
  /*
    "sensitive data"
  */
});
