// Ein Timer wird eingerichtet, der alle 60 Sekunden (60000 ms) wiederholt ausgelöst wird.
Timer.set(60000, true, function() {

  // Den aktuellen Status des Relais abrufen (Switch:0 bezieht sich auf das erste Relais).
  const result = Shelly.getComponentStatus("Switch:0");

  // Überprüfen, ob der Status erfolgreich abgerufen wurde.
  if (result) {
    // Prüfen, ob das Relais aktuell eingeschaltet ist.
    if (result.output === true) {
      print("Relais ist AN! -> neuer Status AUS");
    } else {
      print("Relais ist AUS! -> neuer Status AN");
    }

    // Einen HTTP-Aufruf durchführen, um den Status des Relais zu toggeln.
    Shelly.call(
      "HTTP.GET", // Die Methode ist ein HTTP-GET-Request.
      { url: "http://192.168.178.141/rpc/Switch.Toggle?id=0" }, // Ziel-URL, um das Relais zu toggeln.
      
      // Callback-Funktion, die die Antwort des HTTP-Aufrufs verarbeitet.
      function(result, error_code, error_message) {
        if (error_code != 0) {
          // Wenn ein Fehler aufgetreten ist, wird dieser gemeldet.
          print("Fehler!");
        } else {
          // Wenn der Aufruf erfolgreich war, wird "OK!" ausgegeben.
          print("OK!");
        }
      }
    );
  }
});