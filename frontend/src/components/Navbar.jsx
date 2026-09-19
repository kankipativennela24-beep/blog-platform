import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged out successfully!");

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        📝 Blog Platform
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>

        {token ? (
          <>
    <Link to="/create-post">
        Create Post
    </Link>

    <Link to="/profile">
        Profile
    </Link>

    <span className="welcome-user">
        Hi, {user?.name || "User"} 👋
    </span>

    <button
        onClick={handleLogout}
        className="logout-btn"
    >
        Logout
    </button>
    </>
            ) : (
            <>
                <Link to="/login">Login</Link>

                <Link to="/register">
                Register
                </Link>
            </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;