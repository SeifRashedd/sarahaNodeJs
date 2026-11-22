import { client } from '../../database/redis_connection.js'

export const set = async ({ key, value, ttl }) => {
    if (typeof value !== 'string') {
        value = JSON.stringify(value)
    }
    const options = (typeof ttl === 'number' && ttl > 0) ? { EX: ttl } : undefined
    return await client.set(key, value, options)
}


export const get = async ({ key }) => {
    const data = await client.get(key)
    if (!data) return null
    try {
        return JSON.parse(data)
    } catch {
        return data
    }
}

export const incr = async ({ key, incr = 1 }) => {
    return await client.incrBy(key, incr)
}


export const ttl = async ({ key }) => {
    return await client.ttl(key)
}


export const expire = async ({ key, ttl }) => {
    return await client.expire(key, ttl)
}

export const del = async ({ key }) => {
    return await client.del(key)
}


export const keys = async ({ prefix }) => {
    return await client.keys(prefix)
}


export const delByPrefix = async ({ prefix }) => {
    const foundKeys = await keys({ prefix })
    if (!foundKeys || foundKeys.length === 0) return 0
    return await client.del(foundKeys)
}