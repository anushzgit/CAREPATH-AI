import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink className="brand" to="/" aria-label="CAREPATH AI Home">
        <span className="brand-symbol">
          +<span>✦</span>
        </span>
        <span>
          CAREPATH <span className="brand-ai">AI</span>
        </span>
      </NavLink>

      <div className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/hospitals">Find Care</NavLink>
        <NavLink to="/symptom-checker">Symptom Checker</NavLink>
        <NavLink to="/health-report">Health Report</NavLink>
      </div>

      <NavLink className="nav-cta" to="/hospitals">
        Find a hospital <span>↗</span>
      </NavLink>
    </nav>
  );
}

export default Navbar;