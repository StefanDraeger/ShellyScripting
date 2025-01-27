/**
 * Funktion zum Berechnen von Tag, Monat und Jahr aus einem Timestamp in Millisekunden.
 * 
 * @param {number} timestamp - Timestamp in Millisekunden.
 * @returns {Array} - Array mit [Tag, Monat, Jahr].
 */
function extractDateFromTimestamp(timestamp) {
  // Konstante für die Anzahl der Millisekunden in einem Tag.
  const MS_PER_DAY = 86400000;

  // Umrechnen des Timestamps von Millisekunden in Tage (ab dem 1. Januar 1970).
  let daysSinceEpoch = Math.floor(timestamp / MS_PER_DAY);

  // Startwerte für die Berechnung (ab dem 1. Januar 1970).
  let year = 1970;
  let month = 0;
  let day = 0;

  // Anzahl der Tage in jedem Monat (nicht-Schaltjahr).
  const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Berechnung des Jahres.
  while (true) {
    // Prüfen, ob das aktuelle Jahr ein Schaltjahr ist.
    let isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

    // Tage im aktuellen Jahr (365 oder 366 bei Schaltjahr).
    let daysInYear = isLeapYear ? 366 : 365;

    // Wenn der Timestamp noch größer als die Tage im aktuellen Jahr ist, ins nächste Jahr wechseln.
    if (daysSinceEpoch >= daysInYear) {
      daysSinceEpoch -= daysInYear;
      year++;
    } else {
      break; // Jahr ist gefunden.
    }
  }

  // Berechnung des Monats.
  for (let i = 0; i < 12; i++) {
    // Prüfen, ob Februar in diesem Jahr ein Schaltjahr ist.
    if (i === 1) {
      let isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      daysInMonths[i] = isLeapYear ? 29 : 28;
    }

    // Wenn der verbleibende Tagewert kleiner als die Tage im aktuellen Monat ist, Monat gefunden.
    if (daysSinceEpoch < daysInMonths[i]) {
      month = i + 1; // Monat ist 1-basiert (1 = Januar, 2 = Februar, ...).
      day = daysSinceEpoch + 1; // Tag ist ebenfalls 1-basiert.
      break;
    } else {
      daysSinceEpoch -= daysInMonths[i]; // Tage des Monats abziehen.
    }
  }

  // Rückgabe von Tag, Monat und Jahr.
  return [day, month, year];
}

// Initialisierung des Arrays, das das zuletzt verarbeitete Datum speichert.
let lastDate = [0, 0, 0]; // Zu Beginn wird ein leeres Datum [0, 0, 0] gesetzt.

// Breiten- und Längengrad sowie Zeitzone der gewünschten Position (z. B. Berlin).
let latitude = "52.14146177255682";
let longitude = "10.965723217435045";
let timezone = "Europe%2FBerlin";

// Open-Meteo-API URL, um Sonnenaufgangs- und Sonnenuntergangszeiten abzurufen.
baseurl = "https://api.open-meteo.com/v1/forecast?daily=sunrise,sunset&timezone=&forecast_days=1";
baseurl += "&latitude=" + latitude;
baseurl += "&longitude=" + longitude;
baseurl += "&timezone=" + timezone;

// HTTP-Parameter für die Anfrage an die API.
let parameter = {
  method: "GET",
  url: baseurl
};

/**
 * Funktion zum Erstellen eines Timers.
 * 
 * @param {number} date - Zeitpunkt (als Timestamp in Millisekunden).
 * @param {boolean} activate - Status des Relais: true = einschalten, false = ausschalten.
 */
function createTimer(date, activate) {
  let timestamp = date.toString(); // Konvertieren des Date-Objekts in einen String.
  let currentDate = Date.now(); // Aktuelle Zeit in Millisekunden.
  let currentTimetamp = currentDate.toString(); // Umwandeln der aktuellen Zeit in einen String.

  // Berechnung der verbleibenden Zeit bis zur Timer-Ausführung.
  let action = timestamp - currentTimetamp;
  print("Zeit bis zur nächsten Ausführung (" + (activate ? "einschalten" : "ausschalten") + "): " + action + "ms.");

  if (action > 0) {
    // Timer wird erstellt und die Aktion ausgeführt, wenn die Zeit erreicht ist.
    Timer.set(action, false, function() {
      let shellyParameter = {
        id: 0,
        on: activate
      };
      print("Die Lampe wird " + (shellyParameter.on ? "aktiviert" : "deaktiviert"));
      Shelly.call("Switch.Set", shellyParameter);
    });
  }
}

/**
 * Funktion zum Abrufen von Sonnenaufgangs- und Sonnenuntergangszeiten von der Open-Meteo-API.
 */
function readSunriseSunset() {
  Shelly.call(
    "HTTP.Request", parameter,
    function(result, error_code, error_message) {
      if (error_code != 0) {
        // Ausgabe von Fehlern im Debug-Log.
        print(error_message);
      } else {
        let json = JSON.parse(result.body); // JSON-Antwort in ein Objekt umwandeln.
        let dateStr = json.daily.time; // Heutiges Datum.
        let sunriseStr = json.daily.sunrise; // Sonnenaufgangszeit als String.
        let sunsetStr = json.daily.sunset; // Sonnenuntergangszeit als String.

        // Debug-Ausgabe der abgerufenen Daten.
        print("Heute: " + dateStr);
        print("Sonnenaufgang: " + sunriseStr);
        print("Sonnenuntergang: " + sunsetStr);

        // Konvertieren der Zeiten in Timestamps (Millisekunden).
        let sunriseDate = Date.parse(sunriseStr + ":00");
        let sunsetDate = Date.parse(sunsetStr + ":00");

        // Timer erstellen für Sonnenaufgang und Sonnenuntergang.
        createTimer(sunriseDate, false); // Relais ausschalten beim Sonnenaufgang.
        createTimer(sunsetDate, true);  // Relais einschalten beim Sonnenuntergang.
      }
    }
  );
}

// Timer, der alle 2500 Millisekunden ausgeführt wird, um das Datum zu überprüfen.
Timer.set(2500, true, function() {
  let currentDate = Date.now(); // Aktueller Timestamp in Millisekunden.
  let timestamp = currentDate.toString().split(".")[0]; // Umwandeln in Sekunden.
  let currentDateArray = extractDateFromTimestamp(timestamp); // Extrahieren von [Tag, Monat, Jahr].

  // Prüfen, ob ein neuer Tag begonnen hat.
  if (lastDate[0] != currentDateArray[0] || lastDate[1] != currentDateArray[1] || lastDate[2] != currentDateArray[2]) {
    print("neuer Tag");
    lastDate = currentDateArray; // Aktualisieren des letzten Datums.
    readSunriseSunset(); // Abrufen der neuen Sonnenaufgangs- und Untergangszeiten.
  }
});