// Konfigurationsobjekt für den HTTP-Server
let CONFIG = {
  url: "api",         // Der Endpunkt, an dem der Server erreichbar ist (z. B. /api)
  param: "greeting"   // Name des erwarteten Parameters in der Anfrage
};

// Handler-Funktion, die ausgeführt wird, wenn eine HTTP-Anfrage an den Endpunkt erfolgt
function httpServerHandler(request, response) {
  let responseCode = 200;   // Standard-Antwortcode (200 = OK)
  let responseBody = "";    // Standard-Antworttext
  let params = parseQS(request.query); // Die Anfrage-Parameter aus der URL werden geparst
  console.log("received:" + JSON.stringify(params)); // Debug: Zeige die empfangenen Parameter

  // Überprüfen, ob der erwartete Parameter "greeting" in der Anfrage enthalten ist
  if (params["greeting"]) {
    response.code = 200; // Erfolg: Antwort mit HTTP-Status 200
    response.body = "Hallo " + params["greeting"] + ". Wie geht es dir?"; // Antworttext mit dem übergebenen Wert
  } else {
    response.code = 400; // Fehler: Antwort mit HTTP-Status 400 (Bad Request)
    response.body = "Fehler!"; // Fehlermeldung
  }
  response.send(); // Senden der Antwort an den Client
}

// Hilfsfunktion: Parst die Query-String-Parameter aus einer URL
function parseQS(qs) {
  let params = {}; // Objekt, um die Parameter zu speichern
  if (qs.length === 0) return params; // Wenn der Query-String leer ist, gib ein leeres Objekt zurück
  let paramsArray = qs.split("&"); // Teile den Query-String in einzelne Parameterpaare auf
  for (let idx in paramsArray) {
    let kv = paramsArray[idx].split("="); // Teile jedes Paar in Schlüssel und Wert auf
    params[kv[0]] = kv[1] || null; // Weise den Wert dem Schlüssel zu (falls kein Wert vorhanden, setze null)
  }
  return params; // Gib die geparsten Parameter zurück
}

// Registrierung des HTTP-Endpunkts beim Shelly HTTP-Server
HTTPServer.registerEndpoint(CONFIG.url, httpServerHandler);
// Der Endpunkt ist jetzt unter http://<Shelly-IP>/api erreichbar.
// Anfragen können z. B. mit http://<Shelly-IP>/api?greeting=Max gestellt werden.
