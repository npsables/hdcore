# hdcore

Core of HD wallet

# Usage

+ Create account:
   - Use * from account.ts (createMasterAccount, createChildAccount) => {'pub': ..., 'prv': ..., }
   - Create master account function auto have the PATH, only pass PATH as parameter when you want create child keys... for general upgrade purposes.
    - User desgin to have number of Key generations (by useing path generation)
+ Other utils functions: 
    - Get each blockchain function in constants.ts 
    - Get publickey
    - Get address
    - Get derivation path (auto hardened)