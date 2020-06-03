# rl-cloud-api-sdk
![Integration testing](https://github.com/danitseitlin/rl-cloud-api-sdk/workflows/Integration%20testing/badge.svg)
![Unit testing](https://github.com/danitseitlin/rl-cloud-api-sdk/workflows/Unit%20testing/badge.svg)

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

You can find the API documentaion in this swagger link(https://api.redislabs.com/v1/swagger-ui.html)

