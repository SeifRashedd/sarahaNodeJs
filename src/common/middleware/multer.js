import multer from "multer"
import fs from 'fs'
import { fileTypeFromBuffer, fileTypeFromFile } from 'file-type';
import { badRequestException } from "../utils/exception.js";


export let fileTypes = {
    image: ['image/jpeg', 'image/png', 'image/jpg'],
    video: ['video/mp4', 'video/avi', 'video/mov'],
    audio: ['audio/mpeg', 'audio/wav'],
    pdf: ['application/pdf']
}

export const multerMiddleware = ({ storageFolder = 'general', types = [fileTypes.image] } = {}) => {
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            let folderPath = './uploads/' + storageFolder
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true })
            }
            cb(null, folderPath)
        },
        filename: function (req, file, cb) {
            // random part: two files uploaded in the same millisecond would otherwise get the same name and overwrite each other
            cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + "-" + file.originalname)
        }
    })
    let fileFilter = function (req, file, cb) {
        if (!types.flat().includes(file.mimetype)) {
            cb(new Error('Invalid file type', { cause: 400 }), false)
        } else {
            cb(null, true)
        }
    }

    return multer({
        storage, fileFilter
    })
}


export const proccesFile = (types = [fileTypes.image], storageFolder = 'general') => {
    return async (req, res, next) => {
        if (req.file) {
            req.file = await checkFile({ file: req.file, storageFolder, types })
        }
        else if (Array.isArray(req.files) && req.files.length > 0) {
            let data = []
            for (const file of req.files) {
                data.push(checkFile({ file, storageFolder, types }))
            }
            req.files = await Promise.all(data)
        }
        else if (typeof req.files== 'object' && Object.keys(req.files).length>0){
            for (const field in req.files) {
                let data = []
                for (const file of req.files[field]) {
                    data.push(checkFile({ file, storageFolder, types }))
                }
                req.files[field] = await Promise.all(data)
            }
        }
        next()
    }
}




const checkFile = async ({ file, storageFolder, types }) => {
    let result
    if (file.buffer) {
        result = await fileTypeFromBuffer(file.buffer)
    } else {
        result = await fileTypeFromFile(file.path)
    }
    if (!result || !types.flat().includes(result.mime) || file.mimetype !== result.mime) {
        if (file.path) fs.unlinkSync(file.path)
        badRequestException({ message: 'File type not allowed' })
    }

    if (file.buffer) {
        let dirPath = `./uploads/${storageFolder}`
        let fullPath = `${dirPath}/${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true })
        }
        fs.writeFileSync(fullPath, file.buffer)
        file.path = fullPath
    }
    return file
}
