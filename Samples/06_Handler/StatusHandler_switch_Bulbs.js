// Fügt einen Status-Handler hinzu, der auf Änderungen im Shelly-Gerät reagiert.
// Dieser Handler wird immer dann ausgelöst, wenn sich der Status eines Geräts verändert.
Shelly.addStatusHandler(function (status) {  

   // Überprüfen, ob das Ereignis vom Switch-Modul stammt und ob es sich um das Relais mit der ID 0 handelt.
   // Zudem wird geprüft, ob sich der `output`-Status (An/Aus) verändert hat.
   if (status.name === "switch" && status.id === 0 && status.delta.output) {
      
      // Definieren der Parameter für den Schaltbefehl:
      // - `id:1` -> Steuert das Relais mit der ID 1
      // - `on:false` -> Das Relais 1 wird ausgeschaltet
      let params = {id:1, on:false};

      // Senden des Befehls an das Shelly-Gerät, um Relais 1 auszuschalten.
      Shelly.call("Switch.Set", params);
   } 
   
   // Falls das Ereignis vom Relais mit der ID 1 stammt und sich der `output`-Status verändert hat:
   else if (status.name === "switch" && status.id === 1 && status.delta.output) {
      
      // Definieren der Parameter für den Schaltbefehl:
      // - `id:0` -> Steuert das Relais mit der ID 0
      // - `on:false` -> Das Relais 0 wird ausgeschaltet
      let params = {id:0, on:false};

      // Senden des Befehls an das Shelly-Gerät, um Relais 0 auszuschalten.
      Shelly.call("Switch.Set", params);
   }
});