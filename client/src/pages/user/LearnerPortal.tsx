import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./LearnerPortal.css";

interface LearnerUser {
id: string;
name: string;
email: string;
role: string;
}

interface Course {
_id: string;
title: string;
slug?: string;
technology?: string;
level?: string;
mode?: string;
duration?: string;
fee?: number;
}

interface Batch {
_id: string;
name: string;
startDate: string;
endDate?: string;
schedule?: string;
mode?: string;
venue?: string;
link?: string;
seatsTotal?: number;
seatsFilled?: number;
priceOverride?: number;
earlyBirdTill?: string;
status?: string;
}

interface Enrollment {
_id: string;
course?: Course;
batch?: Batch;
amount?: number;
status?: string;
paymentStatus?: string;
paymentId?: string;
enrolledAt?: string;
createdAt?: string;
}

const API_URL =
import.meta.env.VITE_API_URL ||
"http://localhost:5000/api/v1";

export default function LearnerPortal() {
const navigate = useNavigate();

const [user] = useState<LearnerUser | null>(() => {
try {
const raw = localStorage.getItem("immiq_learner_user");
return raw ? JSON.parse(raw) : null;
} catch {
return null;
}
});

const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
const [loadingEnrollments, setLoadingEnrollments] = useState(true);
const [enrollmentError, setEnrollmentError] = useState("");

const token = localStorage.getItem("immiq_learner_token");

useEffect(() => {
const loadEnrollments = async () => {
if (!token) {
setLoadingEnrollments(false);
navigate("/login", { replace: true });
return;
}

  try {
    setLoadingEnrollments(true);
    setEnrollmentError("");

    const response = await fetch(
      `${API_URL}/enrollments/my`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("immiq_learner_token");
        localStorage.removeItem("immiq_learner_user");

        navigate("/login", {
          replace: true,
        });

        return;
      }

      throw new Error(
        data.message || "Failed to load enrollments"
      );
    }

    setEnrollments(data.enrollments || []);
  } catch (error) {
    console.error("Learner portal enrollment error:", error);

    setEnrollmentError(
      error instanceof Error
        ? error.message
        : "Failed to load your enrollments."
    );
  } finally {
    setLoadingEnrollments(false);
  }
};

loadEnrollments();

}, [navigate, token]);

const handleLogout = () => {
localStorage.removeItem("immiq_learner_token");
localStorage.removeItem("immiq_learner_user");

navigate("/login", {
  replace: true,
});


};

const firstName =
user?.name?.split(" ")[0] || "Learner";

const activeEnrollments = useMemo(
() =>
enrollments.filter(
(enrollment) =>
enrollment.status === "active" &&
enrollment.paymentStatus === "paid"
),
[enrollments]
);

const upcomingBatchCount = useMemo(
() =>
enrollments.filter(
(enrollment) =>
enrollment.batch?.status === "upcoming" ||
enrollment.batch?.status === "running"
).length,
[enrollments]
);

const formatDate = (value?: string) => {
if (!value) {
return "-";
}

const date = new Date(value);

if (Number.isNaN(date.getTime())) {
  return "-";
}

return date.toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

};

const formatAmount = (amount?: number) => {
if (amount === undefined || amount === null) {
return "₹0";
}

return `₹${amount.toLocaleString("en-IN")}`;

};

const getPaymentLabel = (paymentStatus?: string) => {
switch (paymentStatus) {
case "paid":
return "Payment Paid";

  case "failed":
    return "Payment Failed";

  case "refunded":
    return "Refunded";

  default:
    return "Payment Pending";
}

};

const getPaymentClass = (paymentStatus?: string) => {
switch (paymentStatus) {
case "paid":
return "paid";

  case "failed":
  case "refunded":
    return "failed";

  default:
    return "pending";
}

};

const getEnrollmentLabel = (status?: string) => {
switch (status) {
case "active":
return "Active";

  case "completed":
    return "Completed";

  case "cancelled":
    return "Cancelled";

  case "paid":
    return "Paid";

  default:
    return "Pending";
}

};

const getEnrollmentClass = (status?: string) => {
switch (status) {
case "active":
case "completed":
return "active";

  case "cancelled":
    return "cancelled";

  default:
    return "pending";
}

};

