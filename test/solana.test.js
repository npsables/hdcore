const { account } = require('../dist')
const { payer } = require('./config')
const chainID = 501

describe('Account SOLANA', function () {
  it('Should be a valid address', async function () {
    const ok = account.createMnemonic()
    if (!ok) throw new Error('Failed mnemonic creation')
  })

  it('Should be valid seed', async function () {
    const a =  account.createMnemonic()    
    const ok = account.createSeed(a)
    if (!ok) throw new Error('Failed seed creation')
  })
  
  it('Should be valid master key pair', async function () {
    const a =  account.createMnemonic()    
    const seed = account.createSeed(a)
    const ok = account.createMasterAccount(501, seed)
    if (!ok) throw new Error('Failed mnemonic creation')
  })

  it('Should be valid child key pair', async function () {
    const a =  account.createMnemonic()    
    const seed = account.createSeed(a)
    const path = account.getPath(501,10)
    // console.log(path)
    const ok = account.createChildAccount('501', seed, path)
    if (!ok) throw new Error('Failed mnemonic creation')
  })

  it('Should be valid public address', async function () {
    const a =  account.createMnemonic()    
    const seed = account.createSeed(a)
    const path = account.getPath(501,10)
    // console.log(path)
    const keys = account.createChildAccount(501, seed, path)
    ok = account.getAddress(keys.pub, 501)
    if (!ok) throw new Error('Failed mnemonic creation')
  })

  it('Should be a child generated from given mnemonic', async function () {
    const mnem = payer.mnemonic
    const seed = account.createSeed(mnem)
    const path = account.getPath(501,10)
    // console.log(path)
    const keys = account.createChildAccount(501, seed, path)
    const address = account.getAddress(keys.pub, 501) 
    if (address != payer['m/44\'/501\'/0\'/0\'/10\'']) throw new Error('Failed mnemonic creation')
  })

})
