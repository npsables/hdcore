import { create_solana_pair,
          } from "./wallet" 
// export const ARRAY_INDEX  = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
export const COMPONENTS = {
    "0": {
        "index": "0",
        "hex": "0x80000000",
        "symbol": "BTC",
        "name": "Bitcoin",
        "link": "https://bitcoin.org/"
      },

    "501": {
      "index": "501",
      "hex": "0x800001f5",
      "symbol": "SOL",
      "name": "Solana",
      "link": "https://solana.com",
      key_pair_master: create_solana_pair,
    },

    "60": {
      "index": "60",
      "hex": "0x8000003c",
      "symbol": "ETH",
      "name": "Ether",
      "link": "https://ethereum.org/ether"
    },
}