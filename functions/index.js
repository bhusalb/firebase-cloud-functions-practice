const functions = require('firebase-functions');
const ejs = require('ejs')
const admin = require('firebase-admin')
admin.initializeApp()
const bucket = admin.storage().bucket()
const path = require('path')
const os = require('os')
const fs = require('fs')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest(async (request, response) => {
    let fileName = 'template1.html'
    const tempFilePath = path.join(os.tmpdir(), fileName)

    // await bucket.file(fileName).download({ destination: tempFilePath })

    let str = await ejs.renderFile('./templates/template1.html', { name: 'Hello World', our_test: 'going good' })

    response.send(str)


    // bucket.file(fileName).download({ destination: tempFilePath }).then(() => {
    //     return ejs.renderFile(tempFilePath, { name: 'Hello World', our_test: 'going good' }, (err, str) => {
    //         if (err) console.log(err)
    //         response.send(str);
    //     })
    // }).catch(err => {
    //     console.log(err)
    // })

});

exports.generateHtml = functions.database.ref('/web-app/{userId}/data')
    .onUpdate(async (snapshot, context) => {
        // Grab the current value of what was written to the Realtime Database.
        const current = snapshot.after;
        console.log('Generating ', context.params.userId, current);
        // const uppercase = original.toUpperCase();
        // You must return a Promise when performing asynchronous tasks inside a Functions such as
        // writing to the Firebase Realtime Database.
        // Setting an "uppercase" sibling in the Realtime Database returns a Promise.


        let fileName = 'template1.html'
        const tempFilePath = path.join(os.tmpdir(), fileName)

        // const tempFilePath = './templates/template1.html'
        let currentObj = snapshot.after.val()
        console.log(currentObj)
        await bucket.file(fileName).download({ destination: tempFilePath })
        let str = await ejs.renderFile(tempFilePath, currentObj)
        await current.ref.parent.child('html').set(str)

        return null

        // bucket.file(fileName).download({ destination: tempFilePath }).then(() => {
        //     return ejs.renderFile(tempFilePath, currentObj, (err, str) => {
        //         if (err) console.log(err)
        //         current.ref.parent.child('html').set(str).then(() => console.log('Successfully updated')).catch(err => console.log(err))
        //     })
        // }).catch(err => {
        //     console.log(err)
        // })

        // return null

        // ejs.renderFile('./templates/template1.html', { name: 'Hello World', our_test: 'going good' }, (err, str) => {
        //     if (err) console.log(err)
        //     current.ref.parent.child('html').set(str)
        // })
    });
