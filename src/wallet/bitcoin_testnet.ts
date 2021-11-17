import * as bip32 from 'bip32'
import * as bitcoin from 'bitcoinjs-lib'
// import { TransactionBuilder } from 'bitcoinjs-lib';
// import { ARRAY_INDEX } from '../constants'; 
// const axios = require('axios').default;
import { default as axios, AxiosRequestConfig } from "axios";

/**
 * Create Bitcoin key pair
 * @param seed string
 * @param path string, if no path passed, create master key pair
 * @returns true/false
 */
export const create_bitcoin_testnet_pair = function (
  seed: string | Buffer,
  path?: string
): {} {
  if (!path) path = `m/44'/1'/0'/0'`;
  if (typeof seed === "string") {
    seed = Buffer.from(seed, "hex");
  }
  const root = bip32.fromSeed(seed, bitcoin.networks.testnet);
  const child = root.derivePath(path);
  if (!child) throw new Error("Cannot get Keypair");
  try {
    bitcoin.ECPair.fromWIF(child.toWIF(), [
      bitcoin.networks.bitcoin,
      bitcoin.networks.testnet,
    ]);
  } catch (e) {
    throw new Error("Invalid Key generation");
  }
  return { pub: child.publicKey, prv: child.privateKey };
};


/**
 * get address of account
 * @param publicKey publicKey from @function create_bitcoin_testnet_pair (Buffer) or already change to hex
 * @returns base58 string
 */
export const get_bitcoin_testnet_address = function (publicKey: Buffer): string | undefined | boolean {
  try {
    const address = bitcoin.payments.p2pkh({
      pubkey: publicKey,
      network: bitcoin.networks.testnet,
    }).address;
    return address;
  } catch (e) {
    return false
  }
}


export const bitcoin_tn_tx = {
  // ONLY DEAL WITH 1 UTXOS, CANT DEAL WITH MULTIPLE INPUT

  /**
 * Broad cast bitcoin transaction to the networks. 
 * @param tx hex string of transaction build buy @function build_tx
 * @returns bool if sth wrong, hex string of transaction
 */
  broadcast: async (tx: string) => {
    const options = {
      method: 'POST',
      url: 'https://blockstream.info/testnet/api/tx',
      data: tx
    } as AxiosRequestConfig;

    axios.request(options).then(function (response) {
      console.log(response.data);
      return true
    }).catch(function (error) {
      console.error(error);
      return false
    });
  },

  /**
   * Build transaction 
   * @param network? option(dev/testnet), auto devnet
   * @param pubkey 
   * @returns bool if sth wrong, hex string of transaction
   */
  build_tx: async (publicKey: Buffer, privateKey: Buffer, recieveAddress: string, amount: number, fee?: number): Promise<string | boolean> => {
    const satoshi = amount * (10 ** 8);
    const network = bitcoin.networks.testnet;
    const address = bitcoin.payments.p2pkh({
      pubkey: publicKey,
      network: bitcoin.networks.testnet,
    }).address as string;
    const wallet = bitcoin.ECPair.fromPrivateKey(privateKey, { network: network })

    const balance = await bitcoin_tn_tx.get_balance(publicKey);
    if (balance * (10 ** 8) < satoshi) {
      return false
    }

    const tx = await axios.get(`https://api.blockchair.com/bitcoin/testnet/dashboards/address/${address}?limit=1`).then(function (response) {
      return response.data.data[address].utxo[0];
    }).catch(function (error) {
      throw new Error(error)
    });

    const tx_hash = tx.transaction_hash;
    const tx_id = tx.index;
    const tx_value = tx.value;
    if (!fee) fee = 20000;

    var build_tx = new bitcoin.TransactionBuilder(network);
    build_tx.addInput(tx_hash, tx_id);
    build_tx.addOutput(recieveAddress, amount);
    build_tx.addOutput(address, tx_value - amount - fee);
    build_tx.sign(0, wallet);
    const tx_hex = build_tx.build().toHex();
    return tx_hex
  },

  /**
   * Get account balance 
   * @param network? option(dev/testnet), auto devnet
   * @param pubkey 
   * @returns false if sth wrong, othws number of sol
   */
  get_balance: async (publicKey: Buffer): Promise<number> => {
    const address = bitcoin.payments.p2pkh({
      pubkey: publicKey,
      network: bitcoin.networks.testnet,
    }).address as string;
    try {
      const balance = await axios.get(`https://api.blockchair.com/bitcoin/testnet/dashboards/address/${address}?limit=1`).then(function (response) {
        return response.data.data[address].address.balance;
      }).catch(function (error) {
        throw new Error(error)
      });
      return balance / 10 ** 8
    }
    catch (e) {
      throw new Error("Something wrong with requests: " + e);
    }
  },


  /** 
   * @TODO callback function on change
   * no need right now 
   */
  track: () => {

  },


  // /**
  //  * Airdrop 1 SOL
  //  * @param network? option(dev/testnet), auto devnet
  //  * @param pubkey 
  //  * @returns
  //  */
  // airdrop_one: async (pubkey: PublicKey, network?: string,): Promise<boolean> => {
  // }
}
