<p align='center'>
  <a href='https://www.npmjs.com/package/rl-cloud-api-sdk'>
    <img src='https://img.shields.io/npm/v/rl-cloud-api-sdk/latest?style=plastic' target='_blank' />
  </a>
  <a href='https://npmjs.org/package/rl-cloud-api-sdk' style='width:25px;height:20px;'>
    <img src='https://img.shields.io/npm/dm/rl-cloud-api-sdk.svg?color=blue&style=plastic' target='_blank' />
  </a>
  <a href='https://github.com/RedisLabs/rl-cloud-api-sdk/issues' style='width:25px;height:20px;'>
    <img src='https://img.shields.io/github/issues/RedisLabs/rl-cloud-api-sdk?style=plastic' target='_blank' />
  </a>
  <a href='https://npmjs.org/package/rl-cloud-api-sdk' style='width:25px;height:20px;'>
    <img src='https://img.shields.io/bundlephobia/min/rl-cloud-api-sdk/latest?style=plastic' target='_blank' />
  </a>
  <a href='https://github.com/RedisLabs/rl-cloud-api-sdk/commits/master'>
    <img src='https://img.shields.io/github/last-commit/RedisLabs/rl-cloud-api-sdk?style=plastic' />
  </a>
  <a href='https://github.com/RedisLabs/rl-cloud-api-sdk/blob/master/LICENSE'>
    <img src='https://img.shields.io/badge/license-BSD%203%20Clause-blue.svg?style=plastic' target='_blank' />
  </a>
</p></p>

## About
This NodeJS module is an SDK for the [Redis Cloud REST API](https://docs.redislabs.com/latest/rc/api/).
You can use [this module](https://www.npmjs.com/package/rl-cloud-api-sdk) to develop againts Redis Cloud REST API.

## Quick Start

### Install the module
Run the following command in your terminal:

`npm i rl-cloud-api-sdk`

### Initialize the module
To start using to API you first need to enable it and generate your API keys. You can follow the instructions [here](https://docs.redislabs.com/latest/rc/api/how-to/create-api-keys-for-your-team/). 

It is recommended not to save your API secrets inside your code.

This is how you create a client:
```
const client = new CloudAPISDK({
    accessKey: 'API access key',
    secretKey: 'API secret key',
});
```

This is how you call a specific API:
```
//basic usage
const accountInformation = await client.getAccountInformation();
```
# Existing functions vs API Endpoints
| Section        | Function                  | API endpoint                          | Usage                                  |
|--------------- | ------------------------- | ------------------------------------- | -------------------------------------- |
| Account        | getAccountInformation            | `/`                                   | `await client.getAccountInformation()`                                    |
| Account        | getDataPersistences              | `/data-persistence`                   | `await client.getDataPersistence()`                                       |
| Account        | getDatabaseModules               | `/database-modules`                   | `await client.getDatabasesModules()`                                      |
| Account        | getSystemLogs                    | `/logs?limit=1&offset=3`              | `await client.getSystemLogs(1, 3)`                                        |
| Account        | getPaymentMethods                | `/payment-methods`                    | `await client.getPaymentMethods()`                                        |
| Account        | getPlans                         | `/plans?provider=AWS`                 | `await client.getPlans('AWS')`                                            |
| Account        | getRegions                       | `/regions?provider=AWS`               | `await client.getRegions('AWS')`                                          |
| Susbscriptions | getSubscriptions                 | `/subscriptions`                      | `await client.getSubscriptions()`                                         |
| Susbscriptions | createSubscription               | `/subscriptions`                      | `await client.createSubscription({name: 'sub1', ....})`                   |
| Susbscriptions | getSubscription                  | `/subscriptions/1`                    | `await client.updateSubscription(1, {name: 'sub1'...})`                   |
| Susbscriptions | updateSubscription               | `/subscriptions/1`                    | `await client.updateSubscription(1, {name: 'sub1'...})`                   |
| Susbscriptions | deleteSubscription               | `/subscriptions/1`                    | `await client.deleteSubscription(1)`                                      |
| Susbscriptions | getSubscriptionCidrWhitelist     | `/subscriptions/1/cidr`               | `await client.getSubscriptionCidrWhitelist(1)`                            |
| Susbscriptions | updateSubscriptionCidrWhitelists | `/subscriptions/1/cidr`               | `await client.updateSubscriptionCidrWhitelists(1, {cidrIps: [...], ..})`  |
| Susbscriptions | getVpcPeerings                   | `/subscriptions/1/peerings`           | `await client.getVpcPeerings(1)`                                          |
| Susbscriptions | createSubscriptionVpcPeering     | `/subscriptions/1/peerings`           | `await client.createSubscriptionVpcPeering(1, {region: 'us-east-1',...})` |
| Susbscriptions | deleteSubscriptionVpcPeering     | `/subscriptions/1/peerings/1`         | `await client.deleteSubscriptionVpcPeering(1, 1)`                         |
| Databases      | getDatabases                     | `/subscriptions/1/databases`          | `await client.getDatabases()`                                             |
| Databases      | createDatabase                   | `/subscriptions/1/databases`          | `await client.createDatabase(1, {name: 'db1', ..})`                       |
| Databases      | getDatabase                      | `/subscriptions/1/databases/1`        | `await client.getDatabase(1, 1)`                                          |
| Databases      | updateDatabase                   | `/subscriptions/1/databases/1`        | `await client.updateDatabase(1, 1, {name: 'db2', ..})`                    |
| Databases      | deleteDatabase                   | `/subscriptions/1/databases/1`        | `await client.deleteDatabase(1, 1)`                                       |
| Databases      | backupDatabase                   | `/subscriptions/1/databases/1/backup` | `await client.backupDatabase(1, 1)`                                       |
| Databases      | importIntoDatabase               | `/subscriptions/1/databases/1/import` | `await client.importIntoDatabase(1, 1, {importFromUri: 's3://...'})`      |
| Cloud Accounts | getCloudAccounts                 | `/cloud-accounts`                     | `await client.getCloudAccounts()`                                         |
| Cloud Accounts | createCloudAccount               | `/cloud-accouts`                      | `await client.createCloudAccount({name: 'c1'...})`                        |
| Cloud Accounts | getCloudAccount                  | `/cloud-accounts/1`                   | `await client.getCloudAccount(1)`                                         |
| Cloud Accounts | updateCloudAccount               | `/cloud-accounts/1`                   | `await client.updateCloudAccount(1)`                                      |
| Cloud Accounts | deleteCloudAccount               | `/cloud-accounts/1`                   | `await client.deleteCloudAccount(1)`                                      |
| Tasks          | getTasks                         | `/tasks`                              | `await client.getTasks()`                                                 |
| Tasks          | getTask                          | `/tasks/1`                            | `await client.getTask()`                                                  |

You can find the API documentation [here](https://api.redislabs.com/v1/swagger-ui.html)

![Unit testing](https://github.com/RedisLabs/rl-cloud-api-sdk/workflows/Unit%20testing/badge.svg) ![Integration testing](https://github.com/RedisLabs/rl-cloud-api-sdk/workflows/Integration%20testing/badge.svg)
