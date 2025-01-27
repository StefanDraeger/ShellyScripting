// Initialisieren eines Datenobjekts, um Messwerte zu speichern.
// Die Felder repräsentieren Spannung (voltage), Strom (current), Leistung (apower) und Zeitstempel (timestamp).
let data = {
  voltage: 0,    // Spannung in Volt (Initialwert: 0)
  current: 0,    // Stromstärke in Ampere (Initialwert: 0)
  apower: 0,     // Momentane Leistungsaufnahme in Watt (Initialwert: 0)
  timestamp: 0   // Zeitstempel der Messung in UNIX-Sekunden (Initialwert: 0)
};

// Abrufen des aktuellen Status des Shelly-Geräts für Switch:0.
// Das result-Objekt enthält Messdaten wie Spannung, Strom, Leistung und Energiedaten.
let result = Shelly.getComponentStatus("Switch:0");

// Aktualisieren des voltage-Felds im data-Objekt mit der gemessenen Spannung.
data.voltage = result.voltage;

// Aktualisieren des current-Felds im data-Objekt mit der gemessenen Stromstärke.
data.current = result.current;

// Aktualisieren des apower-Felds im data-Objekt mit der gemessenen Leistungsaufnahme.
data.apower = result.apower;

// Aktualisieren des timestamp-Felds im data-Objekt mit dem Zeitstempel der letzten Minute.
// Der Zeitstempel wird in UNIX-Sekunden geliefert.
data.timestamp = result.aenergy.minute_ts;

// Ausgabe des gesamten data-Objekts in der Konsole.
// Alle Messwerte und der Zeitstempel werden im JSON-Format angezeigt.
print(data);
