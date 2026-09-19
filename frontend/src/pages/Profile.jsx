import { Link } from "react-router-dom";

function Profile() {
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  if (!user) {
    return (
      <div className="form-container">
        <h1>👤 Profile</h1>

        <p>Please login to view your profile.</p>

        <Link to="/login" className="read-btn">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-icon">
          👤
        </div>

        <h1>My Profile</h1>

        <div className="profile-info">
          <div>
            <strong>Name</strong>
            <p>{user.name}</p>
          </div>

          <div>
            <strong>Email</strong>
            <p>{user.email}</p>
          </div>
        </div>

        <Link to="/" className="read-btn">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Profile;