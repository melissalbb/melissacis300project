
document.addEventListener("DOMContentLoaded", () => {
  const heroVideo = document.querySelector(".hero video");
  if (heroVideo) {
    heroVideo.play().catch(() => {
      console.log("Autoplay blocked until user interaction.");
    });
  }
});

const airportByCity = {
  "Nice": "NCE",
  "Cannes": "NCE",
  "Antibes": "NCE",
  "Monaco": "NCE",
  "Saint-Tropez": "TLN",
  "Marseille": "MRS",
  "Aix-en-Provence": "MRS",
  "Avignon": "AVN"
};

const CITY_IDEAS = {
  "Nice": {
    beach: ["Morning swim at Blue Beach", "Promenade des Anglais sunset walk"],
    culture: ["Matisse Museum", "Old Town & Cours Saleya"],
    food: ["Socca tasting in Vieux Nice", "Seafood dinner by the port"],
    scenery: ["Castle Hill viewpoints", "Coastal walk to Villefranche-sur-Mer"],
    markets: ["Cours Saleya flower & produce market"],
    adventure: ["Boat tour to Cap Ferrat", "E-bike ride along the coast"]
  },
  "Cannes": {
    beach: ["Plage du Midi or private beach club"],
    culture: ["La Croisette & Film Festival Palace"],
    food: ["Bouillabaisse dinner", "Marché Forville"],
    scenery: ["Îles de Lérins ferry"],
    markets: ["Forville Market"],
    adventure: ["Kayak or SUP by the bay"]
  },
  "Antibes": {
    beach: ["Plage de la Salis"],
    culture: ["Picasso Museum", "Old Town ramparts"],
    food: ["Provençal market tastings", "Harbor dinner"],
    scenery: ["Cap d’Antibes coastal path"],
    markets: ["Marché Provençal (daily, except Mon)"],
    adventure: ["Snorkeling near Cap d’Antibes"]
  },
  "Monaco": {
    beach: ["Larvotto Beach"],
    culture: ["Prince’s Palace & Old Town", "Oceanographic Museum"],
    food: ["Café de Paris (splurge)", "Harbor-view aperitivo"],
    scenery: ["Jardin Exotique views"],
    markets: ["Condamine Market"],
    adventure: ["F1 track stroll / e-scooter loop"]
  },
  "Saint-Tropez": {
    beach: ["Pampelonne Beach"],
    culture: ["Citadel & old port"],
    food: ["Tarte Tropézienne tasting"],
    scenery: ["Coastal road viewpoints"],
    markets: ["Place des Lices market (Tue/Sat)"],
    adventure: ["Boat day to hidden coves"]
  },
  "Marseille": {
    beach: ["Vallon des Auffes / Malmousque dip"],
    culture: ["Le Panier & MuCEM"],
    food: ["Bouillabaisse at a classic bistro"],
    scenery: ["Calanques National Park"],
    markets: ["Noailles market"],
    adventure: ["Calanques hike / boat"]
  },
  "Aix-en-Provence": {
    culture: ["Cézanne’s studio", "Fountain & mansion walk"],
    food: ["Calissons & café terraces"],
    scenery: ["Montagne Sainte-Victoire views"],
    markets: ["Aix markets (Tue/Thu/Sat)"],
    adventure: ["E-bike vineyards ride"]
  },
  "Avignon": {
    culture: ["Palais des Papes", "Pont d’Avignon"],
    food: ["Wine bars & bistros"],
    scenery: ["Villages of the Luberon (day trip)"],
    markets: ["Les Halles market"],
    adventure: ["Kayak to Pont du Gard (nearby)"]
  }
};

// Template presets
const TEMPLATES = {
  riviera: {
    days: 6,
    cities: ["Nice", "Antibes", "Cannes", "Monaco"],
    interests: ["beach", "food", "scenery", "markets"],
    pace: "balanced"
  },
  provence: {
    days: 7,
    cities: ["Marseille", "Aix-en-Provence", "Avignon"],
    interests: ["culture", "food", "markets", "scenery"],
    pace: "relaxed"
  },
  wine: {
    days: 5,
    cities: ["Aix-en-Provence", "Avignon"],
    interests: ["food", "markets", "culture", "scenery"],
    pace: "relaxed"
  },
  coast: {
    days: 5,
    cities: ["Nice", "Antibes", "Saint-Tropez"],
    interests: ["beach", "scenery", "food"],
    pace: "balanced"
  }
};

/* ---------- EXTERNAL LINKS ---------- */
function setExternalLinks() {
  const start = document.getElementById("startDate").value;
  const days = parseInt(document.getElementById("days").value || "0", 10);
  const firstCity = getSelectedCities()[0] || "Nice";
  const airport = airportByCity[firstCity] || "NCE";

  let checkout = start;
  if (start && days > 1) {
    const d = new Date(start);
    d.setDate(d.getDate() + days);
    checkout = d.toISOString().slice(0, 10);
  }

  document.getElementById("flightsLink").href =
    `https://www.google.com/travel/flights?hl=en#flt=/..${airport}.${airport}.${start}`;
  document.getElementById("hotelsLink").href =
    `https://www.hotels.com/Hotel-Search?destination=${encodeURIComponent(firstCity)}&checkIn=${start}&checkOut=${checkout}`;
  document.getElementById("activitiesLink").href =
    `https://www.getyourguide.com/s/?q=${encodeURIComponent(firstCity + ', France')}`;
}

