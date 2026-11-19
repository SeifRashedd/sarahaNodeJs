import { client } from '../../database/redis_connection.js'

export const set = async ({ key, value, ttl }) => {
    if (typeof value !== 'string') {
        value = JSON.stringify(value)
    }
    return await client.set(key, value, { EX: ttl })
}


export const get = async ({ key }) => {
    try {
        return JSON.parse(await client.get(key))
    } catch {
        return await client.get(key)
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
    return await client.del(await keys({ prefix }))
}