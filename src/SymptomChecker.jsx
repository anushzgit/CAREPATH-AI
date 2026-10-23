
import { useState } from "react";
import "./SymptomChecker.css";

const symptomGroups = [
  {
    title: "General",
    symptoms: ["Fever", "Fatigue", "Body aches", "Headache", "Dizziness"],
  },
  {
    title: "Respiratory",
    symptoms: ["Cough", "Sore throat", "Runny nose", "Shortness of breath"],
  },
  {
    title: "Digestive",
    symptoms: ["Nausea", "Vomiting", "Stomach pain", "Diarrhoea", "Constipation"],
  },
  {
    title: "Other",
    symptoms: ["Skin rash", "Joint pain", "Chest pain", "Fainting"],
  },
];

const emergencySymptoms = ["Chest pain", "Shortness of breath", "Fainting"];

function assessSymptoms(symptoms, severity, duration) {
  const hasEmergency = symptoms.some((s) => emergencySymptoms.includes(s));

  if (hasEmergency) {
    return {
      level: "urgent",
      title: "Seek urgent medical assessment",
      description:
        "Chest pain, difficulty breathing, or fainting can have serious causes. Do not rely on this demo to assess these symptoms.",
      actions: [
        "If symptoms are happening now, are severe, or are worsening, contact local emergency services immediately.",
        "In India, call 112 for emergency assistance.",
        "Do not drive yourself if you feel faint or seriously unwell.",
      ],
    };
  }

  if (severity === "Severe" || (severity === "Moderate" && duration === "More than 3 days")) {
    return {
      level: "soon",
      title: "Arrange a medical consultation",
      description:
        "Your reported severity or symptom duration suggests that professional assessment would be sensible.",
      actions: [
        "Contact a qualified healthcare professional promptly.",
        "Seek urgent care if symptoms worsen or new warning signs appear.",
        "Note when symptoms started and any medicines you have taken.",
      ],
    };
  }

  return {
    level: "routine",
    title: "Monitor symptoms and consider medical advice",
    description:
      "These symptoms can have many causes. This demo cannot determine which condition, if any, is responsible.",
    actions: [
      "Rest and maintain fluids if you can do so safely.",
      "Track whether symptoms improve, persist, or worsen.",
      "Speak with a healthcare professional if symptoms persist, concern you, or interfere with daily activities.",
    ],
  };
}

