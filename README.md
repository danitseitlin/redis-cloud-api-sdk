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
| function              | API endpoint | Usage                                  |
| --------------------- | ------------ | -------------------------------------- |
| getAccountInformation | `/`          | `await client.getAccountInformation()` |
You can find the API documentation [here](https://api.redislabs.com/v1/swagger-ui.html)

![Unit testing](https://github.com/RedisLabs/rl-cloud-api-sdk/workflows/Unit%20testing/badge.svg) ![Integration testing](https://github.com/RedisLabs/rl-cloud-api-sdk/workflows/Integration%20testing/badge.svg)
