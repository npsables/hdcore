const { account } = require('../dist')
const { payer } = require('./config')

describe('Account SOLANA', function () {
  it('Should be a valid address', async function () {
    const ok = account.createMnemonic()
    if (!ok) throw new Error('Failed mnemonic creation')
  })

  it('Should be a valid address 2', async function () {
    const ok = account.createMnemonic(128)
    if (!ok) throw new Error('Failed mnemonic creation')
  })

  it('Should be a valid address 2', async function () {
    const ok = account.createMnemonic(128)
    if (!ok) throw new Error('Failed mnemonic creation')
  })

})
