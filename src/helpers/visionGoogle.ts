
import { Request, Response, response } from 'express';
import multer from 'multer'
const vision = require('@google-cloud/vision')
import path from 'path'
import fs from 'fs'

// Use credentials from environment. Set GOOGLE_APPLICATION_CREDENTIALS to the
// absolute path of your service account JSON file in the deployment environment.
// Never commit credentials to the repository.
const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS
const clientEmail = process.env.GCLOUD_CLIENT_EMAIL
const privateKey = process.env.GCLOUD_PRIVATE_KEY ? process.env.GCLOUD_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined

let CONFIG: any = {}
if (clientEmail && privateKey) {
  CONFIG = {
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
  }
} else if (keyFile) {
  CONFIG = { keyFilename: keyFile }
} else {
  CONFIG = {}
}


const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
            cb(null,'./uploads')
        },
          filename: (req, file, cb) =>
        {
                
          cb(null, file.originalname)
        }
    })


    export const getNumeroGuiaImage = async (): Promise <any> => {
       
        const client = new vision.ImageAnnotatorClient(CONFIG);
        console.log(client)
        const file = fs.readdirSync('uploads')
        let arrImage = []

        if(file.length>0)
        {
          for await(const image of file){

            
            let [result] = await client.textDetection('uploads/'+ image)
            const texto = result.fullTextAnnotation.text.search('Guía: ')
            const  nGuia = result.fullTextAnnotation.text.slice(texto+6,texto+13)
            
            fs.unlinkSync('uploads/'+ image)

            arrImage.push({nImage: image, nGuia: nGuia.trim()}) 
            
          }
                      

        } else 
        {
            return arrImage.push({nImage:`La Cantidad de arvhivos subidos es:  ${file.length}`, nGuia: '0' }) 
        }
        
        
        return arrImage

         
    }

    export default multer({storage})