# IPMC

Interplanetary Media Center

![GitHub Repo stars](https://img.shields.io/github/stars/undyingwraith/ipmc)
![GitHub License](https://img.shields.io/github/license/undyingwraith/ipmc)


A piece of software made to access media libraries hosted on [IPFS](https://ipfs.io).

## Screenshots

![screenshot](./docs/images/screenshot1.png)

## Documentation

The documentation can be found [here](./docs/README.md)

## Getting started

### Prerequisites

- nodejs >= v20.12.2
- yarn (installed through [corepack](https://yarnpkg.com/corepack))

### Clone the repository

```shell
git clone https://github.com/mfts/papermark.git
cd papermark
```

### Installing dependencies

```shell
yarn install
```

### Running it in dev mode

Run the following commands in paralell:

```shell
yarn workspace watch
yarn workspace ipmc-desktop run dev
```

*NOTE: for first time install you might need to run a build first*
```shell
yarn build
```

## Packages

| Path | Name | Description |
| - | - | - |
| ./packages/interfaces | **ipmc-interfaces** | Defines interfaces for MetaData and services. |
| ./packages/core | **ipmc-core** | Contains Services and utilities. |
| ./packages/ui | **ipmc-ui** | Contains a react app that acts as ui. |
| ./packages/desktop | **ipmc-desktop** | Contains a electron app using the *ipmc-ui*. |
| ./packages/webui | **ipmc-webui** | Contains a react app using the *ipmc-ui*. |

## Contributing
1. Fork the repository.
2. Create a new branch: `git checkout -b feature/feature-name`.
3. Make your changes.
4. Push your branch: `git push origin feature/feature-name`.
5. Create a pull request.

## License
This project is licensed under the [MIT License](LICENSE).

## Contributors

<a href="https://github.com/undyingwraith/ipmc/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=undyingwraith/ipmc" />
</a>
