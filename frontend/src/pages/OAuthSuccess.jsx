import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const redirect = params.get("redirect");

    if (token) {
      localStorage.setItem("token", token);

      // 🔥 AUTO REDIRECT BASED ON ROLE
      if (redirect) {
        navigate(redirect);
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Logging you in...</p>
    </div>
  );
}

export default OAuthSuccess;