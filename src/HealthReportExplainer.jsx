
import { useState } from "react";
import "./HealthReportExplainer.css";

function formatReport(text) {
  if (!text) return null;

  // Remove escaped Markdown characters returned by the AI
  const cleanedText = text
    .replace(/\\([#*_\-`])/g, "$1")
    .replace(/\r\n/g, "\n")
    .trim();

  const lines = cleanedText.split("\n");
  const elements = [];
  let bulletItems = [];
  let numberedItems = [];
  let key = 0;

  function flushBullets() {
    if (bulletItems.length) {
      elements.push(
        <ul key={key++}>
          {bulletItems.map((item, index) => (
            <li key={index}>{formatInline(item)}</li>
          ))}
        </ul>
      );
      bulletItems = [];
    }
  }

  function flushNumbered() {
    if (numberedItems.length) {
      elements.push(
        <ol key={key++}>
          {numberedItems.map((item, index) => (
            <li key={index}>{formatInline(item)}</li>
          ))}
        </ol>
      );
      numberedItems = [];
    }
  }

  function formatInline(text) {
    const parts = text.split(/(\*\*.*?\*\*|__.*?__|\*.*?\*|_.*?_)/g);

    return parts.map((part, index) => {
      if (
        (part.startsWith("**") && part.endsWith("**")) ||
        (part.startsWith("__") && part.endsWith("__"))
      ) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }

      if (
        (part.startsWith("*") && part.endsWith("*")) ||
        (part.startsWith("_") && part.endsWith("_"))
      ) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }

      return part;
    });
  }

  for (const originalLine of lines) {
    const line = originalLine.trim();

    if (!line || /^---+$/.test(line)) {
      flushBullets();
      flushNumbered();
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    const bulletMatch = line.match(/^[-*+]\s+(.+)$/);
    const numberedMatch = line.match(/^\d+[.)]\s+(.+)$/);

    if (bulletMatch) {
      flushNumbered();
      bulletItems.push(bulletMatch[1]);
      continue;
    }

    if (numberedMatch) {
      flushBullets();
      numberedItems.push(numberedMatch[1]);
      continue;
    }

    flushBullets();
    flushNumbered();

    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = formatInline(headingMatch[2]);

      if (level <= 2) {
        elements.push(
          <h4 key={key++}>{content}</h4>
        );
      } else {
        elements.push(
          <h5 key={key++}>{content}</h5>
        );
      }
      continue;
    }

    elements.push(
      <p key={key++}>{formatInline(line)}</p>
    );
  }

  flushBullets();
  flushNumbered();

  return elements;
}

export default function HealthReportExplainer() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult("");

    if (!file) {
      setError("Please select a health report first.");
      return;
    }

    const formData = new FormData();
    formData.append("report", file);

    setLoading(true);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
      const response = await fetch(`${apiBaseUrl}/api/explain-report`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not explain this report."
        );
      }

      setResult(data.explanation || "");
    } catch (err) {
      setError(
        err.message ||
          "Could not connect to CAREPATH AI. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="report-section" id="report-explainer">
      <div className="report-container">
        <div className="report-heading">
          <span className="report-eyebrow">
            YOUR HEALTH, EXPLAINED
          </span>

          <h2>Health Report Explainer</h2>

          <p>
            Upload a laboratory report to understand its results
            in simple language and prepare questions for your doctor.
          </p>
        </div>

        <form className="report-card" onSubmit={handleSubmit}>
          <div className="report-icon" aria-hidden="true">
            <span>＋</span>
          </div>

          <h3>Upload your health report</h3>

          <p className="report-hint">
            Supported formats: PDF, JPG, PNG and WEBP.
            Maximum size: 10 MB.
          </p>

          <label
            className="report-file-label"
            htmlFor="health-report-file"
          >
            Choose report
          </label>

          <input
            id="health-report-file"
            className="report-file-input"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
            onChange={(event) => {
              setFile(event.target.files?.[0] || null);
              setResult("");
              setError("");
            }}
          />

          {file && (
            <p className="report-selected-file">
              Selected: {file.name}
            </p>
          )}

          <button
            className="report-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Analysing report..." : "Explain my report"}
          </button>

          {loading && (
            <p className="report-loading" role="status">
              CAREPATH AI is reading your report.
              This may take a little while.
            </p>
          )}

          {error && (
            <p className="report-error" role="alert">
              {error}
            </p>
          )}
        </form>

        {result && (
          <div className="report-result" aria-live="polite">
            <h3>Your report explained</h3>

            <div className="report-result-text">
              {formatReport(result)}
            </div>

            <p className="report-disclaimer">
              This AI-generated explanation is for educational
              purposes only. It does not provide a diagnosis or
              replace advice from a qualified healthcare professional.
              Discuss your results with your doctor.
            </p>
          </div>
        )}

        <p className="report-privacy">
          Health reports contain sensitive information. Upload only
          reports you are comfortable sharing with this AI service.
        </p>
      </div>
    </section>
  );
}
