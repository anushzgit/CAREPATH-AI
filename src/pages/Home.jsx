
import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <main className="home-page">
      <section className="hero hero-reversed">
        <div className="hero-art">
          <img
            className="home-hero-photo"
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85"
            alt="Healthcare professional discussing patient care"
          />

          <div className="home-floating-card">
            <span className="home-floating-icon">✦</span>
            <div>
              <strong>Your care, made clearer.</strong>
              <p>Explore tools designed around you.</p>
            </div>
          </div>
        </div>

        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            SMARTER HEALTHCARE, SIMPLIFIED
          </div>

          <h1>
            Your health journey,
            <br />
            <span className="headline-blue">a clearer path.</span>
          </h1>

          <p className="hero-description">
            Explore healthcare options, understand your symptoms
            and make sense of your health reports — all in one place.
          </p>

          <div className="hero-buttons">
            <button
              className="button-primary"
              onClick={() => navigate("/hospitals")}
            >
              Explore healthcare <span>↗</span>
            </button>

            <button
              className="button-text"
              onClick={() => navigate("/symptom-checker")}
            >
              Check your symptoms <span>→</span>
            </button>
          </div>

          <div className="hero-note">
            <span className="note-check">✓</span>
            Three tools. One thoughtful healthcare experience.
          </div>
        </div>
      </section>

      <section className="home-photo-gallery">
        <div className="home-photo-heading">
          <span>HEALTHCARE, REIMAGINED</span>
          <h2>A closer look at better care.</h2>
          <p>Thoughtful care. Clearer choices. A healthier journey.</p>
        </div>

        <div className="home-photo-grid">
          <article className="home-photo-card home-photo-large">
            <img
              src="https://glass.health/images/splash/specialty/primary.webp"
              alt="Healthcare professional in a clinical setting"
            />
            <div className="home-photo-caption">
              <span>01 / PERSONAL CARE</span>
              <h3>Care that puts you first.</h3>
            </div>
          </article>

          <div className="home-photo-stack">
            <article className="home-photo-card">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=85"
                alt="Bright modern hospital interior"
              />
              <div className="home-photo-caption">
                <span>02 / BETTER SPACES</span>
                <h3>A calmer path to care.</h3>
              </div>
            </article>

            <article className="home-photo-card">
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=85"
                alt="Healthcare team working together"
              />
              <div className="home-photo-caption">
                <span>03 / WORKING TOGETHER</span>
                <h3>Better care, together.</h3>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="home-tools">
        <div className="care-gallery-heading">
          <div className="eyebrow">YOUR HEALTHCARE COMPANION</div>
          <h2>How can we help you today?</h2>
          <p>Start with the tool that fits your needs.</p>
        </div>

        <div className="home-tools-grid">
          <button
            className="home-tool-card"
            onClick={() => navigate("/hospitals")}
          >
            <span className="home-tool-icon">⌕</span>
            <span className="home-tool-label">01 · FIND CARE</span>
            <strong>Explore hospital options</strong>
            <p>
              Browse sample hospital profiles and explore specialty filters.
            </p>
            <span className="home-tool-link">Find care ↗</span>
          </button>

          <button
            className="home-tool-card home-tool-mint"
            onClick={() => navigate("/symptom-checker")}
          >
            <span className="home-tool-icon">✳</span>
            <span className="home-tool-label">02 · SYMPTOMS</span>
            <strong>Understand your symptoms</strong>
            <p>
              Explore the symptom checker for general health guidance.
            </p>
            <span className="home-tool-link">Check symptoms ↗</span>
          </button>

          <button
            className="home-tool-card home-tool-lavender"
            onClick={() => navigate("/health-report")}
          >
            <span className="home-tool-icon">＋</span>
            <span className="home-tool-label">03 · HEALTH REPORTS</span>
            <strong>Make sense of your reports</strong>
            <p>
              Get help understanding common medical terms and report values.
            </p>
            <span className="home-tool-link">Explore reports ↗</span>
          </button>
        </div>
      </section>

      <section className="home-care-banner">
        <div>
          <span>CARE WITH CONFIDENCE</span>
          <h2>A little more clarity can make the next step easier.</h2>
          <p>
            Explore CAREPATH AI's tools and take the next step
            in your healthcare journey.
          </p>
        </div>

        <button
          className="button-primary"
          onClick={() => navigate("/health-report")}
        >
          Explore health tools <span>↗</span>
        </button>
      </section>

      <footer className="footer">
        <a className="brand" href="/">
          <span className="brand-symbol">
            +<span>✦</span>
          </span>
          <span>
            CAREPATH <span className="brand-ai">AI</span>
          </span>
        </a>

        <p>Thoughtful technology. Clearer care journeys.</p>

        <div className="footer-disclaimer">
          Healthcare prototype. Not a substitute for professional medical advice.
        </div>
      </footer>
    </main>
  );
}

export default Home;
