# Pocket

This is the monorepo for Pocket.

## What's inside ?

It includes the following apps and packages:

### Apps

- `web-parent`: a [Next.js](https://nextjs.org) app for the parent portal
- `web-child`: another [Next.js](https://nextjs.org) app for the children portal
- `landing-page`: another [Next.js](https://nextjs.org) app for the landing page
- `api`: a [NestJS](https://nestjs.com/) app for the api

### Packages

- `nest-auth`: a library to manage authentication through `Next.js` and `NestJS`
- `prisma`: a library used to managed our connection to our database
- `pocket-contract`: a package used to develop the smart-contract with `hardhat`
- `types`: a library used to share Typescript interfaces between apps
- `config`: configurations used throughout the monorepo
- `tsconfig`: Typescript configurations used throughout the monorepo
  `ui`: a library of UI components used through the apps

## Setup

This repository uses many dependencies to run correctly.

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [yarn v1](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
- [Docker](https://www.docker.com/) - Used to run the `postgres` container.

### Environnement variables

You must setup a `.env` in the root of the monorepo and in the `prisma` package.

You can look at the `.env.example` in the corresponding directory to see which variables are necessary.

### Developement

To develop all apps and packages, run the following commands:

```bash
# install the different dependencies
yarn

# if you don't have a postgres container already, use this to launch it
yarn p docker:up

# fork the mainnet (must be in a different terminal since it's blocking)
yarn fork

# run the dev script on all apps/packages
yarn dev # this will also seed the db + contract
```

The `Next.js` apps will be available on http://localhost:3000, http://localhost:4000 and http://localhost:4500

The `api` will be available on http://localhost:5000

## Useful commands

There is many commands available to facilitate working with the repo:

### Alias

```bash
# run a command in pocket-contract package
yarn c run_command

# run a command in prisma package
yarn p run_command

# examples
yarn c hardhat test

yarn p studio
```

You can still use the full commands shown below to run a command in any package.

### Add or remove a dependency

`yarn workspace app_or_package_name add [-D] dependency_name`

`yarn workspace app_or_package_name remove dependency_name`

```bash
# add dependency
yarn workspace api add axios
yarn workspace api add -D typescript

# remove dependency
yarn workspace api remove axios
```

### Run a script inside a package

`yarn workspace app_or_package_name run script_name`

```bash
# run the script inside @lib/prisma
yarn workspace @lib/prisma run db:studio
```

## Authors

- [Theo Palhol](https://github.com/tipii)
- [Solal Dunckel](https://github.com/solaldunckel)
- [Guillaume Dupont](https://github.com/GuiDupont)
- [Sami Darnaud](https://github.com/sadarnau)
