// Definieren des API-Schlüssels für JSONBin.io. Dieser Schlüssel authentifiziert die Anfragen.
// Hinweis: Sensible Daten wie API-Keys sollten niemals öffentlich zugänglich sein.
const jsonbin_API_KEY = "geheim";

// Basis-URL für JSONBin.io-API-Endpunkte.
const baseUrl = "https://api.jsonbin.io/v3/b/";

// Initialisieren eines Objekts, um die Messwerte des Shelly-Geräts zu speichern.
let data = {
  voltage: 0,    // Spannung in Volt
  current: 0,    // Stromstärke in Ampere
  apower: 0,     // Momentane Leistungsaufnahme in Watt
  timestamp: 0   // Zeitstempel der letzten Messung
};

// Abrufen der aktuellen Messwerte vom Shelly-Gerät für Switch:0.
let result = Shelly.getComponentStatus("Switch:0");
data.voltage = result.voltage;         // Spannung wird aktualisiert.
data.current = result.current;         // Stromstärke wird aktualisiert.
data.apower = result.apower;           // Momentane Leistungsaufnahme wird aktualisiert.
data.timestamp = result.aenergy.minute_ts; // Zeitstempel wird aktualisiert.

// Erstellen der Parameter für den HTTP-Request, um die Daten an JSONBin.io zu senden.
let parameter = {
   method: "POST",  // Die HTTP-Methode ist POST, um neue Daten zu erstellen.
   url: baseUrl,    // Ziel-URL für den API-Endpunkt.
   headers: {       // Header-Informationen für den Request.
       "Content-Type": "application/json", // Gibt an, dass der Body JSON-Daten enthält.
       "X-Master-key": jsonbin_API_KEY     // API-Key zur Authentifizierung.
     },
   body: data       // Das zu sendende JSON-Objekt mit den Messdaten.
};

// Funktion zum Auslesen der Bin-ID aus der JSONBin.io-API-Antwort.
// Die Antwort wird als JSON-Objekt geparst und die Bin-ID aus der "metadata" extrahiert.
function readBinIDFromResult(result) {
  let json = JSON.parse(result); // Umwandeln der API-Antwort in ein JavaScript-Objekt.
  return json.metadata.id;       // Rückgabe der Bin-ID aus den Metadaten.
}

// Senden der Daten an JSONBin.io mittels Shelly-HTTP-Aufruf.
Shelly.call(
  "HTTP.Request", parameter, // HTTP-Anfrage mit den zuvor definierten Parametern.
  function(result, error_code, error_message) { // Callback-Funktion zur Verarbeitung der Antwort.
    if (error_code != 0) {
      // Ausgabe einer Fehlermeldung, falls die Anfrage fehlschlägt.
      print(error_message);
    } else {
      // Abrufen der Bin-ID aus der erfolgreichen Antwort und Ausgabe in der Konsole.
      let bin = readBinIDFromResult(result.body);
      print("Daten wurden unter der BIN-ID gespeichert: " + bin);
    }
  }
);
