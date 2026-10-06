import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/user/Home";
import About from "./pages/user/About";
import Training from "./pages/user/Training";
import CourseDetail from "./pages/user/CourseDetail";
import SaaS from "./pages/user/SaaS";
import Technology from "./pages/user/Technology";
import Services from "./pages/user/Services";
import Clients from "./pages/user/Clients";
import Achievements from "./pages/user/Achievements";
import Blog from "./pages/user/Blog";
import BlogDetail from "./pages/user/BlogDetail";
import Contact from "./pages/user/Contact";

import LearnerLogin from "./pages/user/LearnerLogin";
import Register from "./pages/user/Register";
import LearnerPortal from "./pages/user/LearnerPortal";
import ProtectedLearnerRoute from "./pages/user/ProtectedLearnerRoute";
import LearnerCourse from "./pages/user/LearnerCourse";
import LearnerCertificates from "./pages/user/LearnerCertificates";
import LearnerCertificate from "./pages/user/LearnerCertificate";
import LearnerInvoices from "./pages/user/LearnerInvoices";
import LearnerInvoiceDetail from "./pages/user/LearnerInvoiceDetail";
import LearnerProfile from "./pages/user/LearnerProfile";
import LearnerEvents from "./pages/user/LearnerEvents";
import LearnerResources from "./pages/user/LearnerResources";
import InterestFinder from "./pages/user/InterestFinder";
import CorporatePortal from "./pages/user/CorporatePortal";
import CorporateLearning from "./pages/admin/CorporateLearning";
import VerifyCertificate from "./pages/user/VerifyCertificate";
import CorporateLogin from "./pages/user/CorporateLogin";
import ProtectedCorporateRoute from "./pages/user/ProtectedCorporateRoute";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SEO from "./components/SEO";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCertificates from "./pages/admin/AdminCertificates";
import AdminInvoices from "./pages/admin/AdminInvoices";
import ProtectedAdminRoute from "./pages/admin/ProtectedAdminRoute";

import AdminClients from "./pages/admin/Clients";
import AdminAchievements from "./pages/admin/Achievements";
import AdminBlog from "./pages/admin/Blog";
import AdminServices from "./pages/admin/Services";
import AdminLeads from "./pages/admin/Leads";
import AdminTeam from "./pages/admin/Team";
import AdminTestimonials from "./pages/admin/Testimonials";
import AdminSettings from "./pages/admin/Settings";
import AdminMedia from "./pages/admin/Media";
import AdminUsers from "./pages/admin/Users";
import AdminCourses from "./pages/admin/Courses";
import Batches from "./pages/admin/Batches";
import CourseContent from "./pages/admin/CourseContent";

function PublicLayout() {
  return (
    <>
      <SEO />
      <Navbar />

      <Routes>
        {/* =========================
            PUBLIC HOME
        ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* =========================
            PUBLIC PAGES
        ========================= */}

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/training"
          element={<Training />}
        />

        {/* =========================
            COURSE DETAILS
        ========================= */}

        {/* New / preferred course URL */}
        <Route
          path="/training/programs/:slug"
          element={<CourseDetail />}
        />

        {/* Existing URL kept for compatibility */}
        <Route
          path="/training/:slug"
          element={<CourseDetail />}
        />

        <Route
          path="/saas"
          element={<SaaS />}
        />

        <Route
          path="/technology"
          element={<Technology />}
        />

        <Route
          path="/services"
          element={<Services />}
        />

        <Route
          path="/clients"
          element={<Clients />}
        />

        <Route
          path="/achievements"
          element={<Achievements />}
        />

        <Route
          path="/blog"
          element={<Blog />}
        />

        <Route
          path="/blog/:slug"
          element={<BlogDetail />}
        />

        <Route
          path="/interest-finder"
          element={<InterestFinder />}
        />

        <Route
          path="/verify/:certificateId"
          element={<VerifyCertificate />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />
      </Routes>

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            LEARNER AUTHENTICATION
        ========================= */}

        <Route
          path="/login"
          element={<LearnerLogin />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/corporate/login"
          element={<CorporateLogin />}
        />

        {/* =========================
            LEARNER PORTAL
        ========================= */}

        <Route
          element={<ProtectedLearnerRoute />}
        >
          <Route
            path="/portal"
            element={<LearnerPortal />}
          />
          <Route
            path="/portal/learn/:enrollmentId"
            element={<LearnerCourse />}
          />
          <Route
            path="/portal/certificates"
            element={<LearnerCertificates />}
          />
          <Route
            path="/portal/certificates/:certificateNumber"
            element={<LearnerCertificate />}
          />
          <Route
            path="/portal/invoices"
            element={<LearnerInvoices />}
          />
          <Route
            path="/portal/invoices/:invoiceId"
            element={<LearnerInvoiceDetail />}
          />
          <Route
            path="/portal/profile"
            element={<LearnerProfile />}
          />
          <Route
            path="/portal/events"
            element={<LearnerEvents />}
          />
          <Route
            path="/portal/resources"
            element={<LearnerResources />}
          />
        </Route>

        <Route element={<ProtectedCorporateRoute />}>
          <Route
            path="/corporate"
            element={<CorporatePortal />}
          />
        </Route>

        {/* =========================
            ADMIN AUTHENTICATION
        ========================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* =========================
            ADMIN PROTECTED ROUTES
        ========================= */}

        <Route
          element={<ProtectedAdminRoute />}
        >
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/clients"
            element={<AdminClients />}
          />

          <Route
            path="/admin/achievements"
            element={<AdminAchievements />}
          />

          <Route
            path="/admin/blog"
            element={<AdminBlog />}
          />

          <Route
            path="/admin/services"
            element={<AdminServices />}
          />

          <Route
            path="/admin/courses"
            element={<AdminCourses />}
          />

          <Route
            path="/admin/certificates"
            element={<AdminCertificates />}
          />
          <Route
            path="/admin/invoices"
            element={<AdminInvoices />}
          />

          <Route
            path="/admin/corporate"
            element={<CorporateLearning />}
          />

          <Route
            path="/admin/leads"
            element={<AdminLeads />}
          />

          <Route
            path="/admin/team"
            element={<AdminTeam />}
          />

          <Route
            path="/admin/testimonials"
            element={<AdminTestimonials />}
          />

          <Route
            path="/admin/settings"
            element={<AdminSettings />}
          />

          <Route
            path="/admin/media"
            element={<AdminMedia />}
          />

          <Route
            path="/admin/users"
            element={<AdminUsers />}
          />

          <Route
            path="/admin/batches"
            element={<Batches />}
          />
          <Route
            path="/admin/course-content/:courseId"
            element={<CourseContent />}
          />
        </Route>

        {/* =========================
            PUBLIC WEBSITE
        ========================= */}

        <Route
          path="/*"
          element={<PublicLayout />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;