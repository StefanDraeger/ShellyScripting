// Ein Timer wird gesetzt, der alle 2000 Millisekunden (2 Sekunden) ausgeführt wird.
Timer.set(2000, true, function() {
  
  // Abrufen des aktuellen WLAN-Status vom Shelly-Gerät.
  let wifiStatus = Shelly.getComponentStatus("wifi");

  // Überprüfen, ob der Shelly noch eine gültige IP-Adresse im WLAN besitzt.
  // Falls `sta_ip` nicht vorhanden oder leer ist, bedeutet das, dass der Shelly keine Verbindung mehr zum WLAN hat.
  if (!wifiStatus.sta_ip) {
    
    // Definieren der Parameter zum Ausschalten des Relais.
    let shellyParameter = { 
      id: 0,      // Das Relais mit der ID 0 wird angesprochen.
      on: false   // Das Relais wird ausgeschaltet.
    };

    // Senden des Befehls an den Shelly, um das Relais zu deaktivieren.
    Shelly.call("Switch.Set", shellyParameter);
  }
});