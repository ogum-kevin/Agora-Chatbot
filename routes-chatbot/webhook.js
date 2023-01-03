
const Router = require('express').Router();
const WhatsAppCloudAPI = require('whatsappcloudapi_wrapper');
//const Request = require('../controller-chatbot/utils');
const Examinations= require('../models-chatbot/examinations')
const {downloadFile} =require('./bucket');

/******************The Whatsapp wrapper initialization ******************/

const WhatsApp = new WhatsAppCloudAPI({
    accessToken:process.env.WA_accessToken,
    graphAPIVersion:'v15.0',
    senderPhoneNumberId:process.env.WA_senderPhoneNumberId,
    WABA_ID:process.env.WABA_ID,
})

Router.get('/whatsapp_callback_url', async (req, res) => {
    try {

        console.log('Pinging this webhook')
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        if (mode && token && mode === 'subscribe' && process.env.WA_Verify_Token === token) {
            return res.status(200).send(challenge)
        } else {
            return res.sendStatus(403)
        }


    } catch (error) {
        return res.status(500).json(message_500)
    }

})

Router.post('/whatsapp_callback_url',async(req,res) =>{
    try {
        let data = WhatsApp.parseMessage(req.body);
         

        if (data?.isMessage) {
            let incomingMessage = data.message;
            let recipientPhone = incomingMessage.from.phone;
            let recipientName = incomingMessage.from.name;
            let typeOfMessage = incomingMessage.type; //type = text_message
            let messageId = incomingMessage.message_id

            let incomingText=incomingMessage.text.body

            /*******************Check if the incomming text contains an hypen **************/
            function testIncomingMessage(input){
                const regex = /\-/
                return regex.test(input)
            }
             
            if(testIncomingMessage(incomingText)){
                let [Abbr, Code, type] = incomingText.split("-", 3);
                let courseAbbr = Abbr.toUpperCase();
                let courseCode = Code.toUpperCase();
                let typeOfMaterial = type.toUpperCase();

                if(!courseAbbr || !courseCode || !typeOfMaterial){
                    await WhatsApp.sendText({
                        message:`Please send the *correct* prompt @${recipientName}!`,
                        recipientPhone:recipientPhone
                    })
                    return res.status(200).json()
                }

                /****reply accordingly***************************/
                if (typeOfMaterial =='EXAMS' || typeOfMaterial =='EXAM') {


                    let resData = await Examinations.find({
                        courseCode: `${courseAbbr}${courseCode}`
                    })
                    console.log(resData);
                    if(resData.length ===0){ 
                        await WhatsApp.sendText({
                            message: `Sorry!😥 @${recipientName} \nThe ${incomingText} _Past Papers_ are not available at this moment!`,
                            recipientPhone: recipientPhone
                        })
                        return res.status(200).json()
                    }

                    resData.forEach( async(courseData )=>{
                        const urlPath= await downloadFile(courseData.examPaperPath)
                        if(urlPath){
                            await WhatsApp.sendDocument({
                                recipientPhone: recipientPhone,
                                caption: `${courseData.courseName}`,
                                //url:`${courseData.examPaperPath}`,
                                url: `${urlPath}`
                            })
                            return res.status(200).json()
                        }
                        
                    })
                  
                    
                }

                /***************Refs ********************/

                /* if (typeOfMaterial === 'REFS' || typeOfMaterial =='REF') {

                     await WhatsApp.sendDocument({

                     })

                 }
                 -*/

            }
            else{
                
                 await WhatsApp.sendImage({
                    recipientPhone:recipientPhone,
                    caption: `${incomingText}!@${recipientName}\nWelcome to *@Agora Chat*.\nTo get past papers,reply with:\n*Course-Code-Exams* e.g._ECE-444-Exams_\nTo get reference material,reply with:\n*Course-Code-Refs* e.g._ECE-222-Refs_\nThanks you ❤`,
                    url: 'https://images.unsplash.com/photo-1672512461358-ea79e2b90f52?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
                 })
                 return res.status(200).json({
                     "messaging_product": "whatsapp",
                     "status": "read",
                     "message_id": `${messageId}`
                 })
            }         
            
       await WhatsApp.markMessageAsRead({message_id:messageId}) 
       return res.status(200).json()
    } }
    catch (error) {
        console.log(error.message)
        return res.status(500).json(error.message);
        
    }
})


module.exports= Router;