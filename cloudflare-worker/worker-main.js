// Configure with your own settings
const domainZone = ""
const authToken = ""
const otherExpressions = ""

async function handleRequest() {
   const init = {
      method: 'PUT',
     headers: {
         "content-type": "application/json;charset=UTF-8",
        "Authorization":"Bearer "+authToken,
     },
   }
   const response = await fetch("https://api.cloudflare.com/client/v4/zones/"+domainZone+"/firewall/rules", init)
   const results = await gatherResponse(response)
   return new Response(results, init)
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

function newExpression(expression) {
   if (otherExpressions != undefined && otherExpressions != null && otherExpressions != "") {
      expression = expression + " or "
   }
   return expression
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