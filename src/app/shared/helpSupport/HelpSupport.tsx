import { FC, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  BookOpen,
  Building2,
  ChevronRight,
  CircleHelp,
  FileText,
  Headphones,
  Megaphone,
  Search,
  Users,
  WalletCards,
  Wrench,
  X,
} from "lucide-react";

import { PageShell } from "@/app/shared/components/PageShell";

type GuideCategory =
  | "Getting Started"
  | "PG Management"
  | "Payments"
  | "Maintenance"
  | "Communication"
  | "Reports";

interface GuideStep {
  title: string;
  description: string;

  /**
   * Add a screenshot later.
   *
   * Example:
   * image: "/help/add-booking/step-1.png"
   */
  image?: string;

  /**
   * Optional text shown below the image.
   */
  imageAlt?: string;
}

interface Guide {
  id: string;
  title: string;
  description: string;
  category: GuideCategory;
  icon: FC<{ className?: string }>;
  steps: GuideStep[];
}

interface Category {
  id: GuideCategory;
  title: string;
  description: string;
  icon: FC<{ className?: string }>;
}

const categories: Category[] = [
  {
    id: "Getting Started",
    title: "Getting Started",
    description: "Learn how to login and use your dashboard.",
    icon: BookOpen,
  },
  {
    id: "PG Management",
    title: "PG Management",
    description: "Manage beds, bookings and residents.",
    icon: Building2,
  },
  {
    id: "Payments",
    title: "Payments",
    description: "Manage rent and resident payments.",
    icon: WalletCards,
  },
  {
    id: "Maintenance",
    title: "Maintenance",
    description: "Manage issues and service requests.",
    icon: Wrench,
  },
  {
    id: "Communication",
    title: "Communication",
    description: "Send announcements to residents.",
    icon: Megaphone,
  },
  {
    id: "Reports",
    title: "Reports",
    description: "View and download your reports.",
    icon: FileText,
  },
];

