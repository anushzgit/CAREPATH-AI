
import { useMemo, useState } from "react";
import "./App.css";
import SymptomChecker from "./SymptomChecker";
import HealthReportExplainer from "./HealthReportExplainer";

const specialties = [
  "All Specialties",
  "Cardiology",
  "Neurology",
  "General Medicine",
  "Orthopaedics",
  "Paediatrics",
];

const hospitalTemplates = [
  {
    name: "Greenleaf Multispeciality Centre",
    specialties: ["Cardiology", "General Medicine"],
    distanceKm: 1.2,
    travelMinutes: 5,
    waitingMinutes: 15,
    doctors: 12,
  },
  {
    name: "Sunrise Community Hospital",
    specialties: ["Paediatrics", "General Medicine"],
    distanceKm: 2.4,
    travelMinutes: 9,
    waitingMinutes: 20,
    doctors: 8,
  },
  {
    name: "WellSpring Medical Centre",
    specialties: ["Orthopaedics", "General Medicine"],
    distanceKm: 3.1,
    travelMinutes: 12,
    waitingMinutes: 25,
    doctors: 10,
  },
  {
    name: "Evercare Heart and Wellness Centre",
    specialties: ["Cardiology"],
    distanceKm: 4.3,
    travelMinutes: 15,
    waitingMinutes: 18,
    doctors: 6,
  },
  {
    name: "Clearview Neurology Clinic",
    specialties: ["Neurology"],
    distanceKm: 5.6,
    travelMinutes: 19,
    waitingMinutes: 30,
    doctors: 4,
  },
  {
    name: "Little Steps Children's Centre",
    specialties: ["Paediatrics"],
    distanceKm: 6.2,
    travelMinutes: 22,
    waitingMinutes: 12,
    doctors: 5,
  },
  {
    name: "Harmony General Hospital",
    specialties: ["General Medicine", "Orthopaedics"],
    distanceKm: 7.4,
    travelMinutes: 25,
    waitingMinutes: 35,
    doctors: 15,
  },
  {
    name: "Lifebridge Specialty Clinic",
    specialties: ["Cardiology", "Neurology"],
    distanceKm: 9.1,
    travelMinutes: 31,
    waitingMinutes: 22,
    doctors: 7,
  },
];

const supportedCities = [
  "Mirzapur",
  "Chennai",
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Bangalore",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Lucknow",
  "Jaipur",
  "Noida",
  "Gurugram",
  "Gurgaon",
  "Coimbatore",
  "Vellore",
  "Adyar",
  "Potheri",
];

function makeHospitals(location) {
  const cleanedLocation = location.trim();

  const city = supportedCities.find((item) =>
    cleanedLocation.toLowerCase().includes(item.toLowerCase())
  );

  const displayLocation = city || cleanedLocation;

  return hospitalTemplates.map((hospital, index) => ({
    ...hospital,
    id: `${displayLocation}-${index}`,
    location: displayLocation,
    address: `${displayLocation}, India`,
    initials: hospital.name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase(),
  }));
}

