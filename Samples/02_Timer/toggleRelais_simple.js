// Funktion zum Umschalten (Togglen) des Relais
function toggleRelais() {
  // Abrufen des aktuellen Status des Relais (Switch:0 bezieht sich auf das erste Relais).
  let result = Shelly.getComponentStatus("Switch:0");
  
  // Überprüfen, ob der Status erfolgreich abgerufen wurde.
  if (result) {
    // Prüfen, ob das Relais aktuell eingeschaltet ist.
    if (result.output === true) {
      // Debug-Ausgabe: Relais war eingeschaltet.
      print("Relais war AN!");
    } else {
      // Debug-Ausgabe: Relais war ausgeschaltet.
      print("Relais war AUS!");
    }

    // Umschalten des Relaisstatus (toggle):
    // Wenn das Relais aktuell an ist (output === true), wird es ausgeschaltet.
    // Wenn es aus ist (output === false), wird es eingeschaltet.
    Shelly.call("Switch.Set", { id: 0, on: !result.output });
  }
}

// Ein Timer wird eingerichtet, der die Funktion toggleRelais alle 1000 ms (1 Sekunde) aufruft.
// Der Timer läuft kontinuierlich im wiederholenden Modus (true als zweiter Parameter).
Timer.set(1000, true, toggleRelais);
