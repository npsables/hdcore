import * as bip39 from "bip39";
import { PublicKey } from "@solana/web3.js";
// import { randomBytes } from "tweetnacl";
import COMPONENTS from "./constants";

/* TODO: client ask for creating wallet
  + 1st: gen mnemonic
  + 2nd: gen seed
  + pass seed through all declare wallet
  return: list of Account!!!
*/

const account = {
  createMnemonic: (bytes: number = 256) => {
    return bip39.generateMnemonic(bytes);
  },

  createSeed: (mnemonic: string): Buffer | string => {
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error("Invalid seed words");
    }
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    return seed;
  },

  /**
   * Create master keys pair
   * @param coinType string
   * @param seed string | Buffer
   * @returns object keypair {'pub': ..., 'prv': ..., }
   */
  createMasterAccount: (
    coin_type: string,
    seed: string | Buffer
  ): {} => {
    try {
      const keypair = COMPONENTS[coin_type].key_pair_master(seed);
      return keypair;
    } catch (e) {
      throw new Error("Wrong: " + e)
    }  },

  /**
   * Create child keys by adding path to params
   * @params same as create master keys pair
   * @param path string path derivations ()
   * @returns object keypair {'pub': ..., 'prv': ..., }
   */
  createChildAccount: (
    coin_type: string,
    seed: string | Buffer,
    path: string
  ): {} => {
    try {
      const keypair = COMPONENTS[coin_type].key_pair_master(seed, path);
      return keypair;
    } catch (e) {
      throw new Error("Wrong: " + e)
    }
  },

  /**
   * Create path for all coins, assume we all use hardened keys
   * @param coinType number
   * @param addressIndex string
   * @returns path string
   */
  getPath: (
    coinType: string,
    addressIndex: string
  ): string => {
    // m/44'/501'/0'/0'/0'
    return `m/44'/${coinType}'/0'/0'/${addressIndex}'`;
  },

  getFullPath: (
    accountIndex: string,
    coinType: string,
    indexPath: string
  ): string => {
    // "1 123 123 5123512" 
    const index = indexPath.split(" ").join("'/");
    // m/44'/501'/0'/0'/0'/0'
    const path = `m/44'/${coinType}'/${accountIndex}'/0'/${index}'`;
    if (!pathRegex.test(path)) {
      throw new Error("Invalid path")
    }
    return path
  },

  /**
   * Get address of account
   * @param coin_type number
   * @param publicKey string
   * @returns address string
   */
  getAddress: (publicKey: PublicKey | string, coin_type: string): string => {
    try {
    return COMPONENTS[coin_type].get_address(publicKey);
    }
    catch (e) {
      throw new Error("Wrong: " + e)
    }
  },


  /**
 * Build transaction
 * @param coin_type number
 * @returns object transaction
 */
  getTransaction: (coin_type: string): string => {
    try {
      return COMPONENTS[coin_type].transaction;
    }
    catch (e) {
      throw new Error("Wrong: " + e)
    }
  },
};

export default account;
export const pathRegex = new RegExp("^m(\\/[0-9]+')+$");