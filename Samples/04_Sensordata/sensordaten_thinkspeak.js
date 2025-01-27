/*
  Der Code dient zum Ermitteln der Sensordaten eines DHT22-Sensors am Shelly 1PM Gen3. 
  Zusätzlich wird der Stromverbrauch einer LED-Lampe (Spannung, Stromstärke und Leistung) erfasst.
  Die Daten werden anschließend mithilfe eines HTTP-GET-Requests an ThingSpeak gesendet.
*/

const baseUrl = "https://api.thingspeak.com/update?api_key=Q1930CQB0EBK2FRF"; 
// Basis-URL für die ThingSpeak API. Der API-Schlüssel authentifiziert den Zugriff auf den Kanal.

let data = {
  voltage: 0,      // Spannung der LED-Lampe in Volt.
  current: 0,      // Stromstärke der LED-Lampe in Ampere.
  apower: 0,       // Momentane Leistungsaufnahme der LED-Lampe in Watt.
  temperature: 0,  // Temperaturwert des DHT22-Sensors in °C.
  humidity: 0      // Luftfeuchtigkeit des DHT22-Sensors in Prozent.
};

let parameter = {
   method: "GET",                          // Die HTTP-Methode ist GET, um Daten an ThingSpeak zu senden.
   url: baseUrl,                           // URL wird dynamisch mit Sensordaten ergänzt.
   headers: { "Content-Type": "application/json" } // Header, der den Inhaltstyp angibt.
};

// Timer, der alle 2000 ms (2 Sekunden) ausgeführt wird.
Timer.set(2000, true, function() {
  // Abrufen der Stromverbrauchsdaten vom Shelly (Spannung, Strom, Leistung).
  let powerResult = Shelly.getComponentStatus("Switch:0");
  data.voltage = powerResult.voltage;      // Spannung in Volt.
  data.current = powerResult.current;      // Stromstärke in Ampere.
  data.apower = powerResult.apower;        // Leistungsaufnahme in Watt.

  // Abrufen der Temperaturdaten vom DHT22-Sensor.
  let temperaturResult = Shelly.getComponentStatus("temperature:100");
  data.temperature = temperaturResult.tC; // Temperatur in °C.

  // Abrufen der Luftfeuchtigkeitsdaten vom DHT22-Sensor.
  let humidityResult = Shelly.getComponentStatus("humidity:100");
  data.humidity = humidityResult.rh;      // Luftfeuchtigkeit in %.

  // Debugging: Ausgabe der erfassten Daten im Konsolen-Log.
  print(data);

  // Ergänzen der URL mit den Sensordaten (ThingSpeak-Felder 1 bis 5).
  var url = baseUrl;
  url += "&field1=" + data.voltage;        // Feld 1: Spannung.
  url += "&field2=" + data.current;        // Feld 2: Stromstärke.
  url += "&field3=" + data.apower;         // Feld 3: Leistung.
  url += "&field4=" + data.temperature;    // Feld 4: Temperatur.
  url += "&field5=" + data.humidity;       // Feld 5: Luftfeuchtigkeit.

  // URL wird in den Request-Parameter übernommen.
  parameter.url = url;

  // HTTP-GET-Request an ThingSpeak senden.
  Shelly.call(
    "HTTP.Request", parameter, 
    function(result, error_code, error_message) {
      // Fehlerbehandlung: Fehlermeldung wird im Debug-Log ausgegeben.
      if (error_code != 0) {
        print(error_message);
      } else {
        // Erfolgsfall: Die Antwort von ThingSpeak wird ausgegeben.
        print(result);
      }
    }
  );
});