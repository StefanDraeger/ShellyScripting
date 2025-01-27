// Definieren des API-Schlüssels für JSONBin.io. Dieser wird für die Authentifizierung verwendet.
// Hinweis: Der Schlüssel sollte vertraulich behandelt und nicht öffentlich gemacht werden.
const jsonbin_API_KEY = "geheim";

// Basis-URL für JSONBin.io-API-Endpunkte.
const baseUrl = "https://api.jsonbin.io/v3/b/";

// Initialisieren eines Datenobjekts, um Messwerte und die Bin-ID zu speichern.
// Die `bin_id` wird verwendet, um zu entscheiden, ob ein neuer Datensatz erstellt (POST) oder aktualisiert (PUT) werden soll.
let data = {
  bin_id: 0,     // ID der JSONBin (0 bedeutet, dass noch keine Bin erstellt wurde).
  voltage: 0,    // Spannung in Volt.
  current: 0,    // Stromstärke in Ampere.
  apower: 0,     // Momentane Leistungsaufnahme in Watt.
  timestamp: 0   // Zeitstempel der letzten Messung.
};

// Abrufen der aktuellen Messwerte vom Shelly-Gerät für Switch:0.
let result = Shelly.getComponentStatus("Switch:0");
data.voltage = result.voltage;         // Spannung wird aktualisiert.
data.current = result.current;         // Stromstärke wird aktualisiert.
data.apower = result.apower;           // Leistungsaufnahme wird aktualisiert.
data.timestamp = result.aenergy.minute_ts; // Zeitstempel der letzten Minute.

// Parameter für den HTTP-Request erstellen. Standardmäßig wird ein POST-Request vorbereitet.
let parameter = {
   method: "POST",    // HTTP-Methode: POST für das Erstellen eines neuen Eintrags.
   url: baseUrl,      // Ziel-URL für den API-Endpunkt.
   headers: {         // Header-Informationen für den Request.
       "Content-Type": "application/json",  // Der Body enthält JSON-Daten.
       "X-Master-key": jsonbin_API_KEY      // API-Key zur Authentifizierung.
     },
   body: data         // Zu sendende Daten als JSON.
};

// Funktion zum Extrahieren der Bin-ID aus der API-Antwort.
// Die Antwort wird geparst und die `metadata.id` zurückgegeben.
function readBinIDFromResult(result) {
  let json = JSON.parse(result); // Umwandeln der API-Antwort in ein JavaScript-Objekt.
  return json.metadata.id;       // Rückgabe der Bin-ID aus den Metadaten.
}

// Funktion zum Senden von HTTP-Requests an JSONBin.io.
// Der Parameter `updateBinID` gibt an, ob die Bin-ID aus der Antwort extrahiert werden soll.
function callHttpRequest(updateBinID) {
  Shelly.call(
    "HTTP.Request", parameter, // HTTP-Anfrage mit den definierten Parametern.
    function(result, error_code, error_message) { // Callback-Funktion zur Verarbeitung der API-Antwort.
      if (error_code != 0) {
        // Bei einem Fehler wird die Fehlermeldung ausgegeben.
        print(error_message);
      } else {
        if (updateBinID) {
          // Wenn eine neue Bin erstellt wurde (POST), wird die Bin-ID extrahiert und im Datenobjekt gespeichert.
          let bin = readBinIDFromResult(result.body);
          data.bin_id = bin; // Speichern der Bin-ID im `data`-Objekt.
          print("Daten wurden unter der BIN-ID gespeichert: " + bin);
        }
        // Ausgabe der API-Antwort und der aktuellen Daten in der Konsole.
        print(data);
        print(result);
      }
    }
  );
}

// Einrichten eines Timers, der alle 10 Sekunden die Messwerte aktualisiert und an JSONBin.io sendet.
Timer.set(10000, true, function() {
  // Abrufen der aktuellen Messwerte vom Shelly-Gerät.
  let result = Shelly.getComponentStatus("Switch:0");
  data.voltage = result.voltage;         // Spannung wird aktualisiert.
  data.current = result.current;         // Stromstärke wird aktualisiert.
  data.apower = result.apower;           // Leistungsaufnahme wird aktualisiert.
  data.timestamp = result.aenergy.minute_ts; // Zeitstempel wird aktualisiert.

  if (data.bin_id === 0) {
    // Wenn noch keine Bin-ID existiert, wird ein POST-Request ausgeführt, um eine neue Bin zu erstellen.
    callHttpRequest(true);
  } else {
    // Wenn bereits eine Bin-ID existiert, wird ein PUT-Request ausgeführt, um die vorhandenen Daten zu aktualisieren.
    parameter.url = baseUrl + data.bin_id; // URL wird mit der Bin-ID ergänzt.
    parameter.method = "PUT";             // Methode wird auf PUT geändert.
    callHttpRequest(false);               // Bin-ID muss nicht erneut extrahiert werden.
  }
});
