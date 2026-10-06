import { useState } from "react";
import {
Link,
useLocation,
useNavigate,
} from "react-router-dom";

import "./LearnerAuth.css";

const API_URL =
import.meta.env.VITE_API_URL ||
"http://localhost:5000/api/v1";

export default function LearnerLogin() {
const navigate = useNavigate();
const location = useLocation();

const [email, setEmail] = useState("");
const [password, setPassword] =
useState("");

const [loading, setLoading] =
useState(false);

const [error, setError] =
useState("");

const handleSubmit = async (
event: React.FormEvent<HTMLFormElement>
) => {
event.preventDefault();

setError("");
setLoading(true);

try {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "Unable to login"
    );
  }

  if (
    data.user?.role !==
    "learner"
  ) {
    throw new Error(
      "This login is for learner accounts only."
    );
  }

  if (!data.token) {
    throw new Error(
      "Login successful, but authentication token was not received."
    );
  }

  localStorage.setItem(
    "immiq_learner_token",
    data.token
  );

  localStorage.setItem(
    "immiq_learner_user",
    JSON.stringify(data.user)
  );

  /*
   * If the learner came from a course
   * enrollment flow, return to that course.
   */
  const params =
    new URLSearchParams(
      location.search
    );

  const redirect =
    params.get("redirect");

  if (
    redirect &&
    redirect.startsWith("/")
  ) {
    navigate(
      decodeURIComponent(
        redirect
      ),
      {
        replace: true,
      }
    );

    return;
  }

  navigate("/portal", {
    replace: true,
  });
} catch (err: unknown) {
  setError(
    err instanceof Error
      ? err.message
      : "Something went wrong. Please try again."
  );
} finally {
  setLoading(false);
}

};

return ( <main className="learner-auth-page"> <div className="learner-auth-shell"> <section className="learner-auth-brand"> <div className="learner-brand-mark">
I </div>

```
      <span className="learner-brand-label">
        IMMIQ LEARNING
      </span>

      <h1>
        Build skills.
        <br />
        Build your future.
      </h1>

      <p>
        Access your courses, upcoming
        batches, learning progress and
        certificates from one
        professional learning space.
      </p>

      <div className="learner-brand-points">
        <span>
          ✓ Structured learning
        </span>

        <span>
          ✓ Industry-focused courses
        </span>

        <span>
          ✓ Progress & certificates
        </span>
      </div>
    </section>

    <section className="learner-auth-card">
      <div className="learner-auth-header">
        <span className="learner-eyebrow">
          LEARNER PORTAL
        </span>

        <h2>
          Welcome back
        </h2>

        <p>
          Sign in to continue your
          learning journey.
        </p>
      </div>

      <form
        className="learner-auth-form"
        onSubmit={handleSubmit}
      >
        {error && (
          <div className="learner-auth-error">
            {error}
          </div>
        )}

        <label>
          Email address

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>

        <label>
          Password

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
        </label>

        <button
          type="submit"
          className="learner-primary-button"
          disabled={loading}
        >
          {loading
            ? "Signing in..."
            : "Sign in"}
        </button>
      </form>

      <div className="learner-auth-footer">
        <span>
          New to IMMIQ?
        </span>

        <Link to="/register">
          Create learner account
        </Link>
      </div>

      <Link
        to="/"
        className="learner-back-link"
      >
        ← Back to IMMIQ
      </Link>
    </section>
  </div>
</main>

);
}