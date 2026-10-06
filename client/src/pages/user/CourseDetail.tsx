import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Code2,
  Laptop,
  MapPin,
  Sparkles,
  Users2,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

type Course = {
  _id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  technology: string;
  audience: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  mode: "Online" | "Offline" | "Hybrid";
  duration: string;
  fee: number;
  thumbnail: string;
  featured: boolean;
};

type Batch = {
  _id: string;
  course:
    | string
    | {
        _id: string;
        title?: string;
        slug?: string;
      };
  name: string;
  startDate: string;
  endDate?: string;
  schedule: string;
  mode: "Online" | "Offline" | "Hybrid";
  venue?: string;
  link?: string;
  seatsTotal: number;
  seatsFilled: number;
  priceOverride: number;
  earlyBirdTill?: string;
  status: "upcoming" | "running" | "completed" | "cancelled";
};

type Enrollment = {
  _id: string;
  course:
    | string
    | {
        _id: string;
        title?: string;
        slug?: string;
      };
  batch:
    | string
    | {
        _id: string;
        name?: string;
      };
  amount: number;
  status: "pending" | "paid" | "active" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentId?: string;
};

type FAQ = {
  question: string;
  answer: string;
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const loadRazorpayScript = () => {
      if (document.getElementById("razorpay-checkout-script")) {
        return Promise.resolve(true);
      }

      return new Promise<boolean>((resolve) => {
        const script = document.createElement("script");

        script.id = "razorpay-checkout-script";
        script.src =
          "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);

        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const [coursesResponse, batchesResponse] =
          await Promise.all([
            fetch(`${API_URL}/public/courses`),
            fetch(`${API_URL}/public/batches`),
          ]);

        if (!coursesResponse.ok) {
          throw new Error("Unable to load courses");
        }

        const coursesData = await coursesResponse.json();

        let courses: Course[] = [];

        if (Array.isArray(coursesData)) {
          courses = coursesData;
        } else if (Array.isArray(coursesData.courses)) {
          courses = coursesData.courses;
        } else if (Array.isArray(coursesData.data)) {
          courses = coursesData.data;
        }

        const foundCourse = courses.find(
          (item) =>
            item.slug.toLowerCase() ===
            slug?.toLowerCase()
        );

        if (!foundCourse) {
          setError("Course not found.");
          return;
        }

        setCourse(foundCourse);

        if (batchesResponse.ok) {
          const batchesData =
            await batchesResponse.json();

          let allBatches: Batch[] = [];

          if (Array.isArray(batchesData)) {
            allBatches = batchesData;
          } else if (
            Array.isArray(batchesData.batches)
          ) {
            allBatches = batchesData.batches;
          } else if (
            Array.isArray(batchesData.data)
          ) {
            allBatches = batchesData.data;
          }

          const courseBatches = allBatches.filter(
            (batch) => {
              if (typeof batch.course === "string") {
                return (
                  batch.course === foundCourse._id
                );
              }

              return (
                batch.course?._id ===
                  foundCourse._id ||
                batch.course?.slug === foundCourse.slug
              );
            }
          );

          setBatches(courseBatches);

          if (courseBatches.length > 0) {
            setSelectedBatch(
              courseBatches[0]._id
            );
          }
        }
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load course details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [slug]);

  const selectedBatchData = useMemo(
    () =>
      batches.find(
        (batch) => batch._id === selectedBatch
      ),
    [batches, selectedBatch]
  );

  const getSeatsLeft = (batch: Batch) =>
    Math.max(
      batch.seatsTotal - batch.seatsFilled,
      0
    );

  const getBatchPrice = (batch: Batch) =>
    batch.priceOverride > 0
      ? batch.priceOverride
      : course?.fee || 0;

  const formatDate = (date?: string) => {
    if (!date) return "TBA";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getLearningOutcomes = () => {
    const technology =
      course?.technology ||
      "the selected technology";

    return [
      `Understand the core concepts of ${technology}`,
      `Build practical applications using ${technology}`,
      "Work with real-world development practices",
      "Understand how to solve practical project requirements",
      "Create a project that can be added to your portfolio",
      "Gain confidence to continue learning and building independently",
    ];
  };

  const getProjects = () => {
    const technology =
      course?.technology || "technology";

    return [
      {
        title: `${technology} Practical Project`,
        description:
          "Build a practical application by applying the concepts learned throughout the program.",
      },
      {
        title: "Real-World Mini Project",
        description:
          "Work on a smaller project focused on solving a realistic business or user problem.",
      },
      {
        title: "Portfolio Project",
        description:
          "Create a project that demonstrates your skills and can be presented in your portfolio.",
      },
    ];
  };

  const getTools = () => {
    const technology = course?.technology || "";

    const tools = [
      technology,
      "VS Code",
      "Git & GitHub",
      "Browser Developer Tools",
    ];

    return [
      ...new Set(
        tools.filter(Boolean)
      ),
    ];
  };

  const faqs: FAQ[] = [
    {
      question:
        "Who can join this program?",
      answer:
        course?.audience ||
        "Students, beginners, working professionals and anyone interested in learning the technology can join, depending on the program level.",
    },
    {
      question:
        "What level is this program suitable for?",
      answer: `This program is designed for ${
        course?.level || "Beginner"
      } level learners. The exact pace depends on the selected batch and learner background.`,
    },
    {
      question:
        "Is the program online or offline?",
      answer: `This course supports ${
        course?.mode || "Online"
      } learning. Individual batches may have their own delivery mode, so please check the available batches before enrolling.`,
    },
    {
      question:
        "Will I work on projects?",
      answer:
        "Yes. The program is designed around practical learning, with project-oriented activities that help you apply the concepts.",
    },
    {
      question: "How do I enroll?",
      answer:
        "Select an available batch and click Enroll Now. If you are not logged in, you will be taken to the learner login page and then returned to the course.",
    },
  ];

  const getMyEnrollmentForBatch = async (
    token: string,
    batchId: string
  ): Promise<Enrollment | null> => {
    try {
      const response = await fetch(
        `${API_URL}/enrollments/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      const enrollments: Enrollment[] =
        Array.isArray(data)
          ? data
          : Array.isArray(data.enrollments)
          ? data.enrollments
          : Array.isArray(data.data)
          ? data.data
          : [];

      const existingEnrollment =
        enrollments.find((enrollment) => {
          const enrollmentBatchId =
            typeof enrollment.batch === "string"
              ? enrollment.batch
              : enrollment.batch?._id;

          const enrollmentCourseId =
            typeof enrollment.course === "string"
              ? enrollment.course
              : enrollment.course?._id;

          return (
            enrollmentBatchId === batchId &&
            enrollmentCourseId === course?._id
          );
        });

      return existingEnrollment || null;
    } catch {
      return null;
    }
  };

  const startRazorpayPayment = async (
    enrollmentId: string,
    amount: number,
    token: string
  ) => {
    setError("");
    setSuccess("");

    if (!window.Razorpay) {
      throw new Error(
        "Razorpay Checkout could not be loaded. Please refresh the page and try again."
      );
    }

    const orderResponse = await fetch(
      `${API_URL}/payments/create-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          enrollmentId,
        }),
      }
    );

    const orderData =
      await orderResponse.json();

    if (!orderResponse.ok) {
      throw new Error(
        orderData.message ||
          "Unable to create payment order."
      );
    }

    const order = orderData.order;

    if (!order?.id) {
      throw new Error(
        "Invalid Razorpay order received."
      );
    }

    const options = {
      key:
        orderData.keyId ||
        import.meta.env.VITE_RAZORPAY_KEY_ID,

      amount: order.amount,

      currency:
        order.currency || "INR",

      name: "IMMIQ",

      description:
        `${course?.title || "Course"} - ${
          selectedBatchData?.name || "Batch"
        }`,

      order_id: order.id,

      prefill: {
        name:
          localStorage.getItem(
            "immiq_learner_user"
          )
            ? JSON.parse(
                localStorage.getItem(
                  "immiq_learner_user"
                ) || "{}"
              )?.name || ""
            : "",

        email:
          localStorage.getItem(
            "immiq_learner_user"
          )
            ? JSON.parse(
                localStorage.getItem(
                  "immiq_learner_user"
                ) || "{}"
              )?.email || ""
            : "",
      },

      notes: {
        enrollmentId,
      },

      theme: {
        color: "#22d3ee",
      },

      handler: async (paymentResponse: any) => {
        try {
          setEnrolling(true);
          setError("");

          const verifyResponse = await fetch(
            `${API_URL}/payments/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                enrollmentId,
                razorpay_order_id:
                  paymentResponse.razorpay_order_id,
                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,
                razorpay_signature:
                  paymentResponse.razorpay_signature,
              }),
            }
          );

          const verifyData =
            await verifyResponse.json();

          if (!verifyResponse.ok) {
            throw new Error(
              verifyData.message ||
                "Payment verification failed."
            );
          }

          setSuccess(
            `Payment successful! Your enrollment for ${course?.title} is now active.`
          );

          setBatches((current) =>
            current.map((batch) =>
              batch._id ===
              selectedBatchData?._id
                ? {
                    ...batch,
                    seatsFilled:
                      batch.seatsFilled + 1,
                  }
                : batch
            )
          );
        } catch (err) {
          console.error(err);

          setError(
            err instanceof Error
              ? err.message
              : "Payment verification failed."
          );
        } finally {
          setEnrolling(false);
        }
      },

      modal: {
        ondismiss: () => {
          setEnrolling(false);
          setError(
            "Payment was cancelled. You can try again."
          );
        },
      },
    };

    const razorpay =
      new window.Razorpay(options);

    razorpay.on(
      "payment.failed",
      (response: any) => {
        console.error(
          "Razorpay payment failed:",
          response
        );

        setEnrolling(false);

        setError(
          response?.error?.description ||
            "Payment failed. Please try again."
        );
      }
    );

    razorpay.open();

    void amount;
  };

  const handleEnroll = async () => {
    if (!course) return;

    setError("");
    setSuccess("");

    if (!selectedBatchData) {
      setError(
        "Please select a batch before enrolling."
      );
      return;
    }

    if (
      getSeatsLeft(selectedBatchData) <= 0
    ) {
      setError(
        "This batch is currently full. Please select another batch."
      );
      return;
    }

    const token = localStorage.getItem(
      "immiq_learner_token"
    );

    if (!token) {
      localStorage.setItem(
        "immiq_pending_enrollment",
        JSON.stringify({
          courseId: course._id,
          batchId: selectedBatchData._id,
          returnTo: `/training/${course.slug}`,
        })
      );

      navigate(
        `/login?redirect=${encodeURIComponent(
          `/training/${course.slug}`
        )}`
      );

      return;
    }

    try {
      setEnrolling(true);

      /*
       * First check whether this learner already
       * has an enrollment for this batch.
       *
       * This is useful because the backend prevents
       * duplicate enrollments.
       */
      const existingEnrollment =
        await getMyEnrollmentForBatch(
          token,
          selectedBatchData._id
        );

      if (existingEnrollment) {
        if (
          existingEnrollment.paymentStatus ===
          "paid"
        ) {
          setSuccess(
            "You have already completed payment for this batch. Your enrollment is active."
          );

          setEnrolling(false);
          return;
        }

        if (
          existingEnrollment.status ===
          "cancelled"
        ) {
          setError(
            "This enrollment was cancelled. Please contact IMMIQ for assistance."
          );

          setEnrolling(false);
          return;
        }

        /*
         * Existing pending enrollment:
         * directly continue to Razorpay.
         */
        await startRazorpayPayment(
          existingEnrollment._id,
          existingEnrollment.amount,
          token
        );

        return;
      }

      /*
       * Create a new enrollment first.
       */
      const response = await fetch(
        `${API_URL}/enrollments`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            courseId: course._id,
            batchId:
              selectedBatchData._id,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Enrollment failed."
        );
      }

      const enrollment =
        data.enrollment ||
        data.data?.enrollment ||
        data.data;

      if (!enrollment?._id) {
        /*
         * Backend may create the enrollment but
         * return a different response structure.
         * Fetch it again to continue payment.
         */
        const createdEnrollment =
          await getMyEnrollmentForBatch(
            token,
            selectedBatchData._id
          );

        if (!createdEnrollment?._id) {
          throw new Error(
            "Enrollment was created, but the enrollment details could not be retrieved."
          );
        }

        await startRazorpayPayment(
          createdEnrollment._id,
          createdEnrollment.amount,
          token
        );

        return;
      }

      /*
       * Enrollment created successfully.
       * Now immediately open Razorpay.
       */
      await startRazorpayPayment(
        enrollment._id,
        Number(enrollment.amount || 0),
        token
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to continue enrollment."
      );

      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050b12] text-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">
            Loading course...
          </p>
        </div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="min-h-screen bg-[#050b12] text-white flex items-center justify-center px-6">
        <div className="max-w-lg w-full rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <h1 className="text-2xl font-bold mb-3">
            Course Not Found
          </h1>

          <p className="text-gray-400 mb-6">
            {error}
          </p>

          <button
            onClick={() =>
              navigate("/training")
            }
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 transition"
          >
            <ArrowLeft size={17} />
            Back to Training
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  const learningOutcomes =
    getLearningOutcomes();

  const projects = getProjects();
  const tools = getTools();

  return (
    <div className="min-h-screen bg-[#050b12] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.08),transparent_35%)]" />

        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-14">
          <button
            onClick={() =>
              navigate("/training")
            }
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-300 transition mb-8"
          >
            <ArrowLeft size={16} />
            Back to Training
          </button>

          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/5 text-cyan-300 text-xs font-medium mb-5">
                <Sparkles size={14} />
                {course.level} Program
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5">
                {course.title}
              </h1>

              {course.tagline && (
                <p className="text-lg sm:text-xl text-cyan-300 mb-5">
                  {course.tagline}
                </p>
              )}

              <p className="text-gray-400 leading-7 max-w-3xl">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-3 mt-7">
                <div className="px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03]">
                  <div className="text-xs text-gray-500 mb-1">
                    Technology
                  </div>

                  <div className="font-semibold">
                    {course.technology}
                  </div>
                </div>

                <div className="px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03]">
                  <div className="text-xs text-gray-500 mb-1">
                    Duration
                  </div>

                  <div className="font-semibold">
                    {course.duration ||
                      "Flexible"}
                  </div>
                </div>

                <div className="px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03]">
                  <div className="text-xs text-gray-500 mb-1">
                    Mode
                  </div>

                  <div className="font-semibold">
                    {course.mode}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden shadow-2xl">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-[250px] sm:h-[320px] object-cover"
                />
              ) : (
                <div className="w-full h-[250px] sm:h-[320px] flex items-center justify-center bg-gradient-to-br from-cyan-400/10 to-blue-500/10">
                  <Code2
                    size={72}
                    className="text-cyan-300/50"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">
                  Program Fee
                </div>

                <div className="text-3xl font-bold text-cyan-300">
                  {formatCurrency(
                    course.fee
                  )}
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  Final price may vary based
                  on selected batch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Overview */}
        <section className="mb-16">
          <div className="mb-8">
            <p className="text-cyan-300 text-sm font-semibold uppercase tracking-wider mb-2">
              Course Overview
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold">
              Learn by building, not just by
              watching
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <Code2
                className="text-cyan-300 mb-4"
                size={24}
              />

              <h3 className="font-semibold mb-2">
                Technology
              </h3>

              <p className="text-sm text-gray-400">
                {course.technology}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <Users2
                className="text-cyan-300 mb-4"
                size={24}
              />

              <h3 className="font-semibold mb-2">
                Audience
              </h3>

              <p className="text-sm text-gray-400">
                {course.audience ||
                  "Students and learners"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <Laptop
                className="text-cyan-300 mb-4"
                size={24}
              />

              <h3 className="font-semibold mb-2">
                Learning Mode
              </h3>

              <p className="text-sm text-gray-400">
                {course.mode}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <Clock3
                className="text-cyan-300 mb-4"
                size={24}
              />

              <h3 className="font-semibold mb-2">
                Duration
              </h3>

              <p className="text-sm text-gray-400">
                {course.duration ||
                  "Flexible"}
              </p>
            </div>
          </div>
        </section>

        {/* Outcomes */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <p className="text-cyan-300 text-sm font-semibold uppercase tracking-wider mb-2">
                Outcomes
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold mb-5">
                What you’ll learn
              </h2>

              <p className="text-gray-400 leading-7 mb-7">
                The program focuses on practical
                understanding and building real
                applications rather than only
                covering theoretical concepts.
              </p>

              <div className="space-y-4">
                {learningOutcomes.map(
                  (outcome, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 text-gray-300"
                    >
                      <CheckCircle2
                        size={20}
                        className="text-cyan-300 shrink-0 mt-0.5"
                      />

                      <span>
                        {outcome}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.03] p-7 sm:p-8">
              <Sparkles
                className="text-cyan-300 mb-5"
                size={28}
              />

              <h3 className="text-xl font-bold mb-4">
                Outcome-focused learning
              </h3>

              <p className="text-gray-400 leading-7">
                By the end of the program, the
                goal is to help you move from
                understanding concepts to
                actually using them in practical
                development work.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-4">
                {[
                  ["01", "Learn"],
                  ["02", "Practice"],
                  ["03", "Build"],
                  ["04", "Showcase"],
                ].map(
                  ([number, label]) => (
                    <div
                      key={number}
                      className="rounded-xl bg-black/20 border border-white/10 p-4"
                    >
                      <div className="text-2xl font-bold text-cyan-300">
                        {number}
                      </div>

                      <div className="text-sm text-gray-400 mt-1">
                        {label}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="mb-16">
          <div className="mb-8">
            <p className="text-cyan-300 text-sm font-semibold uppercase tracking-wider mb-2">
              Project Showcase
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold">
              What you’ll build
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {projects.map(
              (project, index) => (
                <div
                  key={index}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-cyan-400/30 hover:bg-cyan-400/[0.03] transition"
                >
                  <div className="w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-400/10 flex items-center justify-center mb-5">
                    <Code2
                      size={21}
                      className="text-cyan-300"
                    />
                  </div>

                  <h3 className="font-semibold text-lg mb-3">
                    {project.title}
                  </h3>

                  <p className="text-sm text-gray-400 leading-6">
                    {project.description}
                  </p>
                </div>
              )
            )}
          </div>
        </section>

        {/* Tools */}
        <section className="mb-16">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <p className="text-cyan-300 text-sm font-semibold uppercase tracking-wider mb-2">
                  Tools & Technologies
                </p>

                <h2 className="text-2xl sm:text-3xl font-bold">
                  Tools you’ll work with
                </h2>
              </div>

              <p className="text-sm text-gray-500">
                Tools may vary based on the
                selected program.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {tools.map(
                (tool, index) => (
                  <div
                    key={`${tool}-${index}`}
                    className="px-4 py-3 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.04] text-gray-200"
                  >
                    <span className="text-cyan-300 mr-2">
                      •
                    </span>

                    {tool}
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Batches */}
        <section
          className="mb-16"
          id="batches"
        >
          <div className="mb-8">
            <p className="text-cyan-300 text-sm font-semibold uppercase tracking-wider mb-2">
              Batch Calendar
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold">
              Available batches
            </h2>
          </div>

          {batches.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
              <CalendarDays
                size={34}
                className="mx-auto text-gray-500 mb-4"
              />

              <h3 className="font-semibold text-lg mb-2">
                No batches available right
                now
              </h3>

              <p className="text-gray-500 text-sm">
                New batches will be displayed
                here when they are scheduled.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {batches.map((batch) => {
                const seatsLeft =
                  getSeatsLeft(batch);

                const isSelected =
                  selectedBatch === batch._id;

                const isFull =
                  seatsLeft <= 0;

                return (
                  <button
                    key={batch._id}
                    type="button"
                    disabled={isFull}
                    onClick={() =>
                      setSelectedBatch(
                        batch._id
                      )
                    }
                    className={`w-full text-left rounded-2xl border p-5 sm:p-6 transition ${
                      isSelected
                        ? "border-cyan-400/50 bg-cyan-400/[0.06]"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20"
                    } ${
                      isFull
                        ? "opacity-60 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <h3 className="font-semibold text-lg">
                            {batch.name}
                          </h3>

                          <span className="px-2.5 py-1 rounded-full text-xs border border-cyan-400/20 bg-cyan-400/5 text-cyan-300">
                            {batch.status}
                          </span>

                          {isSelected && (
                            <span className="px-2.5 py-1 rounded-full text-xs border border-green-400/20 bg-green-400/5 text-green-300">
                              Selected
                            </span>
                          )}
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="flex items-start gap-2">
                            <CalendarDays
                              size={17}
                              className="text-cyan-300 mt-0.5"
                            />

                            <div>
                              <div className="text-xs text-gray-500">
                                Start Date
                              </div>

                              <div className="text-sm text-gray-300">
                                {formatDate(
                                  batch.startDate
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Clock3
                              size={17}
                              className="text-cyan-300 mt-0.5"
                            />

                            <div>
                              <div className="text-xs text-gray-500">
                                Schedule
                              </div>

                              <div className="text-sm text-gray-300">
                                {batch.schedule ||
                                  "TBA"}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Laptop
                              size={17}
                              className="text-cyan-300 mt-0.5"
                            />

                            <div>
                              <div className="text-xs text-gray-500">
                                Mode
                              </div>

                              <div className="text-sm text-gray-300">
                                {batch.mode}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Users2
                              size={17}
                              className="text-cyan-300 mt-0.5"
                            />

                            <div>
                              <div className="text-xs text-gray-500">
                                Seats
                              </div>

                              <div
                                className={`text-sm ${
                                  seatsLeft <= 3
                                    ? "text-orange-300"
                                    : "text-green-300"
                                }`}
                              >
                                {isFull
                                  ? "Full"
                                  : `${seatsLeft} seat${
                                      seatsLeft ===
                                      1
                                        ? ""
                                        : "s"
                                    } left`}
                              </div>
                            </div>
                          </div>
                        </div>

                        {batch.venue && (
                          <div className="flex items-center gap-2 text-sm text-gray-400 mt-4">
                            <MapPin
                              size={16}
                              className="text-cyan-300"
                            />

                            {batch.venue}
                          </div>
                        )}
                      </div>

                      <div className="lg:text-right">
                        <div className="text-xs text-gray-500 mb-1">
                          Batch Price
                        </div>

                        <div className="text-2xl font-bold text-cyan-300">
                          {formatCurrency(
                            getBatchPrice(
                              batch
                            )
                          )}
                        </div>

                        {batch.earlyBirdTill && (
                          <div className="text-xs text-green-300 mt-1">
                            Early bird till{" "}
                            {formatDate(
                              batch.earlyBirdTill
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Enrollment */}
        {batches.length > 0 && (
          <section className="mb-16">
            <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/[0.08] to-blue-500/[0.04] p-7 sm:p-9">
              <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
                <div>
                  <p className="text-cyan-300 text-sm font-semibold uppercase tracking-wider mb-2">
                    Ready to Start?
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                    Enroll in {course.title}
                  </h2>

                  {selectedBatchData ? (
                    <p className="text-gray-400 leading-6">
                      You selected{" "}
                      <span className="text-white font-medium">
                        {
                          selectedBatchData.name
                        }
                      </span>{" "}
                      starting on{" "}
                      <span className="text-white font-medium">
                        {formatDate(
                          selectedBatchData.startDate
                        )}
                      </span>
                      .
                    </p>
                  ) : (
                    <p className="text-gray-400">
                      Select a batch above to
                      continue.
                    </p>
                  )}

                  {error && (
                    <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="mt-5 rounded-xl border border-green-400/20 bg-green-400/5 px-4 py-3 text-sm text-green-300">
                      {success}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleEnroll}
                  disabled={
                    enrolling ||
                    !selectedBatchData ||
                    getSeatsLeft(
                      selectedBatchData
                    ) <= 0
                  }
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition whitespace-nowrap"
                >
                  {enrolling
                    ? "Processing..."
                    : "Enroll & Pay"}

                  {!enrolling && (
                    <ArrowRight size={18} />
                  )}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section>
          <div className="mb-8">
            <p className="text-cyan-300 text-sm font-semibold uppercase tracking-wider mb-2">
              FAQ
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold">
              Frequently asked questions
            </h2>
          </div>

          <div className="max-w-4xl space-y-3">
            {faqs.map(
              (faq, index) => {
                const isOpen =
                  openFaq === index;

                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq(
                          isOpen
                            ? null
                            : index
                        )
                      }
                      className="w-full flex items-center justify-between gap-5 px-5 sm:px-6 py-5 text-left"
                    >
                      <span className="font-semibold">
                        {faq.question}
                      </span>

                      <ChevronDown
                        size={19}
                        className={`text-cyan-300 shrink-0 transition-transform ${
                          isOpen
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-5 text-sm text-gray-400 leading-7">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default CourseDetail;