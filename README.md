## Prerequisites

This project requires NodeJS (version 16 or later), PNPM and docker (recommended but optional).
[Node](http://nodejs.org/), [PNPM](https://pnpm.io/) and [Docker](https://www.docker.com/) are really easy to install.
To make sure you have them available on your machine,
try running the following command.

```sh
$ pnpm -v && node -v && docker -v
```

## Table of contents

- [Project Name](#project-name)
  - [Prerequisites](#prerequisites)
  - [Table of contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Installation](#installation)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

Start with cloning this repo on your local machine:

```sh
$ git clone https://github.com/Yedidyar/toast-tracker
$ cd toast-tracker
```

To install and set up, run:

```sh
$ pnpm install
```

### Setup Database

You can do it without Docker, but Docker is the easiest.

```sh
$ docker compose up
```

Sync the db:

```sh
$ pnpx prisma db push
# for an admin panel
$ pnpx prisma studio
```

### Setup Next Auth

The simple way is to use the [discord provider](https://next-auth.js.org/providers/discord).

You should fill out the rest of the environment variables with mock data since the environment variables will be validated at runtime.

### Serving the app

don't forget to add the env file see the [env.example](https://github.com/Yedidyar/toast-tracker/blob/2127685845d31d1d29f26a932b8aa3fcd4ba5edd/.env.example)

```sh
$ pnpm run dev
```
