// Parameterobjekt für den Shelly-Aufruf. Es definiert das Relais (id: 0) und dessen Schaltstatus.
let shellyParameter = {
  id: 0,      // ID des Relais, das gesteuert werden soll (0 = erstes Relais)
  on: true,   // Standardstatus, um das Relais einzuschalten
};

// Ein Timer wird eingerichtet, der alle 5 Sekunden (5000 ms) ausgelöst wird.
// Der Timer läuft im wiederholenden Modus (true als zweiter Parameter).
Timer.set(5000, true, function() {

  // Abrufen des aktuellen Status des Relais (Switch:0 bezieht sich auf das erste Relais).
  const result = Shelly.getComponentStatus("Switch:0");

  // Überprüfen, ob der Status erfolgreich abgerufen wurde.
  if (result) {
    // Prüfen, ob das Relais aktuell eingeschaltet ist (output === true).
    if (result.output === true) {
      print("Relais ist AN! -> neuer Status AUS");  // Debug-Ausgabe: Relais ist aktuell eingeschaltet.
    } else {
      print("Relais ist AUS! -> neuer Status AN"); // Debug-Ausgabe: Relais ist aktuell ausgeschaltet.
    }

    // Den Schaltstatus umkehren (toggle): Wenn es an ist, wird es ausgeschaltet, und umgekehrt.
    shellyParameter.on = !result.output;

    // Aufruf der Shelly-API, um den neuen Status des Relais zu setzen.
    Shelly.call("Switch.Set", shellyParameter);
  }
});
