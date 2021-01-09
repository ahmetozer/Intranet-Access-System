// Configure with your own settings
const domainZone = "";
const authToken = "";
const otherExpressions = null;
const addressControlList = [
  "intranet-test.ahmetozer.org/*",
  "s.ahmetozer.org/test/bau/sen2001/access-test.html",
];

const usernamePassword = {
  // MD5
  bob: "63a9f0ea7bb98050796b649e85481845", // root
  john: "7b24afc8bc80e548d66c4e7ff72171c5", // toor
};

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

function newFilterList(authCookie, request) {
  //const clientIP = request.headers.get('cf-connecting-ip')
  let list = null;
  addressControlList.forEach((element) => {
    //let authRule = '(http.request.full_uri contains "'+element+'" and not http.cookie contains "'+authCookie+'" and not ip.src in {'+ clientIP +'} )'
    let authRule =
      '(http.request.full_uri contains "' +
      element +
      '" and not http.cookie contains "' +
      authCookie +
      '" )';
    if (list == null) {
      if (otherExpressions == null) {
        list = "" + authRule;
      } else {
        list = otherExpressions + " or " + authRule;
      }
    } else {
      list = list + " or " + authRule;
    }
  });
  return list;
}

async function handleRequest(request) {
  let reqBody = await readRequestBody(request);
  if (reqBody == false) {
    const init = {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    };
    const status = {
      success: false,
      status: "Error: Empty POST",
    };
    return new Response(JSON.stringify(status), init);
  }
  let reqBody2 = JSON.parse(reqBody);
  const username = reqBody2.username;
  const password = reqBody2.password;

  if (usernamePassword[username] == password) {
    const edgeAuthToken = randomString(50);
    const bodyData = {
      id: filterID,
      expression: newFilterList(username + "=" + edgeAuthToken, request),
      paused: false,
      description: "Restrict access from these browsers on this address range.",
      ref: "FIL-1003",
    };

    const init = {
      method: "put",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: "Bearer " + authToken,
      },
      body: "[" + JSON.stringify(bodyData) + "]",
    };
    const init2 = {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    };
    const response = await fetch(
      "https://api.cloudflare.com/client/v4/zones/" + domainZone + "/filters",
      init
    );
    const results = await gatherResponse(response);
    let firewallRequestStatus = JSON.parse(results);
    if (firewallRequestStatus.success == true) {
      let userResponse = {
        success: true,
        cookieKey: edgeAuthToken,
        status: "Firewall updated.",
      };
      return new Response(JSON.stringify(userResponse), init2);
    } else {
      let userResponse = {
        success: false,
        status: "Cannot make a request to Cloudflare.",
      };
      return new Response(JSON.stringify(userResponse), init2);
    }
  } else {
    const init = {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    };
    const status = {
      success: false,
      status: "Error: Username or password are wrong.",
    };
    return new Response(JSON.stringify(status), init);
  }
}

/*
 To Generate allow cookie
 */

function randomString(length) {
  let result = "";
  let randomStringCharacters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    result += randomStringCharacters.charAt(
      Math.floor(Math.random() * randomStringCharacters.length)
    );
  }
  return result;
}

async function gatherResponse(response) {
  const { headers } = response;
  const contentType = headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json());
  } else if (contentType.includes("application/text")) {
    return await response.text();
  } else if (contentType.includes("text/html")) {
    return await response.text();
  } else {
    return await response.text();
  }
}

async function readRequestBody(request) {
  const { headers } = request;
  const contentType = headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return JSON.stringify(await request.json());
  } else if (contentType.includes("application/text")) {
    return await request.text();
  } else if (contentType.includes("text/html")) {
    return await request.text();
  } else if (contentType.includes("form")) {
    const formData = await request.formData();
    const body = {};
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1];
    }
    return JSON.stringify(body);
  } else {
    return false;
  }
}
