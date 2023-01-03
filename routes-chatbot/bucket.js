require('dotenv').config();
const {
    getSignedUrl
} = require("@aws-sdk/s3-request-presigner")
const {
    S3Client,PutObjectCommand,GetObjectCommand
} = require("@aws-sdk/client-s3");


const bucketName= process.env.AWS_Bucket_Name;
const region= process.env.AWS_Bucket_Region;
const AccessKey= process.env.AWS_Access_Key;
const SecretKey= process.env.AWS_Secret_Key;

const s3= new S3Client({
    credentials:{
        accessKeyId:AccessKey,
        secretAccessKey:SecretKey
    },
    region:region
})

/*************Upload file****************/

async function uploadFile(file,fileName){
    try {

       const uploadParams = {
           Bucket: bucketName,
           Body: file.buffer,
           Key: fileName,
           ContentType:file.mimetype
       }

       const command = new PutObjectCommand(uploadParams)

       const result = await s3.send(command);

       console.log(result)

    } catch (error) {
        console.log(error.message)
    }
    
}
exports.uploadFile= uploadFile;

/**********Download file*************/
async function downloadFile(fileKey){
    try {
        const getObjectCommandParams = {
            Bucket: bucketName,
            Key: `${fileKey}`
        }
        const command = new GetObjectCommand(getObjectCommandParams);
        const url = await getSignedUrl(s3, command, {
            expiresIn: 3600
        })

        return url;
        
    } catch (error) {
       console.log(error.message) 
    }
 
}

exports.downloadFile= downloadFile;
