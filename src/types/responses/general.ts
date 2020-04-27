export type AccountInformation = {
    id: number,
    name: string,
    createdTimestamp: string,
    updatedTimestamp: string,
    key: {
        name: string,
        accountId: number,
        accountName: string,
        allowedSourceIps: string[],
        createdTimestamp: string,
        owner: {
            name: string,
            email: string
        },
        httpSourceIp: string,
        [key: string]: any
    },
    [key: string]: any
}

export type DatabaseModule = {
    name: string,
    description: string,
    parameters: {
        name?: string,
        description?: string,
        type?: string,
        defaultValue?: number,
        required?: boolean,
        [key: string]: any
    }[],
    [key: string]: any
}

export type SystemLog = {
    id: number,
    time: string,
    originator: string,
    apiKeyName: string,
    type: string,
    description: string,
    [key: string]: any
}

export type PaymentMethod = {
    id: number,
    type: string,
    creditCardEndsWith: number,
    nameOnCard: string,
    expirationMonth: number,
    expirationYear: number
}

export type Plan = {
    id: number,
    name: string,
    provider: string,
    region: string,
    price: number,
    priceCurrency: string,
    pricePeriod: string,
    supportsRedisOnFlash: boolean,
    supportsMultipleAvailabilityZones: boolean,
    maximumNumberOfDatabases: number,
    memorySizeInMb: number,
    throughputOperationsPerSecond: number,
    planType: string,
    [key: string]: any
}

export type Region = {
    name: string,
    provider: string,
    [key: string]: any
}