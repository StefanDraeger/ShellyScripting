// Fügt einen Event-Handler hinzu, der auf Ereignisse am Shelly reagiert.
// Diese Funktion wird immer dann ausgelöst, wenn ein Schalter betätigt wird.
Shelly.addEventHandler(function (event) {  

  // Gibt das komplette Event-Objekt im Debug-Log aus.
  // Dies hilft beim Debugging, um zu sehen, welche Daten das Event enthält.
  print(event);

  // Prüft, ob das Ereignis von Schalter 0 kommt und es sich um eine "toggle"-Aktion handelt.
  if (event.id === 0 && event.info.component === "switch:0" && event.info.event === "toggle") {
    print("Schalter links wurde betätigt!"); // Debug-Ausgabe
  }

  // Prüft, ob das Ereignis von Schalter 1 kommt und es sich um eine "toggle"-Aktion handelt.
  if (event.id === 1 && event.info.component === "switch:1" && event.info.event === "toggle") {
    print("Schalter rechts wurde betätigt!"); // Debug-Ausgabe
  }
});
