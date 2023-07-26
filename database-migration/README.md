
# Database Setup for Blocommerce Platform ![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)

Database setup for Blocommerce platform.

## Prerequistes 🚁

* Setup PostgreSQL Database
* Create a Database
* Setup Environment Variable in machine

## Setup Enviroment Variables

* BLOCOMMERCE_DB_NAME : DatabaseName 
* BLOCOMMERCE_DB_PORT : Database port e.g. 5432
* BLOCOMMERCE_DB_HOSTNAME : Database hostname e.g. localhost
* BLOCOMMERCE_DB_USERNAME : Database username
* BLOCOMMERCE_DB_PASSWORD : Database password

## How to get started 🎮

Install Sequelize CLI globally:

```
npm i -g sequelize-cli
```

Install NPX globally:

```
npm i -g npx
```

Then install all its dependancies:

```
$ npm install
```

Then you should be able to migrate the datatables to locally create database:

```
$ npx sequelize db:migrate --env local 
```

## Generate New Migration

```
npx sequelize migration:generate --name migration-name
```

## Execute Migration Script 

```
npm run migrate
```
## Undo Last Migration Script 

```
npm run migrate:undo
```