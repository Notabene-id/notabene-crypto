# notabene-crypto

[![Build Status](https://github.com/notabene-id/notabene-crypto/workflows/build/badge.svg)](https://github.com/notabene-id/notabene-crypto/actions)
[![License](https://img.shields.io/github/license/notabene-id/notabene-crypto.svg?color=blue)](./LICENSE.md)
![npm](https://img.shields.io/npm/v/@notabene/crypto)
![GitHub last commit](https://img.shields.io/github/last-commit/notabene-id/notabene-crypto)
[![codecov](https://codecov.io/gh/Notabene-id/notabene-crypto/branch/main/graph/badge.svg)](https://codecov.io/gh/Notabene-id/notabene-crypto)

Documentation: https://notabene-id.github.io/notabene-crypto/

## Description

Encryption Library for Notabene Services

## Installation

**yarn**

`yarn add @notabene/crypto`

**npm**

`npm install @notabene/crypto`

## Usage

```javascript
const {
  createEncriptionKeyPair,
  serializeKey,
  deserializeKey,
  encrypt,
  decrypt,
} = require("@notabene/crypto");

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
```

## Development

Instal dependencies

```
$ npm install
```

Build

```
$ npm run build
```

Test

```
$ npm test
```

To publish to NPM:

```
$ pika publish
```

To publish dosc:

```
$ npm run docs
```

## Contributing

Contributions are welcome!

Want to file a bug, request a feature or contribute some code?

- Check out the [Code of Conduct](./CODE_OF_CONDUCT.md)
- Check that there is no existing [issue](https://github.com/Notabene-id/notabene-crypto/issues) corresponding to your bug or feature
- Before implementing a new feature, discuss your changes in an issue first!

## License

[MIT](./LICENSE.md) © Notabene