function App() {
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    "All Specialties"
  );
  const [locationQuery, setLocationQuery] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [rerouted, setRerouted] = useState(false);
  const [unavailableIds, setUnavailableIds] = useState([]);

  const filteredHospitals = useMemo(() => {
    return hospitals
      .filter((hospital) => !unavailableIds.includes(hospital.id))
      .filter(
        (hospital) =>
          selectedSpecialty === "All Specialties" ||
          hospital.specialties.includes(selectedSpecialty)
      )
      .sort((a, b) => a.travelMinutes - b.travelMinutes);
  }, [hospitals, selectedSpecialty, unavailableIds]);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const location = locationQuery.trim();

    if (!location) {
      setHasSearched(true);
      setError("Please enter a city, locality or PIN code to continue.");
      setNotice("");
      setHospitals([]);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setError("");
    setNotice("");
    setUnavailableIds([]);
    setRerouted(false);

    const results = makeHospitals(location);
    setHospitals(results);

    setNotice(
      `Demo results for ${location}. Distances, travel times, waiting times and doctor counts are illustrative estimates, not verified live information.`
    );

    setLoading(false);
  };

  const handleUseLocation = () => {
    setError("");
    setNotice(
      "For this demo, please type your city or locality in the location field."
    );
  };

  const handleReset = () => {
    setSelectedSpecialty("All Specialties");
    setLocationQuery("");
    setHospitals([]);
    setHasSearched(false);
    setNotice("");
    setError("");
    setUnavailableIds([]);
    setRerouted(false);
  };

  const handleReroute = () => {
    if (rerouted) {
      setUnavailableIds([]);
      setRerouted(false);
      setNotice("Demo simulation reset. All sample results are restored.");
    } else if (filteredHospitals.length > 0) {
      setUnavailableIds([filteredHospitals[0].id]);
      setRerouted(true);
      setNotice(
        "Demo simulation: one sample result is hidden. This does not represent a real hospital closure."
      );
    }
  };

  return (
    <div className="app-shell">
      <nav className="navbar">
        <a className="brand" href="#home" aria-label="CarePath AI home">
          <span className="brand-symbol">
            +<span>✦</span>
          </span>
          <span>
            CAREPATH <span className="brand-ai">AI</span>
          </span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#finder">Find Care</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#symptom-checker">Symptom Checker</a>
          <a href="#report-explainer">Health Report</a>
          <a href="#mission">Our Mission</a>
        </div>

        <button
          className="nav-cta"
          onClick={() => scrollToSection("finder")}
        >
          Find a hospital <span>↗</span>
        </button>
      </nav>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              SMARTER HEALTHCARE, SIMPLIFIED
            </div>

            <h1>
              Let's find your<br />
              way to the<br />
              <span className="headline-blue">right care.</span>
            </h1>

            <p className="hero-description">
              Explore a hospital-finder demo, compare sample care options and
              see estimated travel times from your selected location.
            </p>

            <div className="hero-buttons">
              <button
                className="button-primary"
                onClick={() => scrollToSection("finder")}
              >
                Find the right hospital <span>↗</span>
              </button>

              <a className="button-text" href="#how-it-works">
                See how it works <span>↓</span>
              </a>
            </div>

            <div className="hero-note">
              <span className="note-check">✓</span>
              Instant demo results. No external APIs required.
            </div>
          </div>

          <div className="hero-art" aria-label="Hospital finder preview">
            <div className="art-backdrop" />
            <div className="art-orbit orbit-a" />
            <div className="art-orbit orbit-b" />

            <div className="preview-card">
              <div className="preview-header">
                <div>
                  <span className="tiny-label">CARE OPTIONS</span>
                  <h3>Your care, at a glance.</h3>
                </div>
                <div className="preview-logo">+</div>
              </div>

              <div className="preview-search">
                <span className="preview-search-icon">⌕</span>
                <div>
                  <small>SEARCHING ACROSS</small>
                  <strong>India</strong>
                </div>
                <span className="preview-arrow">↗</span>
              </div>

              <div className="preview-result">
                <div className="preview-hospital-icon">+</div>
                <div className="preview-hospital-copy">
                  <strong>Sample hospital listings</strong>
                  <small>Illustrative demonstration data</small>
                </div>
                <span className="preview-check">✓</span>
              </div>

              <div className="preview-result">
                <div className="preview-hospital-icon">R</div>
                <div className="preview-hospital-copy">
                  <strong>Estimated travel times</strong>
                  <small>For demonstration only</small>
                </div>
                <span className="preview-check">✓</span>
              </div>

              <div className="preview-metrics">
                <div>
                  <span>DATA</span>
                  <strong>Demo</strong>
                </div>
                <div>
                  <span>ROUTES</span>
                  <strong>Estimated</strong>
                </div>
                <div>
                  <span>TRAFFIC</span>
                  <strong>Not live</strong>
                </div>
              </div>

              <div className="preview-footer">
                <span className="mini-live-dot" />
                Demo mode · No live hospital data
              </div>
            </div>

            <div className="art-label label-top">
              <div className="label-icon">✓</div>
              <div>
                <strong>Compare care options</strong>
                <small>All in one place</small>
              </div>
            </div>

            <div className="art-label label-bottom">
              <div className="label-icon label-blue">⌁</div>
              <div>
                <strong>Plan with clarity</strong>
                <small>Sample travel estimates</small>
              </div>
            </div>
          </div>
        </section>

        <section className="value-strip" aria-label="Key benefits">
          <div className="value-item">
            <span className="value-number">01</span>
            <div>
              <strong>Instant results</strong>
              <p>No waiting for external servers.</p>
            </div>
          </div>

          <div className="value-item">
            <span className="value-number">02</span>
            <div>
              <strong>Compare care options</strong>
              <p>Explore sample hospital profiles.</p>
            </div>
          </div>

          <div className="value-item">
            <span className="value-number">03</span>
            <div>
              <strong>Transparent demo</strong>
              <p>Sample figures are clearly labelled.</p>
            </div>
          </div>
        </section>
        
<div className="care-photo-banner">
  <img
    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=85"
    alt="Doctor discussing healthcare with a patient"
  />
  <div className="care-photo-overlay">
    <span>CARE THAT PUTS YOU FIRST</span>
    <h2>Better health starts with the right care.</h2>
    <p>Explore your options. Take your next step with confidence.</p>
  </div>
</div>


<section className="care-gallery">
  <div className="care-gallery-heading">
    <div className="eyebrow">HEALTHCARE, REIMAGINED</div>
    <h2>A closer look at better care.</h2>
    <p>Discover a more thoughtful way to explore healthcare options.</p>
  </div>

  <div className="care-gallery-grid">
    <div className="care-gallery-main">
      <img
        src="https://nerlekarhospital.com/_next/image?q=75&url=%2Fimages%2Fhospital-interior.png&w=1920"
        alt="Healthcare professional caring for a patient"
      />
      <div className="care-gallery-caption">
        <span>01</span>
        <h3>Care that puts you first</h3>
      </div>
    </div>

    <div className="care-gallery-side">
      <div className="care-gallery-small">
        <img
          src="https://glass.health/images/splash/specialty/primary.webp?utm_source=chatgpt.com"
          alt="Doctor in a modern clinical setting"
        />
        <div className="care-gallery-caption">
          <span>02</span>
          <h3>Expertise you can trust</h3>
        </div>
      </div>

      <div className="care-gallery-small">
        <img
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=85"
          alt="Healthcare team working together"
        />
        <div className="care-gallery-caption">
          <span>03</span>
          <h3>Better care, together</h3>
        </div>
      </div>
    </div>
  </div>
</section>


        <section className="finder-section" id="finder">
          <div className="section-intro">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                YOUR NEXT STEP STARTS HERE
              </div>
              <h2>
                Find care that<br />fits your needs.
              </h2>
            </div>

            <p>
              Choose a specialty and enter a city or locality to explore
              demonstration hospital profiles.
            </p>
          </div>

          <div className="finder-panel">
            <div className="finder-topline">
              <div className="finder-icon">⌕</div>
              <div>
                <strong>Let's find your hospital</strong>
                <small>Enter any location to preview sample results.</small>
              </div>
              <span className="demo-chip">DEMO DATA</span>
            </div>

            <form className="finder-controls" onSubmit={handleSearch}>
              <div className="select-container">
                <label htmlFor="specialty">MEDICAL SPECIALTY</label>
                <select
                  id="specialty"
                  value={selectedSpecialty}
                  onChange={(event) =>
                    setSelectedSpecialty(event.target.value)
                  }
                >
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="select-container">
                <label htmlFor="location">YOUR STARTING LOCATION</label>
                <input
                  id="location"
                  type="text"
                  value={locationQuery}
                  onChange={(event) => setLocationQuery(event.target.value)}
                  placeholder="e.g. Mumbai, Delhi"
                />
              </div>

              <button
                className="button-outline"
                type="button"
                onClick={handleUseLocation}
              >
                ⌖ Enter location manually
              </button>

              <button
                className="button-primary search-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading…" : "Find matching hospitals"} <span>↗</span>
              </button>
            </form>

            <div className="finder-footnote">
              <span>ⓘ</span>
              All hospital profiles and medical availability figures are
              illustrative demo data, not verified real-world information.
            </div>
          </div>

          {hasSearched && (
            <div className="results-area" aria-live="polite">
              <div className="results-top">
                <div>
                  <div className="eyebrow">
                    <span className="eyebrow-dot" />
                    YOUR MATCHES
                  </div>
                  <h2>
                    Hospital <span className="title-period">results.</span>
                  </h2>
                  <p>
                    {filteredHospitals.length} matching sample hospital profiles
                  </p>
                  {locationQuery.trim() && (
                    <p className="origin-label">
                      Starting point: {locationQuery.trim()}
                    </p>
                  )}
                </div>

                <button className="reset-button" onClick={handleReset}>
                  ↺ Reset search
                </button>
              </div>

              {(notice || error) && (
                <div
                  className={`notice-bar ${
                    error || rerouted ? "notice-warning" : ""
                  }`}
                >
                  <span className="notice-symbol">
                    {error || rerouted ? "!" : "✓"}
                  </span>
                  <span>{error || notice}</span>
                </div>
              )}

              {!loading && !error && filteredHospitals.length > 0 && (
                <div className="hospital-list">
                  {filteredHospitals.map((hospital, index) => (
                    <article
                      className={`hospital-card ${
                        index === 0 ? "hospital-card-best" : ""
                      }`}
                      key={hospital.id}
                    >
                      <div className="hospital-monogram monogram-1">
                        {hospital.initials}
                      </div>

                      <div className="hospital-main">
                        <div className="hospital-name-line">
                          {index === 0 && (
                            <span className="rank-label">
                              SHORTEST DEMO ESTIMATE
                            </span>
                          )}
                          <span className="demo-status">
                            <span /> DEMO PROFILE
                          </span>
                        </div>

                        <h3>{hospital.name}</h3>

                        <p className="hospital-location">
                          <span>⌖</span> {hospital.address}
                        </p>

                        <div className="tag-row">
                          {hospital.specialties.map((specialty) => (
                            <span key={specialty}>{specialty}</span>
                          ))}
                        </div>

                        <p className="metric-caption">
                          Illustrative profile · Not a verified listing
                        </p>
                      </div>

                      <div className="time-metric">
                        <span>DEMO DISTANCE</span>
                        <strong>
                          {hospital.distanceKm}<small> km</small>
                        </strong>
                        <small className="metric-caption">Sample estimate</small>
                      </div>

                      <div className="time-total">
                        <span>DEMO DRIVE</span>
                        <strong>
                          {hospital.travelMinutes}<small> min</small>
                        </strong>
                        <span className="specialist-count">
                          {hospital.doctors} sample doctors
                        </span>
                        <small className="metric-caption">
                          Wait: ~{hospital.waitingMinutes} min
                        </small>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {!loading && !error && filteredHospitals.length === 0 && (
                <div className="empty-results">
                  <span>⌕</span>
                  <h3>No matching demo profiles</h3>
                  <p>Try another specialty or choose All Specialties.</p>
                  <button className="button-outline" onClick={handleReset}>
                    Reset search
                  </button>
                </div>
              )}

              <p className="data-disclaimer">
                DEMONSTRATION ONLY: Hospital names, addresses, distances,
                driving times, waiting times and doctor counts are illustrative
                sample values. They do not represent verified hospitals or
                real medical availability. Always verify healthcare
                information independently.
              </p>

              <div className="reroute-panel">
                <div className="reroute-icon">⌁</div>
                <div className="reroute-copy">
                  <span className="tiny-label">REROUTING SIMULATION</span>
                  <h3>
                    {rerouted
                      ? "Restore the displayed options"
                      : "What if an option is unavailable?"}
                  </h3>
                  <p>
                    Hide one sample result to demonstrate how the interface
                    responds to an unavailable option.
                  </p>
                </div>

                <button
                  className="button-outline"
                  onClick={handleReroute}
                  disabled={filteredHospitals.length === 0 && !rerouted}
                >
                  {rerouted ? "Restore results" : "Simulate rerouting"} <span>↗</span>
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="how-section" id="how-it-works">
          <div className="how-heading">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              SIMPLE BY DESIGN
            </div>
            <h2>Three steps. A clearer way forward.</h2>
            <p>Preview the hospital-finder experience using sample data.</p>

<div className="how-photo">
  <img
    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=85"
    alt="Healthcare professional in a clinical setting"
  />
  <div className="how-photo-overlay">
    <span>CARE WITH CONFIDENCE</span>
    <h3>Your next step starts with better information.</h3>
  </div>
</div>

          </div>

          <div className="how-grid">
            <article className="how-card">
              <div className="how-card-top">
                <span>STEP 01</span><span className="how-icon">⌕</span>
              </div>
              <h3>Choose your starting point</h3>
              <p>Enter a city or locality to start exploring the demo.</p>
            </article>

            <article className="how-card how-card-blue">
              <div className="how-card-top">
                <span>STEP 02</span><span className="how-icon">◷</span>
              </div>
              <h3>Compare care options</h3>
              <p>
                Review sample specialties, distances and estimated waiting times.
              </p>
            </article>

            <article className="how-card">
              <div className="how-card-top">
                <span>STEP 03</span><span className="how-icon">↗</span>
              </div>
              <h3>Explore the simulation</h3>
              <p>
                Use filters and rerouting to see the prototype in action.
              </p>
            </article>
          </div>
        </section>

        <section className="mission-section" id="mission">
          <div className="mission-mark">+<span>✦</span></div>
          <div className="mission-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              WHY CAREPATH AI
            </div>
            <h2>Finding care should be clearer, not harder.</h2>
            <p>
              CAREPATH AI explores a simpler way to discover care options.
              This prototype uses sample data to demonstrate its search,
              filtering and rerouting experience.
            </p>
          </div>
          

<div className="mission-photo">
  <img
    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=85"
    alt="Bright modern hospital interior"
  />
  <div className="mission-photo-label">
    <span>+</span>
    Thoughtful care. Clearer choices.
  </div>
</div>


          <button
            className="button-primary"
            onClick={() => scrollToSection("finder")}
          >
            Explore the finder <span>↗</span>
          </button>
        </section>

        <section id="symptom-checker">
          <SymptomChecker />
        </section>

        <HealthReportExplainer />
      </main>

      <footer className="footer">
        <a className="brand" href="#home">
          <span className="brand-symbol">
            +<span>✦</span>
          </span>
          <span>
            CAREPATH <span className="brand-ai">AI</span>
          </span>
        </a>

        <p>Thoughtful technology. Clearer care journeys.</p>

        <div className="footer-disclaimer">
          Prototype with illustrative demo data.<br />
          Not a substitute for professional medical advice.
        </div>
      </footer>

      <div className="map-attribution">
        CAREPATH AI · Hackathon demonstration prototype
      </div>
    </div>
  );
}

export default App;
