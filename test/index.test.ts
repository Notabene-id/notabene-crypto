/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ASYM_CIPHER_VERSION,
  createEncriptionKeyPair,
  decrypt,
  encrypt,
} from "../src";

describe("createEncriptionKeyPair", () => {
  it("should create a keypair", () => {
    const keypair = createEncriptionKeyPair();
    expect(keypair).toBeDefined();
    expect(keypair.publicKey).toBeDefined();
    expect(keypair.secretKey).toBeDefined();
  });
});

describe("encrypt", () => {
  it("should encrypt", async () => {
    const keypairAlice = createEncriptionKeyPair();
    const keypairBob = createEncriptionKeyPair();
    const data = "unbreakable";
    const enc = await encrypt(keypairAlice, keypairBob.publicKey, data);
    expect(enc).toBeDefined();
    expect(enc.version).toEqual(ASYM_CIPHER_VERSION);
  });
});

describe("decrypt", () => {
  it("should decrypt", async () => {
    const keypairAlice = createEncriptionKeyPair();
    const keypairBob = createEncriptionKeyPair();
    const data = "unbreakable";
    const enc = await encrypt(keypairAlice, keypairBob.publicKey, data);
    const dec = decrypt(keypairBob.secretKey, enc);
    expect(dec).toBeDefined();
    expect(dec).toEqual(data);
  });
});
