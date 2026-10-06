import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedLearnerRoute() {
  const token = localStorage.getItem(
    "immiq_learner_token"
  );

  const userRaw = localStorage.getItem(
    "immiq_learner_user"
  );

  if (!token || !userRaw) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  try {
    const user = JSON.parse(userRaw);

    if (user?.role !== "learner") {
      localStorage.removeItem(
        "immiq_learner_token"
      );

      localStorage.removeItem(
        "immiq_learner_user"
      );

      return (
        <Navigate
          to="/login"
          replace
        />
      );
    }
  } catch {
    localStorage.removeItem(
      "immiq_learner_token"
    );

    localStorage.removeItem(
      "immiq_learner_user"
    );

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
}