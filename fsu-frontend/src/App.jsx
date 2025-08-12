import "./App.css";
import { useState, useEffect } from "react";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import SubmissionForm from "./components/SubmissionForm.jsx";
import AdminControls from "./components/AdminControls.jsx";

function App() {
  // State variables
  const [ballets, setBallets] = useState([]);
  const [steps, setSteps] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("home");
  const [error, setError] = useState(null);

  // Authentication state
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // "login" or "register"

  // API URL
  const API_URL = "http://localhost:3002";

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Load data when component starts (regardless of authentication)
  useEffect(() => {
    loadData();
  }, []);

  // Load all data
  async function loadData() {
    try {
      console.log("Starting to load data...");
      setError(null);

      // Load ballets
      console.log("Fetching ballets...");
      const balletsResponse = await fetch(`${API_URL}/api/ballets-with-steps`);
      console.log("Ballets response status:", balletsResponse.status);

      if (!balletsResponse.ok) {
        throw new Error(`Ballets API error: ${balletsResponse.status}`);
      }

      const balletsData = await balletsResponse.json();
      console.log("Ballets loaded:", balletsData.length, "items");
      setBallets(balletsData);

      // Load steps
      console.log("Fetching steps...");
      const stepsResponse = await fetch(`${API_URL}/api/steps-with-equipment`);
      console.log("Steps response status:", stepsResponse.status);

      if (!stepsResponse.ok) {
        throw new Error(`Steps API error: ${stepsResponse.status}`);
      }

      const stepsData = await stepsResponse.json();
      console.log("Steps loaded:", stepsData.length, "items");
      setSteps(stepsData);

      // Load equipment
      console.log("Fetching equipment...");
      const equipmentResponse = await fetch(`${API_URL}/api/equipment`);
      console.log("Equipment response status:", equipmentResponse.status);

      if (!equipmentResponse.ok) {
        throw new Error(`Equipment API error: ${equipmentResponse.status}`);
      }

      const equipmentData = await equipmentResponse.json();
      console.log("Equipment loaded:", equipmentData.length, "items");
      setEquipment(equipmentData);

      setLoading(false);
      console.log("All data loaded successfully!");
    } catch (error) {
      console.error("Error loading data:", error);
      setError(error.message);
      setLoading(false);
    }
  }

  // Authentication handlers
  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage("home");
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setCurrentPage("home");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentPage("home");
  };

  const continueAsGuest = () => {
    setCurrentPage("home");
  };

  const switchToRegister = () => {
    setAuthMode("register");
  };

  const switchToLogin = () => {
    setAuthMode("login");
  };

  // Admin delete handlers
  const handleDeleteBallet = (balletId) => {
    setBallets(ballets.filter((ballet) => ballet.id !== balletId));
  };

  const handleDeleteStep = (stepId) => {
    setSteps(steps.filter((step) => step.id !== stepId));
  };

  const handleDeleteEquipment = (equipmentId) => {
    setEquipment(equipment.filter((item) => item.id !== equipmentId));
  };

  // Submission handlers
  const handleSubmitBallet = async (formData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/ballets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to submit ballet");
    }

    await loadData(); // Reload data to show new ballet
    setCurrentPage("ballets");
  };

  const handleSubmitStep = async (formData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/steps`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to submit step");
    }

    await loadData(); // Reload data to show new step
    setCurrentPage("steps");
  };

  const handleSubmitEquipment = async (formData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/equipment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to submit equipment");
    }

    await loadData(); // Reload data to show new equipment
    setCurrentPage("equipment");
  };

  // Function to go back to home page
  function goBackToHome() {
    setCurrentPage("home");
  }

  // Function to change page
  function changePage(page) {
    setCurrentPage(page);
  }

  // Navigation component
  const Navigation = () => (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-brand">
          <h3>Ballet</h3>
        </div>
        <div className="nav-links">
          <a href="#" onClick={() => changePage("home")}>
            Home
          </a>
          <a href="#" onClick={() => changePage("about")}>
            About
          </a>
          <a href="#" onClick={() => changePage("contact")}>
            Contact
          </a>
          {user ? (
            <div className="user-info">
              <span>Welcome, {user.username}!</span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentPage("auth")}
              style={{
                background: "#55828b",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "0.9rem",
                transition: "background-color 0.3s"
              }}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );

  // If user is not logged in, show authentication with guest option
  if (!user && currentPage === "auth") {
    return (
      <div>
        <header className="header">
          <h1>Ballet Academy</h1>
          <p>Discover the art</p>
        </header>
        <Navigation />
        {authMode === "login" ? (
          <Login onLogin={handleLogin} onSwitchToRegister={switchToRegister} />
        ) : (
          <Register
            onRegister={handleRegister}
            onSwitchToLogin={switchToLogin}
          />
        )}
        <div className="content">
          <div className="auth-card" style={{ marginTop: "20px" }}>
            <button
              onClick={continueAsGuest}
              style={{
                width: "100%",
                background: "#6c757d",
                color: "white",
                padding: "0.8rem",
                border: "none",
                borderRadius: "5px",
                fontSize: "1rem",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background-color 0.3s"
              }}>
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading message
  if (loading) {
    return (
      <div>
        <header className="header">
          <h1>Ballet Academy</h1>
          <p>Discover the art</p>
        </header>
        <Navigation />
        <div className="content">
          <h2>Loading...</h2>
          {error && (
            <div style={{ color: "red", marginTop: "20px" }}>
              <h3>Error:</h3>
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Home page
  if (currentPage === "home") {
    return (
      <div>
        <header className="header">
          <h1>Ballet Academy</h1>
          <p>Discover the art</p>
        </header>
        <Navigation />
        <div className="content">
          <div className="grid">
            <div className="card" onClick={() => changePage("ballets")}>
              <h3>Classical Ballets</h3>
              <p>Explore the world's most famous ballets.</p>
            </div>
            <div className="card" onClick={() => changePage("steps")}>
              <h3>Ballet Steps</h3>
              <p>Learn fundamental ballet techniques and movements.</p>
            </div>
            <div className="card" onClick={() => changePage("equipment")}>
              <h3>Ballet Equipment</h3>
              <p>Essential gear and accessories.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // About page
  if (currentPage === "about") {
    return (
      <div>
        <header className="header">
          <h1>Ballet Academy</h1>
          <p>Discover the art</p>
        </header>
        <Navigation />
        <div className="content">
          <div className="back-button" onClick={goBackToHome}>
            ← Back to Home
          </div>
          <h2 className="section-title">About Ballet Academy</h2>
          <div className="card">
            <h3>Our Mission</h3>
            <p>
              Ballet Academy is dedicated to preserving and sharing the rich
              heritage of classical ballet. We provide comprehensive resources
              for dancers, students, and enthusiasts to explore the world of
              ballet through detailed information about classical ballets,
              fundamental steps, and essential equipment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Contact page
  if (currentPage === "contact") {
    return (
      <div>
        <header className="header">
          <h1>Ballet Academy</h1>
          <p>Discover the art</p>
        </header>
        <Navigation />
        <div className="content">
          <div className="back-button" onClick={goBackToHome}>
            ← Back to Home
          </div>
          <h2 className="section-title">Contact Us</h2>
          <div className="card">
            <h3>Get in Touch</h3>
            <p>
              We'd love to hear from you! Whether you have questions about
              ballet techniques, suggestions for new content, or just want to
              share your passion for dance, please don't hesitate to reach out.
            </p>

            <h3>Contact Information</h3>
            <p>
              <strong>Email:</strong> info@balletacademy.com
            </p>
            <p>
              <strong>Phone:</strong> (555) 123-4567
            </p>
            <p>
              <strong>Address:</strong> 123 Dance Street, Ballet City, BC 12345
            </p>

            <h3>Office Hours</h3>
            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p>Saturday: 10:00 AM - 4:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </div>
    );
  }

  // Submission pages
  if (currentPage === "submit-ballet") {
    return (
      <div>
        <header className="header">
          <h1>Ballet Academy</h1>
          <p>Discover the art</p>
        </header>
        <Navigation />
        <SubmissionForm
          type="ballet"
          onSubmit={handleSubmitBallet}
          onCancel={() => changePage("ballets")}
        />
      </div>
    );
  }

  if (currentPage === "submit-step") {
    return (
      <div>
        <header className="header">
          <h1>Ballet Academy</h1>
          <p>Discover the art</p>
        </header>
        <Navigation />
        <SubmissionForm
          type="step"
          onSubmit={handleSubmitStep}
          onCancel={() => changePage("steps")}
        />
      </div>
    );
  }

  if (currentPage === "submit-equipment") {
    return (
      <div>
        <header className="header">
          <h1>Ballet Academy</h1>
          <p>Discover the art</p>
        </header>
        <Navigation />
        <SubmissionForm
          type="equipment"
          onSubmit={handleSubmitEquipment}
          onCancel={() => changePage("equipment")}
        />
      </div>
    );
  }

  // Ballets page
  if (currentPage === "ballets") {
    return (
      <div>
        <header className="header">
          <h1>Ballet Academy</h1>
          <p>Discover the art</p>
        </header>
        <Navigation />
        <div className="content">
          <div className="back-button" onClick={goBackToHome}>
            ← Back to Home
          </div>
          <h2 className="section-title">Classical Ballets with Steps</h2>
          {user && (
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <button
                onClick={() => changePage("submit-ballet")}
                style={{
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "0.8rem 1.5rem",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "500",
                  transition: "background-color 0.3s"
                }}>
                + Submit New Ballet
              </button>
            </div>
          )}
          <div className="grid">
            {ballets.map((ballet) => (
              <div key={ballet.id} className="card">
                <h3>{ballet.title}</h3>
                <p>
                  <strong>Composer:</strong> {ballet.composer}
                </p>
                <p>
                  <strong>Choreographer:</strong> {ballet.choreographer}
                </p>
                <p>
                  <strong>Year:</strong> {ballet.year_premiered}
                </p>
                <p>
                  <strong>Difficulty:</strong> {ballet.difficulty_level}
                </p>
                <p>
                  <strong>Duration:</strong> {ballet.duration_minutes} minutes
                </p>
                <p>
                  <strong>Description:</strong> {ballet.description}
                </p>

                {ballet.steps && ballet.steps.length > 0 && (
                  <div className="related-data">
                    <h4>Steps in this Ballet:</h4>
                    <ul>
                      {ballet.steps.map((step, index) => (
                        <li key={index}>
                          <strong>{step.name}</strong> (Order:{" "}
                          {step.sequence_order})
                          <br />
                          <small>
                            {step.description} - Difficulty: {step.difficulty}
                          </small>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {user && user.is_admin && (
                  <AdminControls
                    item={ballet}
                    itemType="ballet"
                    onDelete={handleDeleteBallet}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Steps page
  if (currentPage === "steps") {
    return (
      <div>
        <header className="header">
          <h1>Ballet Academy</h1>
          <p>Discover the art</p>
        </header>
        <Navigation />
        <div className="content">
          <div className="back-button" onClick={goBackToHome}>
            ← Back to Home
          </div>
          <h2 className="section-title">Ballet Steps with Equipment</h2>
          {user && (
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <button
                onClick={() => changePage("submit-step")}
                style={{
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "0.8rem 1.5rem",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "500",
                  transition: "background-color 0.3s"
                }}>
                + Submit New Step
              </button>
            </div>
          )}
          <div className="grid">
            {steps.map((step) => (
              <div key={step.id} className="card">
                <h3>{step.name}</h3>
                <p>
                  <strong>Description:</strong> {step.description}
                </p>
                <p>
                  <strong>Difficulty:</strong> {step.difficulty}
                </p>

                {step.equipment && step.equipment.length > 0 && (
                  <div className="related-data">
                    <h4>Equipment for this Step:</h4>
                    <ul>
                      {step.equipment.map((item, index) => (
                        <li key={index}>
                          <strong>{item.name}</strong>
                          {item.required ? " (Required)" : " (Optional)"}
                          <br />
                          <small>
                            {item.description} - Category: {item.category}
                          </small>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {user && user.is_admin && (
                  <AdminControls
                    item={step}
                    itemType="step"
                    onDelete={handleDeleteStep}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Equipment page
  if (currentPage === "equipment") {
    return (
      <div>
        <header className="header">
          <h1>Ballet Academy</h1>
          <p>Discover the art</p>
        </header>
        <Navigation />
        <div className="content">
          <div className="back-button" onClick={goBackToHome}>
            ← Back to Home
          </div>
          <h2 className="section-title">Ballet Equipment</h2>
          {user && (
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <button
                onClick={() => changePage("submit-equipment")}
                style={{
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "0.8rem 1.5rem",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "500",
                  transition: "background-color 0.3s"
                }}>
                + Submit New Equipment
              </button>
            </div>
          )}
          <div className="grid">
            {equipment.map((item) => (
              <div key={item.id} className="card">
                <h3>{item.name}</h3>
                <p>
                  <strong>Description:</strong> {item.description}
                </p>
                <p>
                  <strong>Category:</strong> {item.category}
                </p>

                {user && user.is_admin && (
                  <AdminControls
                    item={item}
                    itemType="equipment"
                    onDelete={handleDeleteEquipment}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default return (shouldn't happen)
  return (
    <div>
      <header className="header">
        <h1>Ballet Academy</h1>
        <p>Discover the art</p>
      </header>
      <Navigation />
      <div className="content">
        <h2>Something went wrong</h2>
        <button onClick={goBackToHome}>Go back to home</button>
      </div>
    </div>
  );
}

export default App;
