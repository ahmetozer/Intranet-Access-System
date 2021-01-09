

/*
To Generate allow cookie
*/

function randomString(length) {
    let result           = '';
    let randomStringCharacters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * randomStringCharacters.length));
    }
    return result;
 }