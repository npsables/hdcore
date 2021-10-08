import * as bip39 from "bip39";
import { COMPONENTS } from "./constants";
/* TODO: client ask for creating wallet
  + 1st: gen mnemonic
  + 2nd: gen seed
  + pass seed through all declare wallet
  return: list of Account!!!
*/
const account = {
    createMnemonic: (bytes = 256) => {
        return bip39.generateMnemonic(bytes);
    },
    createSeed: (mnemonic) => {
        if (!bip39.validateMnemonic(mnemonic)) {
            throw new Error('Invalid seed words');
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
    createMasterAccount: (coin_type, seed) => {
        if (coin_type in Object.keys(COMPONENTS)) {
            return COMPONENTS[coin_type].key_pair_master(seed);
        }
        else
            return false;
    },
    /**
   * Create child keys by adding path to params
   * @params same as create master keys pair
   * @param path string path derivations ()
   * @returns object keypair {'pub': ..., 'prv': ..., }
   */
    createChildAccount: (coin_type, seed, path) => {
        if (coin_type in Object.keys(COMPONENTS)) {
            return COMPONENTS[coin_type].key_pair_master(seed, path);
        }
        else
            return {};
    },
    /**
   * Create path for all coins, assume we all use hardened keys
   * @param accountIndex string
   * @param coinType string
   * @param addressIndex string
   * @returns path string
   */
    getPath: (accountIndex, coinType, addressIndex) => {
        // m/44'/501'/0'/0'/0'
        return `m/44'/${coinType}/${accountIndex}'/0'/${addressIndex}'`;
    },
};
export default account;
