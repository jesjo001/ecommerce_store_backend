import S3 from 'aws-sdk/clients/s3'
import fs from 'fs'
import dotenv from "dotenv";
dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env. AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCEESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY


const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

//upload a file to s3
const uploadFile = (file : any ) =>{
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket: bucketName as string,
        Body: fileStream as any,
        Key: file.filename as string
    }

    return s3.upload(uploadParams).promise()
}

export const getFileStream = (fileKey: any) => {
    const downloadParams = {
        Key: fileKey as any,
        Bucket: bucketName as string
    }

    return s3.getObject(downloadParams).createReadStream()

}

export default uploadFile;