const guides: Guide[] = [
  {
    id: "login",
    title: "How to Login",
    description: "Login to your PG Management account using Google.",
    category: "Getting Started",
    icon: CircleHelp,
    steps: [
      {
        title: "Open the application",
        description: "Open the PG Management App and go to the landing page.",
        image:"/help/common/landingPage.png",
      },
      {
        title: "Click Login",
        description: "Click Login from the top navigation bar.",
         image:"/help/common/login.jpeg",
      },
      {
        title: "Continue with Google",
        description: "Click Continue with Google.",
         image:"/help/common/continue.png",
      },
      {
        title: "Select your Gmail account",
        description:
          "Select the Gmail account you want to use. Sometimes Google may automatically use your previous account.",
      },
      {
        title: "Complete your profile",
        description:
          "Complete Your Profile window appears, close it using the X button.",
           image:"/help/common/completeProfile.jpeg",
      },
      {
        title: "Refresh the application",
        description:
          "Refresh the page and wait for a few seconds. Your name should appear in the navigation bar.",
           image:"/help/common/refresh.jpeg",
      },
    ],
  },

  {
    id: "dashboard",
    title: "How to Open the Dashboard",
    description: "Open and switch between Owner and Manager dashboards.",
    category: "Getting Started",
    icon: Building2,
    steps: [
     
      {
        title: "Click Dashboard",
        description: "Click Dashboard from the navigation bar.",
        image:"/help/owner/dashboard/dashboard.jpeg",
      },
      {
        title: "Select your dashboard",
        description:
          "Use the Owner / Manager dropdown to select the dashboard you want to view.",
        image:"/help/owner/dashboard/ownerManagerDropdown.jpeg",
      },
     
    ],
  },

  {
    id: "beds-rooms",
    title: "How to View Beds & Rooms",
    description: "View rooms, beds and their current details.",
    category: "PG Management",
    icon: BedDouble,
    steps: [
      {
        title: "Open the Dashboard",
        description: "Go to your Owner Dashboard.",
      },
      {
        title: "Click Beds & Rooms",
        description: "Select Beds & Rooms from the sidebar.",
      },
      {
        title: "Open the Bed Map",
        description: "The Bed Map will show the available rooms and beds.",
      },
      {
        title: "View bed details",
        description:
          "Select a room or bed to view its current details and status.",
      },
    ],
  },

  {
    id: "bookings",
    title: "How to Add a Booking",
    description: "Add a new guest and assign a bed.",
    category: "PG Management",
    icon: BookOpen,
    steps: [
      {
        title: "Open Enquiries",
        description: "Click Enquiries from the sidebar.",
      },
      {
        title: "Click Add Booking",
        description: "Select Add Booking to create a new guest booking.",
      },
      {
        title: "Enter guest details",
        description: "Enter the required guest and booking information.",
      },
      {
        title: "Create the booking",
        description: "Submit the booking.",
      },
      {
        title: "Open Open Bookings",
        description:
          "The newly created booking will appear in the Open Bookings section.",
      },
      {
        title: "Assign a bed",
        description:
          "Select the guest and assign an available bed from the available beds.",
      },
    ],
  },

  {
    id: "residents",
    title: "How to View Residents",
    description: "View your residents and their profiles.",
    category: "PG Management",
    icon: Users,
    steps: [
      {
        title: "Open Residents",
        description: "Click Residents from the sidebar.",
      },
      {
        title: "View the residents list",
        description:
          "The page will display the residents currently associated with the PG.",
      },
      {
        title: "Open a resident profile",
        description:
          "Click View Profile to see the selected resident's details.",
      },
    ],
  },

  {
    id: "rent-status",
    title: "How to Manage Rent",
    description: "Check rent status, send reminders and add payments.",
    category: "Payments",
    icon: WalletCards,
    steps: [
      {
        title: "Open Rent Status",
        description: "Click Rent Status from the sidebar.",
      },
      {
        title: "Check rent status",
        description:
          "View the rent status of the residents listed on the page.",
      },
      {
        title: "Send a reminder",
        description:
          "Click Send Reminder to send a rent reminder to the residents.",
      },
      {
        title: "Select a resident",
        description:
          "To add a payment, select the resident you want to update.",
      },
      {
        title: "Enter the payment amount",
        description: "Enter the amount received from the resident.",
      },
      {
        title: "Update payment status",
        description: "Select or update the required payment status.",
      },
      {
        title: "Add the payment",
        description: "Click Add Payment to save the payment.",
      },
    ],
  },

  {
    id: "issues",
    title: "How to Manage Issues",
    description: "Assign service requests and update their status.",
    category: "Maintenance",
    icon: Wrench,
    steps: [
      {
        title: "Open Issues",
        description: "Click Issues from the sidebar.",
      },
      {
        title: "View service requests",
        description:
          "Check the Open Service Requests and Quick Escalations sections.",
      },
      {
        title: "Open a service request",
        description: "Click the pencil icon for the request you want to update.",
      },
      {
        title: "Assign the request",
        description: "Select the Manager or Staff member responsible for it.",
      },
      {
        title: "Set the ETA",
        description: "Select the expected completion date.",
      },
      {
        title: "Update the status",
        description: "Select the required request status and save the changes.",
      },
    ],
  },

  {
    id: "broadcast",
    title: "How to Send an Announcement",
    description: "Send announcements to residents.",
    category: "Communication",
    icon: Megaphone,
    steps: [
      {
        title: "Open Broadcast",
        description: "Click Broadcast from the sidebar.",
      },
      {
        title: "Select a category",
        description: "Choose the appropriate broadcast category.",
      },
      {
        title: "Enter the title",
        description: "Enter the announcement title.",
      },
      {
        title: "Enter the message",
        description: "Enter the announcement message.",
      },
      {
        title: "Select a channel",
        description: "Select your preferred communication channel.",
      },
      {
        title: "Send the announcement",
        description: "Click Send Announcement.",
      },
      {
        title: "Check recent announcements",
        description:
          "The sent announcement will appear under Recent Announcements.",
      },
    ],
  },

  {
    id: "reports",
    title: "How to Download Reports",
    description: "View and download monthly PG reports.",
    category: "Reports",
    icon: FileText,
    steps: [
      {
        title: "Open Reports",
        description: "Click Reports from the sidebar.",
      },
      {
        title: "View available reports",
        description: "Check the reports available for your PG.",
      },
      {
        title: "Select a monthly report",
        description: "Choose the report you want to download.",
      },
      {
        title: "Download the report",
        description: "Click the download option to save the report.",
      },
    ],
  },
];

