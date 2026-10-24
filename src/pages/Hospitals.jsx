
import { useMemo, useState } from "react";
import "../App.css";

const specialties = [
  "All Specialties",
  "Cardiology",
  "Neurology",
  "General Medicine",
  "Orthopaedics",
  "Paediatrics",
];

const hospitalTemplates = [
  { name: "Greenleaf Multispeciality Centre", specialties: ["Cardiology", "General Medicine"], distanceKm: 1.2, travelMinutes: 5, waitingMinutes: 15, doctors: 12 },
  { name: "Sunrise Community Hospital", specialties: ["Paediatrics", "General Medicine"], distanceKm: 2.4, travelMinutes: 9, waitingMinutes: 20, doctors: 8 },
  { name: "WellSpring Medical Centre", specialties: ["Orthopaedics", "General Medicine"], distanceKm: 3.1, travelMinutes: 12, waitingMinutes: 25, doctors: 10 },
  { name: "Evercare Heart and Wellness Centre", specialties: ["Cardiology"], distanceKm: 4.3, travelMinutes: 15, waitingMinutes: 18, doctors: 6 },
  { name: "Clearview Neurology Clinic", specialties: ["Neurology"], distanceKm: 5.6, travelMinutes: 19, waitingMinutes: 30, doctors: 4 },
  { name: "Little Steps Children's Centre", specialties: ["Paediatrics"], distanceKm: 6.2, travelMinutes: 22, waitingMinutes: 12, doctors: 5 },
  { name: "Harmony General Hospital", specialties: ["General Medicine", "Orthopaedics"], distanceKm: 7.4, travelMinutes: 25, waitingMinutes: 35, doctors: 15 },
  { name: "Lifebridge Specialty Clinic", specialties: ["Cardiology", "Neurology"], distanceKm: 9.1, travelMinutes: 31, waitingMinutes: 22, doctors: 7 },
];

function makeHospitals(location) {
  return hospitalTemplates.map((hospital, index) => ({
    ...hospital,
    id: `${location}-${index}`,
    location,
    address: `${location}, India`,
    initials: hospital.name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase(),
  }));
}

