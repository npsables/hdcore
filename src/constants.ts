import {
  create_solana_pair,
  get_solana_address,
  solana_tx,
  create_bitcoin_testnet_pair,
  get_bitcoin_testnet_address,
  bitcoin_tn_tx,
  create_ethereum_pair,
  get_ethereum_address,
  ethereum_tx
} from "./wallet";

// SOL constant
export const DEFAULT_EMPTY_ADDRESS: string = "11111111111111111111111111111111";
export const DEFAULT_WSOL: string =
  "So11111111111111111111111111111111111111112";

// ETH constant
export const PROVIDER_ROPSTEN = "https://ropsten.infura.io/v3/101a5ebde7e545d9a7bca647752caa91";

const COMPONENTS: any = {
  "0": {
    index: "0",
    hex: "0x80000000",
    symbol: "BTC",
    name: "Bitcoin",
    link: "https://bitcoin.org/",
  },

  "1": {
    index: "1",
    hex: "0x80000001",
    symbol: "BTCT",
    name: "Testnet (all coins)",
    key_pair_master: create_bitcoin_testnet_pair,
    get_address: get_bitcoin_testnet_address,
    transaction: bitcoin_tn_tx,

  },

  "501": {
    index: "501",
    hex: "0x800001f5",
    symbol: "SOL",
    name: "Solana",
    link: "https://solana.com",
    key_pair_master: create_solana_pair,
    get_address: get_solana_address,
    transaction: solana_tx,
  },

  "60": {
    index: "60",
    hex: "0x8000003c",
    symbol: "ETH",
    name: "Ether",
    link: "https://ethereum.org/ether",
    key_pair_master: create_ethereum_pair,
    get_address: get_ethereum_address,
    transaction: ethereum_tx,
  },
};

export default COMPONENTS;