const HelpSupport: FC = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<GuideCategory | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const filteredGuides = useMemo(() => {
    const query = search.trim().toLowerCase();

    return guides.filter((guide) => {
      const matchesCategory = selectedCategory
        ? guide.category === selectedCategory
        : true;

      if (!query) {
        return matchesCategory;
      }

      return (
        matchesCategory &&
        `${guide.title} ${guide.description} ${guide.category}`
          .toLowerCase()
          .includes(query)
      );
    });
  }, [search, selectedCategory]);

  const openGuide = (guide: Guide) => {
    setSelectedGuide(guide);
    setCurrentStep(0);
  };

  const closeGuide = () => {
    setSelectedGuide(null);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (!selectedGuide) return;

    setCurrentStep((step) =>
      Math.min(step + 1, selectedGuide.steps.length - 1)
    );
  };

  const previousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  return (
    <PageShell>
      <div className="w-full">
        {/* Header */}
        <div className="mb-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                  <Headphones className="h-4.5 w-4.5" />
                </div>

                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Help & Support
                  </h1>

                  <p className="text-xs text-slate-500 sm:text-sm">
                    Simple guides to help you manage your PG.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for help..."
              className="
                h-12 w-full rounded-2xl border border-slate-200
                bg-white pl-11 pr-11 text-sm text-slate-800
                shadow-sm outline-none transition
                placeholder:text-slate-400
                focus:border-slate-400 focus:ring-4 focus:ring-slate-100
              "
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category filters */}
        {!selectedGuide && (
          <>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Help Topics
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Choose a topic to find the right guide.
                </p>
              </div>

              {selectedCategory && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  View all
                </button>
              )}
            </div>

            <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {categories.map((category) => {
                const Icon = category.icon;
                const active = selectedCategory === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(active ? null : category.id)
                    }
                    className={`
                      group rounded-2xl border p-4 text-left transition
                      ${
                        active
                          ? "border-slate-900 bg-slate-900 text-white shadow-md"
                          : "border-slate-200 bg-white text-slate-900 shadow-sm hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                      }
                    `}
                  >
                    <div
                      className={`
                        mb-3 flex h-9 w-9 items-center justify-center rounded-xl
                        ${
                          active
                            ? "bg-white/15 text-white"
                            : "bg-slate-100 text-slate-700"
                        }
                      `}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>

                    <p className="text-xs font-semibold sm:text-sm">
                      {category.title}
                    </p>

                    <p
                      className={`
                        mt-1 line-clamp-2 text-[10px] leading-4 sm:text-[11px]
                        ${active ? "text-white/70" : "text-slate-500"}
                      `}
                    >
                      {category.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Guides */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    {selectedCategory || "All Guides"}
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {filteredGuides.length} guide
                    {filteredGuides.length !== 1 ? "s" : ""} available
                  </p>
                </div>
              </div>

              {filteredGuides.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                  <Search className="mx-auto mb-3 h-8 w-8 text-slate-300" />

                  <h3 className="text-sm font-semibold text-slate-800">
                    No guides found
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Try searching for another topic.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredGuides.map((guide) => {
                    const Icon = guide.icon;

                    return (
                      <button
                        key={guide.id}
                        type="button"
                        onClick={() => openGuide(guide)}
                        className="
                          group flex items-center gap-4 rounded-2xl
                          border border-slate-200 bg-white p-4 text-left
                          shadow-sm transition
                          hover:-translate-y-0.5 hover:border-slate-300
                          hover:shadow-md
                        "
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-900 group-hover:text-white">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            {guide.title}
                          </p>

                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                            {guide.description}
                          </p>
                        </div>

                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Guide detail */}
        {selectedGuide && (
          <div>
            <button
              type="button"
              onClick={closeGuide}
              className="mb-5 inline-flex items-center gap-2 rounded-xl px-2 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Help
            </button>

            <div className="mx-auto max-w-3xl">
              {/* Guide header */}
              <div className="mb-5">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  {(() => {
                    const Icon = selectedGuide.icon;
                    return <Icon className="h-5 w-5" />;
                  })()}
                </div>

                <div className="mb-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                  {selectedGuide.category}
                </div>

                <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  {selectedGuide.title}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedGuide.description}
                </p>
              </div>

              {/* Progress */}
              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600">
                    Step {currentStep + 1} of {selectedGuide.steps.length}
                  </span>

                  <span className="text-slate-400">
                    {Math.round(
                      ((currentStep + 1) / selectedGuide.steps.length) * 100
                    )}
                    %
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-900 transition-all duration-300"
                    style={{
                      width: `${
                        ((currentStep + 1) / selectedGuide.steps.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Current step */}
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="p-5 sm:p-7">
                  <div className="mb-5 flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                      {currentStep + 1}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                        {selectedGuide.steps[currentStep].title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {selectedGuide.steps[currentStep].description}
                      </p>
                    </div>
                  </div>

                  {/* Future screenshot area */}
                  {selectedGuide.steps[currentStep].image ? (
                    <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      <img
                        src={selectedGuide.steps[currentStep].image}
                        alt={
                          selectedGuide.steps[currentStep].imageAlt ||
                          selectedGuide.steps[currentStep].title
                        }
                        className="h-auto w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div
                      className="
                        mb-6 flex min-h-[150px] items-center justify-center
                        rounded-2xl border border-dashed border-slate-200
                        bg-slate-50 px-5 text-center
                      "
                    >
                      <div>
                        <BookOpen className="mx-auto mb-2 h-6 w-6 text-slate-300" />

                        <p className="text-xs font-medium text-slate-400">
                          Screenshot can be added here
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                          This space is ready for a step image.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={previousStep}
                      disabled={currentStep === 0}
                      className="
                        inline-flex h-10 items-center gap-2 rounded-xl
                        border border-slate-200 bg-white px-4
                        text-xs font-semibold text-slate-700
                        transition hover:bg-slate-50
                        disabled:cursor-not-allowed disabled:opacity-40
                      "
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </button>

                    {currentStep < selectedGuide.steps.length - 1 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="
                          inline-flex h-10 items-center gap-2 rounded-xl
                          bg-slate-900 px-5 text-xs font-semibold text-white
                          shadow-sm transition hover:bg-slate-800
                        "
                      >
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={closeGuide}
                        className="
                          inline-flex h-10 items-center gap-2 rounded-xl
                          bg-slate-900 px-5 text-xs font-semibold text-white
                          shadow-sm transition hover:bg-slate-800
                        "
                      >
                        Done
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Step indicators */}
              <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                {selectedGuide.steps.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentStep(index)}
                    aria-label={`Go to step ${index + 1}`}
                    className={`
                      h-1.5 rounded-full transition-all
                      ${
                        index === currentStep
                          ? "w-7 bg-slate-900"
                          : "w-1.5 bg-slate-200 hover:bg-slate-400"
                      }
                    `}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default HelpSupport;