var admin = require("firebase-admin");

let push = async (token, msg) => {
    var serviceAccount = require("../bmfcm-d350c-firebase-adminsdk-ucc2x-0c21b91a9e.json");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://bmfcm-d350c.firebaseio.com"
    });


    if (message == null || message == undefined) {
        var message = {
            notification: {
                title: msg,
                body: "Not a cycle!"
            },
            token: token
        };
    }


    admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
}

let broadcast = async (topic, msg) => {
    var serviceAccount = require("../bmfcm-d350c-firebase-adminsdk-ucc2x-0c21b91a9e.json");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://bmfcm-d350c.firebaseio.com"
    });

    var message = {
        notification: {
            title: msg,
            body: "Not a cycle!"
        },
        topic: topic
    };

    // Send a message to devices subscribed to the provided topic.
    admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
}
module.exports = {
    push,
    broadcast
}
