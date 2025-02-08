// Basis-URL für den Shelly Plug S, der den Heizlüfter steuert.
// Die IP-Adresse muss dem Shelly Plug S in deinem Netzwerk entsprechen.
// Der Parameter "turn=" wird später mit "on" oder "off" ergänzt.
let urlHeater = "http://192.168.178.91/relay/0?turn=";

// Temperaturgrenzen für das Ein- und Ausschalten des Heizlüfters.
// Sobald die Temperatur unter HEATER_ON_TEMP fällt, wird der Heizlüfter eingeschaltet.
// Sobald die Temperatur über HEATER_OFF_TEMP steigt, wird der Heizlüfter ausgeschaltet.
const let HEATER_ON_TEMP = 17;   // Heizlüfter einschalten bei weniger als 17°C.
const let HEATER_OFF_TEMP = 20;  // Heizlüfter ausschalten bei mehr als 20°C.

// Variable zur Speicherung des aktuellen Heizlüfter-Zustands.
// Sie verhindert unnötige HTTP-Anfragen, wenn der Status unverändert bleibt.
let heaterON = false;

// HTTP-Parameter für die Anfrage an den Shelly Plug S.
let parameter = {
  method: "GET",   // HTTP-Methode: GET wird genutzt, um den Schaltbefehl zu senden.
  url: "",         // Die URL wird dynamisch gesetzt, abhängig davon, ob der Heizlüfter an- oder ausgeschaltet wird.
  headers: { "Content-Type": "application/json" } // Optionaler Header für den Request.
};

/**
 * Funktion zur Überprüfung der Raumtemperatur und Steuerung des Heizlüfters.
 */
function handleHeater() {
  // Abrufen der aktuellen Temperatur vom DS18B20-Sensor am Shelly Plus 1 mit AddOn.
  let temperaturJson = Shelly.getComponentStatus("temperature:100");
  print("Raumtemperatur ist: " + temperaturJson.tC + "°C");

  // Prüfen, ob die Temperatur unterhalb der Einschaltschwelle liegt.
  if (temperaturJson.tC < HEATER_ON_TEMP) {
    print("Temperatur kleiner als " + HEATER_ON_TEMP + "°C. Heizlüfter wird aktiviert!");
    heaterON = true; // Heizlüfter als eingeschaltet markieren.
    callUrl(); // HTTP-Anfrage zum Einschalten senden.
  }
  // Prüfen, ob die Temperatur oberhalb der Ausschaltschwelle liegt.
  else if (temperaturJson.tC > HEATER_OFF_TEMP) {
    print("Temperatur größer als " + HEATER_OFF_TEMP + "°C. Heizlüfter wird deaktiviert!");
    heaterON = false; // Heizlüfter als ausgeschaltet markieren.
    callUrl(); // HTTP-Anfrage zum Ausschalten senden.
  }
}

/**
 * Funktion zum Senden des HTTP-Requests an den Shelly Plug S, um das Relais zu schalten.
 */
function callUrl() {
   // Dynamisches Setzen der URL je nach aktuellem Status des Heizlüfters.
   parameter.url = urlHeater + (heaterON ? "on" : "off");
   print(parameter.url); // Debugging: Die generierte URL ausgeben.

   // HTTP-Request an den Shelly Plug S senden.
   Shelly.call(
     "HTTP.Request", parameter,
     function(result, error_code, error_message) {
       if (error_code != 0) {
         print("Fehler beim Senden der Daten: " + error_message); // Fehlerbehandlung.
       } else {
         print("Daten erfolgreich gesendet."); // Erfolgreiche Anfrage bestätigen.
       }
     }
   );
}

// Einrichten eines Timers, der alle 2500 Millisekunden (2,5 Sekunden) die Temperatur prüft.
// Falls eine Änderung festgestellt wird, wird der Heizlüfter entsprechend ein- oder ausgeschaltet.
Timer.set(2500, true, handleHeater);