import multer from "multer"
import fs from 'fs'
import { fileTypeFromBuffer, fileTypeFromFile } from 'file-type';
import { badRequestException } from "../utils/exception.js";
import { promise } from "zod";


export let fileTypes = {
    image: ['image/jpeg', 'image/png', 'image/jpg'],
    video: ['video/mp4', 'video/avi', 'video/mov'],
    audio: ['audio/mpeg', 'audio/wav'],
    pdf: ['application/pdf']
}

export const multerMiddleware = ({ storageFolder = 'general', types = [fileTypes.image] }) => {
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            let folderPath = './uploads/' + storageFolder
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true })
            }
            cb(null, folderPath)
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname)
        }
    })
    let fileFilter = function (req, file, cb) {
        let result = fileTypeFromFile()
        if (!types.includes(file.mimetype)) {
            cb(new Error('Invalid file type'), false)
        } else {
            cb(null, true)
        }
    }

    return multer({
        storage, fileFilter
    })
}


export const proccesFile = (types = [fileTypes.image]) => {
    return async (req, res, next) => {
        if (req.file) {
            req.file = await checlFile({ file, storageFolder, types })
        }
        else if (Array.isArray(req.files) && req.files.length > 0) {
            let data = []
            for (const file of req.files) {
                data.push(checlFile({ file, storageFolder, types }))
            }
            req.files = await promise.all(data)
        }
        else if (typeof req.files== 'object' && Object.keys(req.files).length>0){
            
        }
        

        next()
    }
}




const checlFile = async ({ file, storageFolder, types }) => {
    let result
    if (file.buffer) {
        result = await fileTypeFromBuffer(file.buffer)
    } else {
        result = await fileTypeFromFile(file.path)
    }
    if (!types.includes(result.mime) || req.file.mimetype !== result.mime) {
        fs.unlinkSync(req.file.path)
        badRequestException('File type not allowed')
    }

    if (file.buffer) {
        let dirPath = `./uploads/${storageFolder}`
        let fullPath = `${dirPath}/${Date.now()}-${file.original}`
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true })
        }
        fs.writeFileSync(fullPath, file.buffer)
        req.file.path = fullPath
    }
    return file
}