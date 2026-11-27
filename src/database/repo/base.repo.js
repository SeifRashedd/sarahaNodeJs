export default (model) => {
    return {
        findOne: async ({ filter, projection, options, populate }) => {
            let data = await model.findOne(filter, projection, options).populate(populate || undefined)
            return data
        },

        findOneAndUpdate: async ({ filter, update, options, populate }) => {
            let data = await model.findOneAndUpdate(filter, update, { returnDocument: 'after', ...options }).populate(populate || undefined)
            return data
        },

        findById: async ({ id, projection, options, populate }) => {
            let data = await model.findById(id, projection, options).populate(populate || undefined)
            return data
        },

        findByIdAndUpdate: async ({ id, update, options, populate }) => {
            let data = await model.findByIdAndUpdate(id, update, { returnDocument: 'after', ...options }).populate(populate || undefined)
            return data
        },

        create: async ({ data, options }) => {
            return await model.create(data, options)
        },

        updateOne: async ({ filter, update, options }) => {
            return await model.updateOne(filter, update, options)
        },

        updateMany: async ({ filter, update, options }) => {
            return await model.updateMany(filter, update, options)
        },

        deleteOne: async ({ filter }) => {
            return await model.deleteOne(filter)
        },

        delByPrefix: async ({ prefix }) => {
            return await model.deleteMany({ key: { $regex: prefix } })
        },

        findOneAndDelete: async ({ filter }) => {
            let data = await model.findOneAndDelete(filter)
            return data
        },

        findByIdAndDelete: async ({ id }) => {
            let data = await model.findByIdAndDelete(id)
            return data
        },

        deleteMany: async ({ filter }) => {
            return await model.deleteMany(filter)
        },

        pagination: async ({ filter, page, limit, sort = undefined, populate }) => {
            page = Number(page) || 1
            limit = Number(limit) || 10
            let skip = (page - 1) * limit
            let query = model.find(filter).skip(skip).limit(limit)

            if (sort) {
                query.sort(sort)
            }

            if (populate) {
                query.populate(populate)
            }

            return await query.exec()
        }
    }
}