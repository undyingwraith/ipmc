# IPMC

Interplanetary Media Center

## Abstract

A piece of software made to access media libraries hosted on [IPFS](https://ipfs.io)

## Getting started

### Prerequisites

- nodejs >= v20.12.2
- yarn (installed through [corepack](https://yarnpkg.com/corepack))

### Installing dependencies

```bash
yarn install
```

### Running it in dev mode

Run the following commands in paralell:

```bash
yarn workspace watch
yarn workspace ipmc-desktop run dev
```

*NOTE: for first time install you might need to run a build first*
```bash
yarn build
```

## Packages

### ipmc-interfaces

Defines interfaces for MetaData and services.

### ipmc-core

Contains Services and utilities.

### ipmc-ui

Contains a react app that acts as ui.

### ipmc-desktop

Contains a electron app using the *ipmc-ui*.

## Concepts

### Profiles

- Keep different configurations for ipfs networks.

### Libraries

- Keep different media sources
- bound to profiles

Types:

- Movie/Video
- Music/Audio
- Images
- Comics
