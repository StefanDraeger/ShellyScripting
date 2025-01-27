// Abrufen des aktuellen Status von Switch:0 (Relais oder Schalter).
// Das Ergebnis enthält Messwerte wie Spannung, Leistung und Energiedaten.
let result = Shelly.getComponentStatus("Switch:0");

// Ausgabe der aktuell gemessenen Spannung in Volt.
// Der Wert result.voltage gibt die Spannung an, die vom Shelly gemessen wurde.
print("Spannung: " + result.voltage + " Volt");

// Ausgabe der aktuell gemessenen Leistungsaufnahme in Watt.
// Der Wert result.apower gibt die momentane Leistung an, die das Gerät verbraucht.
print("Leistungsaufnahme: " + result.apower + " Watt");

// Abrufen des Zeitstempels der letzten Minute aus den Energiedaten.
// result.aenergy.minute_ts liefert einen UNIX-Zeitstempel in Sekunden.
let timestamp = result.aenergy.minute_ts;

// Umwandeln des UNIX-Zeitstempels in ein JavaScript-Date-Objekt.
// Der Zeitstempel wird mit 1000 multipliziert, da JavaScript Millisekunden erwartet.
var date = new Date(timestamp * 1000);

// Ausgabe des Datums und der Uhrzeit in lesbarer Form.
// Das Date-Objekt wird mit toString() formatiert und in der Konsole angezeigt.
print("Zeit: " + date.toString());
