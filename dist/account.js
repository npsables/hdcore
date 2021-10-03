import { Keypair } from '@solana/web3.js';
createAccount: () => {
    return Keypair.generate();
};
