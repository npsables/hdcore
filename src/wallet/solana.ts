import {
     Connection,
     Transaction,
     SystemProgram,
     Keypair,
     PublicKey,
     clusterApiUrl,
     LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import * as nacl from "tweetnacl";

/**
 * Create Solana key pair
 * @param seed string
 * @param path string, if no path passed, create master key pair
 * @returns true/false
 */
export const create_solana_pair = (
     seed: string | Buffer,
     path?: string
): {} => {
     if (!path) {
          path = `m/44'/501'/0'/0'`;
     }
     if (typeof seed === "object") {
          seed = seed.toString("hex");
     }
     const derive_seed = derivePath(path, seed).key.toString("hex");
     const derive_arr = Uint8Array.from(Buffer.from(derive_seed, "hex"));
     const sec = nacl.sign.keyPair.fromSeed(derive_arr).secretKey;
     const pair = Keypair.fromSecretKey(sec);

     if (!pair) throw new Error("Cannot get Keypair");
     if (!PublicKey.isOnCurve(pair.publicKey.toBuffer()))
          throw new Error("Invalid PublicKey generation");
     return { pub: pair.publicKey, prv: pair.secretKey };
};

/**
 * get address of account
 * @param publicKey publicKey from solanajs
 * @returns base58 string
 */
export const get_solana_address = (publicKey: PublicKey): boolean | string => {
     try {
          const pub = new PublicKey(publicKey);
          if (!pub) throw new Error("Invalid public key");
          return publicKey.toBase58();
     } catch (e) {
          return false;
     }
};

const isAddress = (address: string | undefined): boolean => {
     if (!address) throw new Error("Address must not be empty");
     try {
          const pub = new PublicKey(address);
          if (!pub) throw new Error("Invalid address");
     } catch (er) {
          return false;
     }
     return true;
};

const isPublicKey = (pubkey: PublicKey | undefined): boolean => {
     if (!pubkey) throw new Error("Public key must not be empty");
     try {
          const pub = new PublicKey(pubkey);
          if (!pub) throw new Error("Invalid public key");
     } catch (er) {
          return false;
     }
     return true;
};

export const solana_tx = {
     /**
      * Get lamports to reciever address
      * @param keyPair Keypair
      * @param recieveAddress? address of reciever
      * @param amount amount of SOL to
      * @param network option(dev/testnet), auto devnet
      * @returns trans id
      */
     send: async (
          keypair: Keypair,
          recieveAddress: string,
          amount: number,
          network?: string
     ): Promise<string | boolean> => {
          if (!isAddress(recieveAddress)) throw new Error("Invalid reciever address");
          if (!keypair) throw new Error("Keypair cannot be empty");
          const rcvpubkey = new PublicKey(recieveAddress);
          const pubkey = keypair.publicKey;
          // Build tx
          if (!network) {
               network = clusterApiUrl("devnet");
          }
          const connection = new Connection(network, "confirmed");
          const { blockhash } = await connection.getRecentBlockhash("confirmed");
          const instruction = SystemProgram.transfer({
               fromPubkey: pubkey,
               toPubkey: rcvpubkey,
               lamports: amount*10**9,
          });

          let transaction = new Transaction();
          transaction.recentBlockhash = blockhash;
          transaction.add(instruction);
          transaction.feePayer = pubkey;
          // Sign tx
          const signature = await solana_tx.signTransaction(transaction, keypair);
          transaction.addSignature(pubkey, signature);
          // Send tx
          const txId = await solana_tx.sendTransaction(transaction, connection);
          return txId;
     },


     /**
      * Get account balance
      * @param network? option(dev/testnet), auto devnet
      * @param pubkey
      * @returns false if sth wrong, othws number of sol
      */
     get_balance: async (
          pubkey: PublicKey,
          network?: string
     ): Promise<number | boolean> => {
          if (!network) {
               network = clusterApiUrl("devnet");
          }
          if (!isPublicKey(pubkey)) throw new Error("Invalid public key");
          const connection = new Connection(network, "confirmed");
          const sol = await connection.getBalance(pubkey);
          return sol / 10 ** 9;
     },

     /**
      * @TODO callback function on change
      * no need right now
      */
     track: () => { },


     /**
      * Airdrop 1 SOL
      * @param network? option(dev/testnet), auto devnet
      * @param pubkey
      * @returns
      */
     airdrop_one: async (
          pubkey: PublicKey,
          network?: string
     ): Promise<boolean> => {
          if (!network) {
               network = clusterApiUrl("devnet");
          }
          if (!isPublicKey(pubkey)) throw new Error("Invalid public key");
          const connection = new Connection(network, "confirmed");
          const signature = await connection.requestAirdrop(pubkey, LAMPORTS_PER_SOL);
          await connection.confirmTransaction(signature);
          return true;
     },


     // sub function dont use
     signTransaction: async (transaction: Transaction, keypair: Keypair) => {
          const signData = transaction.serializeMessage();
          const signature = nacl.sign.detached(signData, keypair.secretKey);
          const buff_signature = Buffer.from(signature);
          return buff_signature;
     },

     // sub function dont use
     sendTransaction: async (transaction: Transaction, connection: Connection) => {
          const tx = transaction.serialize();
          const txId = await connection.sendRawTransaction(tx, {
               skipPreflight: true,
               preflightCommitment: "confirmed",
          });
          const {
               value: { err },
          } = await connection.confirmTransaction(txId, "confirmed");

          // TODO: Debug transaction
          if (err) throw new Error("Sthing wrong with transaction");
          return txId;
     },
}
