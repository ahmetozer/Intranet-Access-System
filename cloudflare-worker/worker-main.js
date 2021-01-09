// Configure with your own settings
const domainZone = ""
const authToken = ""
const otherExpressions = null
const addressControlList = [
   "intranet-test.ahmetozer.org/*",
   "s.ahmetozer.org/test/bau/sen2001/access-test.html"
]

function newFilterList(authCookie) {
   let list = null;
   addressControlList.forEach(element => {
      if (list == null) {
         if (otherExpressions == null) {
            list = '(http.request.full_uri contains "'+element+'" and not http.cookie contains "'+authCookie+'")'
         } else {
            list = otherExpressions + ' or (http.request.full_uri contains "'+element+'" and not http.cookie contains "'+authCookie+'")'
         }
      } else {
         list = list +' or (http.request.full_uri contains "'+element+'" and not http.cookie contains "'+authCookie+'")'
      }
   });
   return list
}


async function handleRequest() {
  const bodyData = {id:filterID,expression: newFilterList("aa=asdfasdf"),paused:false,description:"Restrict access from these browsers on this address range.",ref:"FIL-1003"};

   const init = {
      method: 'put',
     headers: {
         "content-type": "application/json;charset=UTF-8",
        "Authorization":"Bearer "+authToken,
     },
     body: "["+JSON.stringify(bodyData)+"]",
   }
   const init2 = {
     headers: {
       "content-type": "application/json;charset=UTF-8",
     }
   }
   const response = await fetch("https://api.cloudflare.com/client/v4/zones/"+domainZone+"/filters", init)
   const results = await gatherResponse(response)
   return new Response(results, init2)
 }
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


async function gatherResponse(response) {
   const { headers } = response
   const contentType = headers.get("content-type") || ""
   if (contentType.includes("application/json")) {
     return JSON.stringify(await response.json())
   }
   else if (contentType.includes("application/text")) {
     return await response.text()
   }
   else if (contentType.includes("text/html")) {
     return await response.text()
   }
   else {
     return await response.text()
   }
 }