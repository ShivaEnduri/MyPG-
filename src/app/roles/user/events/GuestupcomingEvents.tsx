// src/components/UpcomingEventsPanel.tsx
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";

// Types
interface Event {
  date: string; // YYYY-MM-DD
  title: string;
}

const UpcomingEventsPanel: React.FC = () => {
  // Data States
  const [events, setEvents] = useState<Event[]>([
    { date: "2025-10-18", title: "Rent Due" },
    { date: "2025-10-20", title: "Staff Meeting" },
    { date: "2025-10-25", title: "Inspection" },
    { date: "2025-11-01", title: "Diwali Party Prep" },
    { date: "2025-11-05", title: "New Guest Check-in" },
    { date: "2025-11-10", title: "Pest Control" },
  ]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // UI States
  const [visibleStart, setVisibleStart] = useState(0);
  const [daysToShow, setDaysToShow] = useState(7);
  const [scrollStep, setScrollStep] = useState(1);

  // Generate next 30 days
  const generateDates = (): string[] => {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d.toISOString().split("T")[0];
    });
  };

  const dates = generateDates();

  // Simulate API fetch
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        // Replace with real API: const res = await fetch("/api/events");
        // setEvents(await res.json());
      } catch (err) {
        setError("Failed to load upcoming events.");
        console.error("Events fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Responsive layout
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDaysToShow(3);
        setScrollStep(3);
      } else if (width < 1024) {
        setDaysToShow(5);
        setScrollStep(2);
      } else {
        setDaysToShow(7);
        setScrollStep(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRemoveEvent = (date: string, title: string) => {
    setEvents((prev) => prev.filter((e) => !(e.date === date && e.title === title)));
    // TODO: Call API to delete event
    console.log("Event removed:", { date, title });
  };

  const scrollLeft = () => {
    setVisibleStart((prev) => Math.max(0, prev - scrollStep));
  };

  const scrollRight = () => {
    setVisibleStart((prev) =>
      Math.min(prev + scrollStep, dates.length - daysToShow)
    );
  };

  const canScrollLeft = visibleStart > 0;
  const canScrollRight = visibleStart + daysToShow < dates.length;

  if (loading) {
    return (
      <div className="w-full rounded-3xl bg-white p-10 text-center shadow-lg">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#073C9E]" />
        <p className="mt-4 text-gray-600">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-3xl bg-red-50 p-10 text-center shadow-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 mt-8 flex flex-col justify-between sm:flex-row sm:items-center">
        <h2 className="flex items-center text-xl font-semibold text-gray-900 sm:text-2xl">
          <Calendar className="mr-3 h-7 w-7 text-[#073C9E]" />
          Upcoming Events
        </h2>
        <span className="mt-2 text-sm text-gray-500 sm:mt-0">
          Next 30 days • {events.length} events
        </span>
      </div>

      {/* Calendar Strip */}
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl">
        {/* Navigation Buttons */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            aria-label="Previous days"
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg ring-1 ring-gray-200 transition-all hover:scale-110 hover:bg-gray-50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#073C9E]"
          >
            <ChevronLeft className="h-5 w-5 text-[#073C9E]" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={scrollRight}
            aria-label="Next days"
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg ring-1 ring-gray-200 transition-all hover:scale-110 hover:bg-gray-50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#073C9E]"
          >
            <ChevronRight className="h-5 w-5 text-[#073C9E]" />
          </button>
        )}

        {/* Days Grid */}
        <div className="grid grid-cols-3 gap-3 p-6 sm:grid-cols-5 lg:grid-cols-7 sm:gap-6 sm:px-12">
          {dates.slice(visibleStart, visibleStart + daysToShow).map((dateStr) => {
            const dayEvents = events.filter((e) => e.date === dateStr);
            const date = new Date(dateStr);
            const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
            const dayNum = date.getDate();
            const monthName = date.toLocaleDateString("en-US", { month: "short" });
            const isToday = dateStr === new Date().toISOString().split("T")[0];

            return (
              <div
                key={dateStr}
                className={`flex flex-col rounded-2xl bg-gradient-to-b from-gray-50 to-white p-4 text-center shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  isToday ? "ring-2 ring-[#073C9E] ring-offset-2" : ""
                }`}
              >
                {/* Date Header */}
                <div className="mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
                    {dayName}
                  </p>
                  <p className="text-2xl font-bold text-gray-800">{dayNum}</p>
                  <p className="text-xs text-gray-500">{monthName}</p>
                </div>

                {/* Events List */}
                <div className="mt-3 flex-1 space-y-1.5 overflow-y-auto">
                  {dayEvents.length > 0 ? (
                    dayEvents.map((event, i) => (
                      <div
                        key={i}
                        className="group flex items-center justify-between rounded-lg bg-blue-50 px-2 py-1.5 text-left text-xs transition-all hover:bg-blue-100"
                      >
                        <span className="truncate pr-2 font-medium text-gray-700">
                          {event.title}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveEvent(event.date, event.title);
                          }}
                          className="rounded-full p-1 text-[#073C9E] opacity-0 transition-all hover:bg-white hover:text-red-600 group-hover:opacity-100 focus:opacity-100"
                          aria-label={`Remove event: ${event.title}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs italic text-gray-400">No events</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Indicators */}
      <div className="mt-4 flex justify-center gap-2 sm:hidden">
        {Array.from({ length: Math.ceil(dates.length / scrollStep) }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 w-8 rounded-full transition-all ${
              i === Math.floor(visibleStart / scrollStep)
                ? "bg-[#073C9E]"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default UpcomingEventsPanel;