/* ---------- HELPERS ---------- */
function getSelectedCities() {
  return [...document.querySelectorAll(".city:checked")].map(i => i.value);
}
function getSelectedInterests() {
  return [...document.querySelectorAll(".interest:checked")].map(i => i.value);
}

/* ---------- ITINERARY BUILDER ---------- */
function buildItinerary() {
  const startDate = document.getElementById("startDate").value;
  const days = parseInt(document.getElementById("days").value || "0", 10);
  const cities = getSelectedCities();
  const output = document.getElementById("itineraryOutput");
  output.innerHTML = "";

  if (!startDate || days < 2 || cities.length < 1) {
    output.innerHTML = `<div class="it-day"><p>Please pick a start date, at least 2 days, and select destinations.</p></div>`;
    return;
  }

  const date = new Date(startDate);
  let dayNum = 1;
  const stayDays = Math.floor(days / cities.length);
  const remainder = days % cities.length;

  for (let c = 0; c < cities.length; c++) {
    const city = cities[c];
    const totalStay = stayDays + (c < remainder ? 1 : 0);

    for (let d = 0; d < totalStay; d++) {
      const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

      const el = document.createElement("div");
      el.className = "it-day schedule";
      el.innerHTML = `
        <div class="day-header">
          <div class="day-info">
            <h4>Day ${dayNum}</h4>
            <p>${formattedDate}</p>
          </div>
          <div class="city-name">${city}</div>
        </div>

        <div class="schedule-block">
          <div class="time-section">
            <h5>Morning:</h5>
            <div class="time-row"><span class="time">08:00</span> Breakfast and get ready</div>
            <div class="time-row"><span class="time">10:00</span> Visit first destination in ${city}</div>
          </div>

          <div class="time-section">
            <h5>Afternoon:</h5>
            <div class="time-row"><span class="time">14:00</span> Lunch and get ready for the next activity</div>
            <div class="time-row"><span class="time">16:00</span> Explore a cultural site in ${city}</div>
          </div>

          <div class="time-section">
            <h5>Evening:</h5>
            <div class="time-row"><span class="time">19:00</span> Evening stroll in ${city}</div>
            <div class="time-row"><span class="time">20:00</span> Dinner at a local restaurant</div>
          </div>
        </div>
      `;
      output.appendChild(el);

      date.setDate(date.getDate() + 1);
      dayNum++;
    }

    // Add travel day between cities
    if (c < cities.length - 1) {
      const travel = document.createElement("div");
      travel.className = "it-day travel-day";
      travel.innerHTML = `
        <div class="day-header">
          <div class="day-info">
            <h4>Travel Day</h4>
            <p>${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
          </div>
          <div class="city-name">${cities[c]} → ${cities[c + 1]}</div>
        </div>
        <div class="schedule-block">
          <div class="time-row"><span class="time">09:00</span> Depart from ${cities[c]}</div>
          <div class="time-row"><span class="time">12:00</span> Arrive in ${cities[c + 1]}</div>
          <div class="time-row"><span class="time">14:00</span> Check-in and relax at hotel</div>
        </div>
      `;
      output.appendChild(travel);
    }
  }
}

/* ---------- UTILITIES ---------- */
function copyItinerary() {
  const el = document.getElementById("itineraryOutput");
  const range = document.createRange();
  range.selectNode(el);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  try { document.execCommand("copy"); } catch (e) {}
  sel.removeAllRanges();
  alert("Itinerary copied to clipboard!");
}
function printItinerary() { window.print(); }

/* ---------- EVENT LISTENERS ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("plannerForm");
  const generateBtn = document.getElementById("generateBtn");
  const clearBtn = document.getElementById("clearBtn");
  const copyBtn = document.getElementById("copyBtn");
  const printBtn = document.getElementById("printBtn");
  const resetPageBtn = document.getElementById("resetPageBtn");

  ["startDate", "days"].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener("change", setExternalLinks);
  });
  document.querySelectorAll(".city").forEach(c => c.addEventListener("change", setExternalLinks));

  generateBtn.addEventListener("click", () => {
    setExternalLinks();
    buildItinerary();
    window.scrollTo({ top: document.querySelector(".itinerary").offsetTop - 20, behavior: "smooth" });
  });

  clearBtn.addEventListener("click", () => {
    form.reset();
    document.getElementById("itineraryOutput").innerHTML = "";
    setExternalLinks();
  });

  resetPageBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset everything and start over?")) {
      window.location.reload();
    }
  });

  copyBtn.addEventListener("click", copyItinerary);
  printBtn.addEventListener("click", printItinerary);

  // Template quick-fill
  document.querySelectorAll(".pill").forEach(btn => {
    btn.addEventListener("click", () => {
      const t = TEMPLATES[btn.dataset.template];
      if (!t) return;

      document.getElementById("days").value = t.days;
      document.getElementById("pace").value = t.pace;
      document.querySelectorAll(".city, .interest").forEach(i => (i.checked = false));
      t.cities.forEach(name => {
        const el = [...document.querySelectorAll(".city")].find(i => i.value === name);
        if (el) el.checked = true;
      });
      t.interests.forEach(k => {
        const el = [...document.querySelectorAll(".interest")].find(i => i.value === k);
        if (el) el.checked = true;
      });

      setExternalLinks();
    });
  });

  setExternalLinks();
});
