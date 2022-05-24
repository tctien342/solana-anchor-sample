# SOLANA TODOCHAIN DAPP

> Learning about the Anchor and Solana with TODOCHAIN

<b>TODOCHAIN</b> is an application for learning about `solana` blockchain. It built with `Anchor` framework and using `NextJS` as frontend.

# Folder Structure

```bash
├── programs------------------------ Solana contract's source code
│   └── solana_sample
│       └── src
├── src----------------------------- NextJS frontend application
│   ├── components
│   ├── configs
│   ├── hooks
│   ├── layouts
│   ├── pages
│   ├── states
│   ├── styles
│   ├── types
│   └── utils
└── tests--------------------------- Contract and Application tests
```
### Requirements
+ `NodeJS` and `Rustup` for compile source code
+ `solana-cli` needed for deploy and test
+ `yarn` for running node command


### Commands
+ `yarn app:dev` for start application's development
+ `yarn app:build` for building application
+ `yarn app:start` start NextJS's production build
+ `yarn anchor:build` build anchor's source code then copy `type` into src FE
+ `yarn anchor:test` build then run test and copy `idl` info FE's config folder

# Feature
+ Anchor framework
+ NextJS + RecoilJS + TailwindCSS