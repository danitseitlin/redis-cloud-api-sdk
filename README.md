# rl-cloud-api-sdk
### What is this module for?
This project is an SDK for the Cloud API product of Redislabs Cloud. <br>
This project is a module in https://www.npmjs.com/package/rl-cloud-api-sdk that can be used to perform API requests of Cloud API.<br>
Below are a few simple usages on how to setup the module and use it. <br>

### How to use:
Run the following command in your IDEA terminal:

`npm i rl-cloud-api-sdk`
<br>
### How to initialize:
```
const client = new CloudAPISDK({
    accessKey: 'API access key',
    secretKey: 'API secret key',
});

//basic usage
const accountInformation = await client.getAccountInformation();
```

All the API calls from the official Swagger documentation are covered in the SDK
(https://api.redislabs.com/v1/swagger-ui.html).

![Integration testing](https://github.com/danitseitlin/rl-cloud-api-sdk/workflows/Integration%20testing/badge.svg)
![Unit testing](https://github.com/danitseitlin/rl-cloud-api-sdk/workflows/Unit%20testing/badge.svg)
