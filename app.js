const {google} = require('googleapis');
const path = require('path');
const fs = require('fs');
const async = require("async");


// remember to hide these in .env 
const CLIENT_ID = '638223286014-v1vks5ge9070m6o94eksa0upm1k2sktg.apps.googleusercontent.com',
CLIENT_SECRET = 're2pjUAcoPenWNo0U2AZmX3O',
REDIRECT_URI = 'https://developers.google.com/oauthplayground',
REFRESH_TOKEN = '1//04Qb_d15fB5HjCgYIARAAGAQSNwF-L9IrGR9yR6-CuMOl2VjXEu2tRngJGMcCCxi6tCw2tuoQJPT782VRsFkQwaoYQmAT78FkvsA';

// const CREDENTIALS = {
//     clientId: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     redirectUri: process.env.REDIRECT_URI,
//     refreshToken: process.env.REFRESH_TOKEN
// }
// console.log(process.env.CLIENT_ID, 'poo')

const oauth2client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2client.setCredentials({refresh_token: REFRESH_TOKEN})

const drive = google.drive({
    version: 'v3',
    auth: oauth2client
})

//console.log(filepath)
// get mimiType extension 

// how to upload a file to google drive 
// only one can be called at a time 
const uploadFile = async () => {
    const filepath = path.join(__dirname, 'myw3schoolsimage.jpg'); // this is just node

    try {
        const response = await drive.files.create({
            requestBody: {
                name: 'w3schoollogo.jpg',
                mimeType: 'image/jpg'
            },
            media: {
                mimiType: 'image/jpg',
                body: fs.createReadStream(filepath)
            }
        })

        console.log(response.data)

    } catch (error) {
        console.log(error.message)
    }
}

//uploadFile();


const deletFile = async () => {
    try {
        const response = await drive.files.delete({
            fileId: '1jSZhqG4Vw38MWqbSeBGfSoy44OyWiKUO'
        });
        console.log(response.data, response.status)

    } catch (error) {
        console.log(error.message)
    }
}

//deletFile();



//generatePublicUrl();


// var pageToken = null;
// // Using the NPM module 'async'
// async.doWhilst(function (callback) {
//   drive.files.list();
// }, function () {
//   return !!pageToken;
// }, function (err) {
//   if (err) {
//     // Handle error
//     console.error(err);
//   } else {
//     // All pages fetched
//   }
// })

drive.files.list({ 
    //q : 'fullText contains "index.js"',
    // below would be dynamic so ${} 
    q: '"1rC3Epgh3n7jqXLqYiWtXOCReL_AgJB4Z" in parents',
    //pageSize: 5,
    fields: 'files(id,name,webViewLink)', // this is what gets returned 
    //orderBy: 'createdTime desc'
}, 
// this is callback can we make this async await 
(err, res) => {
    if (err) throw err;
    const files = res.data.files;
    if (files.length) {
    files.map(async (file) => {
        // file.id , file.name
       generatePublicUrl(file.id);
       //return hello;
      // console.log(file)
    });
    } else {
      console.log('No files found');
    }
  });
  

  //https://drive.google.com/drive/folders/1jXVN9eRCUx7d5Rr2ZKXYIJlJtcRMUfD2?usp=sharing

  // use this to create permission 
// the technique i want is to search the name and children and access the fileID then use that fileId to change the permission for only that request  
const generatePublicUrl = async (fileId) => {
    const newFile = fileId;
    try {
        // currently the permissions is only for the user who uploaded this file 
        const response = await drive.permissions.create({
            fileId: newFile,
            requestBody: {
                role: 'reader',
                //type: 'domain',
                type: 'anyone'
                //displayName : 'gucci.com'
            }
        })
        //console.log(response);
 
        const result = await drive.files.get({
            fileId: fileId,
            fields: 'id,name,webViewLink,webContentLink'
        });
 
        console.log(result.data)
    } catch (error) {
        console.log(error.message)
    }
 }

 //generatePublicUrl()
 //console.log(generatePublicUrl().then(data => data))