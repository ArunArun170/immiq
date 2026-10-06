import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./LearnerAuth.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://immiq.onrender.com/api/v1";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: Parameters<
      NonNullable<
        React.ComponentProps<"form">["onSubmit"]
      >
    >[0]
  ) => {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to create your account"
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

  return (
    <main className="learner-auth-page">
      <div className="learner-auth-shell">
        <section className="learner-auth-brand">
          <div className="learner-brand-mark">
            I
          </div>

          <span className="learner-brand-label">
            IMMIQ LEARNING
          </span>

          <h1>
            Start your
            <br />
            learning journey.
          </h1>

          <p>
            Create your learner account and get ready
            to explore industry-focused courses,
            batches and future-ready skills.
          </p>

          <div className="learner-brand-points">
            <span>✓ Learn at your pace</span>
            <span>✓ Industry-ready skills</span>
            <span>✓ Track your progress</span>
          </div>
        </section>

        <section className="learner-auth-card">
          <div className="learner-auth-header">
            <span className="learner-eyebrow">
              CREATE ACCOUNT
            </span>

            <h2>Join IMMIQ Learning</h2>

            <p>
              Create your learner account in a few
              simple steps.
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
              Full name

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Your full name"
                autoComplete="name"
                required
              />
            </label>

            <label>
              Email address

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
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
                  setPassword(event.target.value)
                }
                placeholder="Minimum 6 characters"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </label>

            <label>
              Confirm password

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                placeholder="Re-enter your password"
                autoComplete="new-password"
                required
              />
            </label>

            <button
              type="submit"
              className="learner-primary-button"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create learner account"}
            </button>
          </form>

          <div className="learner-auth-footer">
            <span>Already have an account?</span>

            <Link to="/login">
              Sign in
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