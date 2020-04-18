# rl-cloud-api-sdk
### What is this module for? ###
This module is a SDK for the RedisLabs Cloud API. </br>
Customers of the Cloud API can use this simple SDK for easier usage of the product.

### How to initialize: ###
```
const cloudAPISDKParameters: CloudAPISDKParameters = {
    accessKey: 'API access key',
    secretKey: 'API secret key',
};
const cloudAPIClient: CloudAPISDK = new CloudAPISDK(cloudAPISDKParameters);
```

### An example for usage: ###
```
//Getting account information
const accountInformation = await cloudAPIClient.getAccountInformation();
```

All the API calls from the official Swagger documentation are covered in the SDK
(https://api.redislabs.com/v1/swagger-ui.html).

![Integration testings](https://github.com/danitseitlin/rl-cloud-api-sdk/workflows/Integration%20testings/badge.svg)
![Unit testing](https://github.com/danitseitlin/rl-cloud-api-sdk/workflows/Unit%20testing/badge.svg)
