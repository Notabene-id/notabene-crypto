import nacl from "tweetnacl";
import naclutil from "tweetnacl-util";
import { convertKeyPair } from "ed2curve-esm";

export const ASYM_CIPHER_VERSION = "x25519-xsalsa20-poly1305";

interface NaCLKeyPair {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}

interface SerializedNaCLKeyPair {
  publicKeyB64: string;
  secretKeyB64: string;
}

export interface Encrypted {
  nonce: string;
  ciphertext: string;
  version: string;
  fromPublicKey: string;
  toPublicKey: string;
}

/**
 * Implement this to use a custom async random source
 * @param length is the length of the Random Bytes requested.
 * @returns a Promise returning a Uint8Array
 */
export interface RandomBytesSource {
  (length: number): Promise<Uint8Array>;
}

async function naclRandomBytes(length: number): Promise<Uint8Array> {
  return nacl.randomBytes(length);
}

let randomBytes: RandomBytesSource = naclRandomBytes;

/**
 * Sets a system wide random byte source
 * @param source an async function generating random bytes
 */
export function setRandomBytesSource(source: RandomBytesSource): void {
  randomBytes = source;
}

/**
 * Takes data which could be a string or a Uint8Array and normalizes it into a Uint8Array
 */
export function normalizeClearData(data: string | Uint8Array): Uint8Array {
  if (typeof data === "string") {
    return naclutil.decodeUTF8(data);
  } else {
    return data as Uint8Array;
  }
}

/**
 * Create a new pair of keys
 */
export function createEncriptionKeyPair(): NaCLKeyPair {
  const keypair = nacl.sign.keyPair();
  return convertKeyPair(keypair);
}

/** */
export function serializeKey(keypair: NaCLKeyPair): SerializedNaCLKeyPair {
  return {
    publicKeyB64: naclutil.encodeBase64(keypair.publicKey),
    secretKeyB64: naclutil.encodeBase64(keypair.secretKey),
  };
}

export function deserializeKey(
  serializedKeyPair: SerializedNaCLKeyPair
): NaCLKeyPair {
  return {
    publicKey: naclutil.decodeBase64(serializedKeyPair.publicKeyB64),
    secretKey: naclutil.decodeBase64(serializedKeyPair.secretKeyB64),
  };
}

/**
 *
 * @param encPrivateKey our private key
 * @param toPubKey their public key
 * @param data message to encrypt
 */
export async function encrypt(
  encKeyPair: NaCLKeyPair,
  toPubKey: Uint8Array,
  data: string | Uint8Array
): Promise<Encrypted> {
  const nonce = await randomBytes(nacl.box.nonceLength);
  const ciphertext = nacl.box(
    normalizeClearData(data),
    nonce,
    toPubKey,
    encKeyPair.secretKey
  );
  return {
    ciphertext: naclutil.encodeBase64(ciphertext),
    nonce: naclutil.encodeBase64(nonce),
    fromPublicKey: naclutil.encodeBase64(encKeyPair.publicKey),
    toPublicKey: naclutil.encodeBase64(toPubKey),
    version: ASYM_CIPHER_VERSION,
  };
}

export function decrypt(
  encPrivateKey: Uint8Array,
  { fromPublicKey, nonce, ciphertext }: Encrypted
): string {
  return naclutil.encodeUTF8(
    nacl.box.open(
      naclutil.decodeBase64(ciphertext),
      naclutil.decodeBase64(nonce),
      naclutil.decodeBase64(fromPublicKey),
      encPrivateKey
    ) as Uint8Array
  );
}