export default function SymptomChecker() {
  const [selected, setSelected] = useState([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [severity, setSeverity] = useState("Mild");
  const [duration, setDuration] = useState("Today");
  const [ageGroup, setAgeGroup] = useState("Adult");
  const [result, setResult] = useState(null);

  function toggleSymptom(symptom) {
    setSelected((current) =>
      current.includes(symptom)
        ? current.filter((item) => item !== symptom)
        : [...current, symptom]
    );
    setResult(null);
  }

  function addCustomSymptom(event) {
    event.preventDefault();
    const value = customSymptom.trim();
    if (!value) return;

    setSelected((current) =>
      current.some((item) => item.toLowerCase() === value.toLowerCase())
        ? current
        : [...current, value]
    );
    setCustomSymptom("");
    setResult(null);
  }

  function handleAssessment(event) {
    event.preventDefault();

    if (selected.length === 0) {
      setResult({
        level: "error",
        title: "Select at least one symptom",
        description: "Choose a symptom above to see the demo guidance.",
        actions: [],
      });
      return;
    }

    if (ageGroup === "Under 5") {
      setResult({
        level: "soon",
        title: "Get advice from a healthcare professional",
        description:
          "Young children can become unwell quickly. This demo is not designed to assess children under five.",
        actions: [
          "Contact a paediatric healthcare professional for advice.",
          "Seek urgent care for breathing difficulty, unusual drowsiness, dehydration, or rapid worsening.",
        ],
      });
      return;
    }

    setResult(assessSymptoms(selected, severity, duration));
  }

  function resetChecker() {
    setSelected([]);
    setCustomSymptom("");
    setSeverity("Mild");
    setDuration("Today");
    setAgeGroup("Adult");
    setResult(null);
  }

  return (
    <section className="symptom-section" id="symptom-checker">
      <div className="symptom-heading">
        <span className="symptom-eyebrow">CAREPATH AI · HEALTH TOOLS</span>
        <h2>AI Symptom Checker</h2>
        <p>
          Share what you are experiencing to explore general next steps.
          No account or API key needed.
        </p>
      </div>

      <div className="symptom-disclaimer">
        <span className="disclaimer-icon" aria-hidden="true">ⓘ</span>
        <p>
          <strong>Demo guidance, not a diagnosis.</strong> This prototype uses
          simple local rules, not a medical AI model. It cannot confirm a
          condition or replace a qualified healthcare professional.
        </p>
      </div>

      <form className="symptom-card" onSubmit={handleAssessment}>
        <div className="symptom-step-title">
          <span className="step-number">01</span>
          <div>
            <h3>What symptoms are you experiencing?</h3>
            <p>Select all that apply.</p>
          </div>
        </div>

        <div className="symptom-groups">
          {symptomGroups.map((group) => (
            <div className="symptom-group" key={group.title}>
              <h4>{group.title}</h4>
              <div className="symptom-options">
                {group.symptoms.map((symptom) => (
                  <button
                    type="button"
                    key={symptom}
                    className={`symptom-chip ${
                      selected.includes(symptom) ? "selected" : ""
                    }`}
                    aria-pressed={selected.includes(symptom)}
                    onClick={() => toggleSymptom(symptom)}
                  >
                    {selected.includes(symptom) ? "✓ " : "+ "}
                    {symptom}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="custom-symptom-row">
          <label htmlFor="custom-symptom">Another symptom?</label>
          <div className="custom-symptom-input">
            <input
              id="custom-symptom"
              value={customSymptom}
              onChange={(event) => setCustomSymptom(event.target.value)}
              placeholder="Enter a symptom"
              maxLength={80}
            />
            <button type="button" onClick={addCustomSymptom}>
              Add
            </button>
          </div>
        </div>

        {selected.length > 0 && (
          <div className="selected-summary">
            <span>{selected.length} selected</span>
            {selected.map((symptom) => (
              <button
                type="button"
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                aria-label={`Remove ${symptom}`}
                title={`Remove ${symptom}`}
              >
                {symptom} ×
              </button>
            ))}
          </div>
        )}

        <div className="symptom-divider" />

        <div className="symptom-step-title">
          <span className="step-number">02</span>
          <div>
            <h3>A little more detail</h3>
            <p>This helps the demo choose general guidance.</p>
          </div>
        </div>

        <div className="symptom-fields">
          <div className="symptom-field">
            <label htmlFor="symptom-severity">How severe does it feel?</label>
            <select
              id="symptom-severity"
              value={severity}
              onChange={(event) => {
                setSeverity(event.target.value);
                setResult(null);
              }}
            >
              <option>Mild</option>
              <option>Moderate</option>
              <option>Severe</option>
            </select>
          </div>

          <div className="symptom-field">
            <label htmlFor="symptom-duration">How long has it been happening?</label>
            <select
              id="symptom-duration"
              value={duration}
              onChange={(event) => {
                setDuration(event.target.value);
                setResult(null);
              }}
            >
              <option>Today</option>
              <option>1–3 days</option>
              <option>More than 3 days</option>
            </select>
          </div>

          <div className="symptom-field">
            <label htmlFor="symptom-age">Age group</label>
            <select
              id="symptom-age"
              value={ageGroup}
              onChange={(event) => {
                setAgeGroup(event.target.value);
                setResult(null);
              }}
            >
              <option>Adult</option>
              <option>5–17</option>
              <option>Under 5</option>
              <option>65+</option>
            </select>
          </div>
        </div>

        <div className="symptom-actions">
          <button className="symptom-submit" type="submit">
            Review my symptoms <span aria-hidden="true">→</span>
          </button>
          <button className="symptom-reset" type="button" onClick={resetChecker}>
            Reset
          </button>
        </div>

        {result && (
          <div
            className={`symptom-result result-${result.level}`}
            role="status"
            aria-live="polite"
          >
            <div className="result-topline">
              <span className="result-indicator" aria-hidden="true">
                {result.level === "urgent" ? "!" : result.level === "error" ? "i" : "✓"}
              </span>
              <div>
                <span className="result-label">
                  {result.level === "urgent"
                    ? "URGENT WARNING"
                    : result.level === "soon"
                    ? "NEXT STEP"
                    : result.level === "error"
                    ? "ONE MORE STEP"
                    : "DEMO GUIDANCE"}
                </span>
                <h3>{result.title}</h3>
              </div>
            </div>

            <p>{result.description}</p>

            {result.actions.length > 0 && (
              <>
                <h4>What you can do</h4>
                <ul>
                  {result.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </>
            )}

            <p className="result-footnote">
              Selected symptoms: {selected.join(", ")}. Age group: {ageGroup}.
              This rule-based result is illustrative and may miss serious
              conditions. If you feel seriously unwell, seek medical help
              regardless of this result.
            </p>
          </div>
        )}
      </form>

      <p className="symptom-footer-note">
        Your answers are processed in this page only and are not sent to an
        external API by this component.
      </p>
    </section>
  );
}
