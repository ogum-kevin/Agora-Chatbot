const axios= require('axios');
const path =require('path')
const request=require('req')

module.exports= class Requests{
    constructor(){

    }
    //const nullResponse= ['The file you requested is not present  ']

    async fetchAssistant(filterBase,filterChild){
        try {

            //let response = await fetch(`/v1/${filterBase}/find/:${filterChild}`);
            
           //const response = await axios.get(`/v1/${filterBase}/find/:${filterChild}`)
           return response
        } catch (error) {
           return  error.message;
        }
    }


}