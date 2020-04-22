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
        required?: boolean
    }[]
}

/**
 * type: 'integer',
    defaultValue: 1,
    required: false
 */

/**
 * [ { name: 'RedisBloom',
    description: 'Bloom Filter Module for Redis',
    parameters: [] },
  { name: 'RedisGraph',
    description:
     'A graph database on top of Redis which supports Open-Cypher query language',
    parameters: [ [Object] ] },
  { name: 'RedisJSON',
    description: 'Native JSON Data Type for Redis',
    parameters: [] },
  { name: 'RediSearch',
    description: 'High performance search index on top of Redis',
    parameters: [ [Object] ] } ]
 */