function Hospitals() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [locationQuery, setLocationQuery] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [rerouted, setRerouted] = useState(false);
  const [unavailableIds, setUnavailableIds] = useState([]);

  const filteredHospitals = useMemo(
    () =>
      hospitals
        .filter((hospital) => !unavailableIds.includes(hospital.id))
        .filter(
          (hospital) =>
            selectedSpecialty === "All Specialties" ||
            hospital.specialties.includes(selectedSpecialty)
        )
        .sort((a, b) => a.travelMinutes - b.travelMinutes),
    [hospitals, selectedSpecialty, unavailableIds]
  );

  function handleSearch(event) {
    event.preventDefault();
    const location = locationQuery.trim();

    if (!location) {
      setError("Please enter a city, locality or PIN code to continue.");
      setNotice("");
      setHospitals([]);
      setHasSearched(true);
      return;
    }

    setError("");
    setNotice(
      `Demo results for ${location}. All distances and times are illustrative estimates, not verified live information.`
    );
    setHospitals(makeHospitals(location));
    setHasSearched(true);
    setUnavailableIds([]);
    setRerouted(false);
  }

  function handleReset() {
    setSelectedSpecialty("All Specialties");
    setLocationQuery("");
    setHospitals([]);
    setHasSearched(false);
    setNotice("");
    setError("");
    setUnavailableIds([]);
    setRerouted(false);
  }

  function handleReroute() {
    if (rerouted) {
      setUnavailableIds([]);
      setRerouted(false);
      setNotice("Demo simulation reset. All sample results are restored.");
    } else if (filteredHospitals.length > 0) {
      setUnavailableIds([filteredHospitals[0].id]);
      setRerouted(true);
      setNotice("Demo simulation: one sample result is hidden. No real hospital closure is represented.");
    }
  }

  return (
    <main className="hospital-page">
      <section className="finder-section" id="finder">
        <div className="section-intro">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              YOUR NEXT STEP STARTS HERE
            </div>
            <h2>Find care that<br />fits your needs.</h2>
          </div>
          <p>Choose a specialty and enter a city or locality to explore sample hospital profiles.</p>
        </div>

        <div className="finder-panel">
          <div className="finder-topline">
            <div className="finder-icon">⌕</div>
            <div>
              <strong>Let's find your hospital</strong>
              <small>Enter a location to preview sample results.</small>
            </div>
            <span className="demo-chip">DEMO DATA</span>
          </div>

          <form className="finder-controls" onSubmit={handleSearch}>
            <div className="select-container">
              <label htmlFor="hospital-specialty">MEDICAL SPECIALTY</label>
              <select
                id="hospital-specialty"
                value={selectedSpecialty}
                onChange={(event) => setSelectedSpecialty(event.target.value)}
              >
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>

            <div className="select-container">
              <label htmlFor="hospital-location">YOUR STARTING LOCATION</label>
              <input
                id="hospital-location"
                value={locationQuery}
                onChange={(event) => setLocationQuery(event.target.value)}
                placeholder="e.g. Mumbai, Delhi"
              />
            </div>

            <button className="button-primary search-submit" type="submit">
              Find matching hospitals <span>↗</span>
            </button>
          </form>

          <div className="finder-footnote">
            ⓘ Hospital names, profiles and availability figures are illustrative demo data.
          </div>
        </div>

        {hasSearched && (
          <div className="results-area" aria-live="polite">
            <div className="results-top">
              <div>
                <div className="eyebrow">YOUR MATCHES</div>
                <h2>Hospital <span className="title-period">results.</span></h2>
                <p>{filteredHospitals.length} matching sample hospital profiles</p>
                {locationQuery.trim() && <p className="origin-label">Starting point: {locationQuery.trim()}</p>}
              </div>
              <button className="reset-button" onClick={handleReset}>↺ Reset search</button>
            </div>

            {(notice || error) && (
              <div className={`notice-bar ${error || rerouted ? "notice-warning" : ""}`}>
                <span className="notice-symbol">{error || rerouted ? "!" : "✓"}</span>
                <span>{error || notice}</span>
              </div>
            )}

            {!error && filteredHospitals.length > 0 && (
              <div className="hospital-list">
                {filteredHospitals.map((hospital, index) => (
                  <article className={`hospital-card ${index === 0 ? "hospital-card-best" : ""}`} key={hospital.id}>
                    <div className="hospital-monogram monogram-1">{hospital.initials}</div>
                    <div className="hospital-main">
                      <div className="hospital-name-line">
                        {index === 0 && <span className="rank-label">SHORTEST DEMO ESTIMATE</span>}
                        <span className="demo-status"><span /> DEMO PROFILE</span>
                      </div>
                      <h3>{hospital.name}</h3>
                      <p className="hospital-location">⌖ {hospital.address}</p>
                      <div className="tag-row">
                        {hospital.specialties.map((specialty) => <span key={specialty}>{specialty}</span>)}
                      </div>
                      <p className="metric-caption">Illustrative profile · Not a verified listing</p>
                    </div>
                    <div className="time-metric">
                      <span>DEMO DISTANCE</span>
                      <strong>{hospital.distanceKm}<small> km</small></strong>
                      <small className="metric-caption">Sample estimate</small>
                    </div>
                    <div className="time-total">
                      <span>DEMO DRIVE</span>
                      <strong>{hospital.travelMinutes}<small> min</small></strong>
                      <span className="specialist-count">{hospital.doctors} sample doctors</span>
                      <small className="metric-caption">Wait: ~{hospital.waitingMinutes} min</small>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {!error && filteredHospitals.length === 0 && (
              <div className="empty-results">
                <span>⌕</span>
                <h3>No matching demo profiles</h3>
                <p>Try another specialty or choose All Specialties.</p>
                <button className="button-outline" onClick={handleReset}>Reset search</button>
              </div>
            )}

            <p className="data-disclaimer">
              DEMONSTRATION ONLY: These sample profiles, distances, driving times,
              waiting times and doctor counts are not verified real-world information.
            </p>

            <div className="reroute-panel">
              <div className="reroute-icon">⌁</div>
              <div className="reroute-copy">
                <span className="tiny-label">REROUTING SIMULATION</span>
                <h3>{rerouted ? "Restore the displayed options" : "What if an option is unavailable?"}</h3>
                <p>Hide one sample result to demonstrate how the interface responds to an unavailable option.</p>
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
    </main>
  );
}

export default Hospitals;