return ( <main className="learner-portal"> <header className="learner-portal-header"> <div className="learner-portal-logo"> <span className="learner-portal-logo-mark">
I </span>

      <div>
        <strong>IMMIQ</strong>
        <small>LEARNING</small>
      </div>
    </div>

    <div className="learner-portal-header-actions">
      <button
        type="button"
        className="learner-store-button"
        onClick={() => navigate("/training")}
      >
        Explore courses
      </button>

      <button
        type="button"
        className="learner-logout-button"
        onClick={() => navigate("/portal/events")}
      >
        Events
      </button>

      <button
        type="button"
        className="learner-logout-button"
        onClick={() => navigate("/portal/resources")}
      >
        Resources
      </button>

      <button
        type="button"
        className="learner-logout-button"
        onClick={handleLogout}
      >
        Sign out
      </button>
    </div>
  </header>

  <div className="learner-portal-container">
    <section className="learner-welcome">
      <div>
        <span className="learner-section-label">
          LEARNER DASHBOARD
        </span>

        <h1>
          Welcome, {firstName}.
        </h1>

        <p>
          Your learning journey starts here.
          Track your enrolled programs, batch
          details and payment information from
          your learner dashboard.
        </p>
      </div>

      <div className="learner-welcome-badge">
        <span>●</span>
        Account active
      </div>
    </section>

    <section className="learner-stat-grid">
      <article className="learner-stat-card">
        <span className="learner-stat-icon">
          ◈
        </span>

        <div>
          <strong>
            {loadingEnrollments
              ? "..."
              : enrollments.length}
          </strong>

          <span>Enrolled courses</span>
        </div>
      </article>

      <article className="learner-stat-card">
        <span className="learner-stat-icon">
          ✓
        </span>

        <div>
          <strong>
            {loadingEnrollments
              ? "..."
              : activeEnrollments.length}
          </strong>

          <span>Active courses</span>
        </div>
      </article>

      <article className="learner-stat-card">
        <span className="learner-stat-icon">
          ◇
        </span>

        <div>
          <strong>0</strong>

          <span>Certificates</span>
        </div>
      </article>

      <article className="learner-stat-card">
        <span className="learner-stat-icon">
          ◎
        </span>

        <div>
          <strong>
            {loadingEnrollments
              ? "..."
              : upcomingBatchCount}
          </strong>

          <span>Upcoming batches</span>
        </div>
      </article>
    </section>

    {enrollmentError && (
      <section className="learner-error">
        {enrollmentError}
      </section>
    )}

    <section className="learner-main-grid">
      <article
        className={`learner-empty-card ${
          enrollments.length > 0
            ? "learner-enrollment-card"
            : ""
        }`}
      >
        {loadingEnrollments ? (
          <>
            <div className="learner-empty-icon">
              ◈
            </div>

            <span className="learner-section-label">
              MY LEARNING
            </span>

            <h2>
              Loading your courses...
            </h2>

            <p>
              Please wait while we load your
              learning information.
            </p>
          </>
        ) : enrollments.length === 0 ? (
          <>
            <div className="learner-empty-icon">
              ◈
            </div>

            <span className="learner-section-label">
              MY LEARNING
            </span>

            <h2>
              Your courses will appear here
            </h2>

            <p>
              Once you enroll in an IMMIQ
              course, your learning content,
              progress and upcoming sessions
              will appear in this space.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/training")
              }
              className="learner-dark-button"
            >
              Explore courses →
            </button>
          </>
        ) : (
          <>
            <div className="learner-learning-heading">
              <div>
                <span className="learner-section-label">
                  MY LEARNING
                </span>

                <h2>
                  Your enrolled courses
                </h2>
              </div>

              <button
                type="button"
                className="learner-outline-button"
                onClick={() =>
                  navigate("/training")
                }
              >
                Browse courses
              </button>
            </div>

            <p>
              Your active programs, batch
              schedule and enrollment details
              are shown below.
            </p>

            <div className="learner-enrollment-list">
              {enrollments.map(
                (enrollment) => {
                  const course =
                    enrollment.course;

                  const batch =
                    enrollment.batch;

                  const seatsLeft = Math.max(
                    (batch?.seatsTotal ?? 0) -
                      (batch?.seatsFilled ?? 0),
                    0
                  );

                  return (
                    <div
                      key={enrollment._id}
                      className="learner-course-card"
                    >
                      <div className="learner-course-top">
                        <div>
                          <span className="learner-course-label">
                            ENROLLED COURSE
                          </span>

                          <h3>
                            {course?.title ||
                              "Course"}
                          </h3>

                          {course?.technology && (
                            <p className="learner-course-tech">
                              {course.technology}
                              {course.level
                                ? ` • ${course.level}`
                                : ""}
                            </p>
                          )}
                        </div>

                        <div className="learner-status-group">
                          <span
                            className={`learner-status-pill ${getEnrollmentClass(
                              enrollment.status
                            )}`}
                          >
                            {getEnrollmentLabel(
                              enrollment.status
                            )}
                          </span>

                          <span
                            className={`learner-status-pill ${getPaymentClass(
                              enrollment.paymentStatus
                            )}`}
                          >
                            {getPaymentLabel(
                              enrollment.paymentStatus
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="learner-course-details">
                        <div>
                          <span>
                            BATCH
                          </span>

                          <strong>
                            {batch?.name ||
                              "Batch"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            START DATE
                          </span>

                          <strong>
                            {formatDate(
                              batch?.startDate
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>
                            END DATE
                          </span>

                          <strong>
                            {formatDate(
                              batch?.endDate
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>
                            SCHEDULE
                          </span>

                          <strong>
                            {batch?.schedule ||
                              "-"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            MODE
                          </span>

                          <strong>
                            {batch?.mode ||
                              "Online"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            AMOUNT
                          </span>

                          <strong>
                            {formatAmount(
                              enrollment.amount
                            )}
                          </strong>
                        </div>
                      </div>

                      <div className="learner-course-footer">
                        <div>
                          <span>
                            VENUE
                          </span>

                          <strong>
                            {batch?.venue ||
                              "Online Training"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            SEATS AVAILABLE
                          </span>

                          <strong>
                            {seatsLeft}
                          </strong>
                        </div>

                        <div>
                          <span>
                            ENROLLED ON
                          </span>

                          <strong>
                            {formatDate(
                              enrollment.enrolledAt ||
                                enrollment.createdAt
                            )}
                          </strong>
                        </div>
                      </div>

                      {batch?.status ===
                        "upcoming" && (
                        <div className="learner-upcoming-message">
                          <span>●</span>

                          Your batch is
                          upcoming. Get ready
                          for your learning
                          journey.
                        </div>
                      )}

                      {batch?.status ===
                        "running" && (
                        <div className="learner-running-message">
                          <span>●</span>

                          Your batch is
                          currently running.
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}
      </article>

      <aside className="learner-profile-card">
        <div className="learner-profile-avatar">
          {firstName
            .charAt(0)
            .toUpperCase()}
        </div>

        <span className="learner-section-label">
          YOUR PROFILE
        </span>

        <h2>
          {user?.name || "Learner"}
        </h2>

        <p>
          {user?.email || ""}
        </p>

        <div className="learner-profile-divider" />

        <div className="learner-profile-row">
          <span>Account type</span>

          <strong>Learner</strong>
        </div>

        <div className="learner-profile-row">
          <span>Status</span>

          <strong className="active">
            Active
          </strong>
        </div>

        <div className="learner-profile-row">
          <span>Active courses</span>

          <strong>
            {loadingEnrollments
              ? "..."
              : activeEnrollments.length}
          </strong>
        </div>
      </aside>
    </section>

    <section className="mt-10 px-5 sm:px-0">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 p-5 text-white shadow-2xl shadow-cyan-950/10 sm:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400">
              FINANCIALS
            </span>
            <h2 className="mt-2 text-xl font-semibold">
              <button type="button" onClick={() => navigate("/portal/profile")} className="mt-3 inline-flex min-h-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-xs font-bold text-slate-200 transition hover:bg-white/10">Manage my profile →</button>

            Payments & certificates
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Access your payment history, invoices and learning certificates from one place.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate("/portal/invoices")}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-cyan-400/[0.05]"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Billing
            </span>
            <strong className="mt-2 block text-base text-slate-100">
              Invoices & Payment History
            </strong>
            <span className="mt-2 block text-sm text-slate-500 transition group-hover:text-slate-400">
              View invoices, transaction references and print-ready billing records →
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/portal/certificates")}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-cyan-400/[0.05]"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Achievement
            </span>
            <strong className="mt-2 block text-base text-slate-100">
              My Certificates
            </strong>
            <span className="mt-2 block text-sm text-slate-500 transition group-hover:text-slate-400">
              View issued certificates and verify them publicly →
            </span>
          </button>
        </div>
      </div>
    </section>

    <section className="learner-next-section">
      <div>
        <span className="learner-section-label">
          WHAT'S NEXT
        </span>

        <h2>
          Your complete learning experience
        </h2>
      </div>

      <div className="learner-next-grid">
        <div>
          <span>01</span>

          <strong>Enroll</strong>

          <p>
            Choose a course and upcoming batch.
          </p>
        </div>

        <div>
          <span>02</span>

          <strong>Learn</strong>

          <p>
            Follow your structured learning
            journey.
          </p>
        </div>

        <div>
          <span>03</span>

          <strong>Grow</strong>

          <p>
            Track progress and complete
            projects.
          </p>
        </div>

        <div>
          <span>04</span>

          <strong>Certify</strong>

          <p>
            Earn your IMMIQ learning
            certificate.
          </p>
        </div>
      </div>
    </section>
  </div>
</main>

);
}