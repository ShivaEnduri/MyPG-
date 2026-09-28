import { Clock } from "lucide-react";
import { useState } from "react";

interface Activity {
  id: number;
  text: string;
}

export default function Announcement() {
  const activities: Activity[] = [
    { id: 1, text: "Water supply maintenance tomorrow 8-10 AM." },
    { id: 2, text: "Diwali celebration event on 12th Nov in lounge." },
    { id: 3, text: "Please update KYC documents by 30th Sept." },
    { id: 4, text: "Gym operating hours extended until 10 PM starting Monday." },
    { id: 5, text: "Quarterly security awareness training is now mandatory." },
    { id: 6, text: "Candidate 5 checked-out on 4th Sep 2025" },
  ];

  const [expanded, setExpanded] = useState<boolean>(false);
  const visibleActivities = expanded ? activities : activities.slice(0, 4);
  const remainingCount = activities.length - 4;

  return (
    <div className="mb-4 flex justify-center">
      <div className="w-[1900px] mt-5 px-5 sm:px-6 lg:px-6 xl:px-6 2xl:px-6">
        {/* Heading */}
        <div className="flex items-center gap-2 mb-4 ml-1 mt-5">
          <Clock className="text-black" size={22} />
          <h2 className="text-xl font-semibold text-black">Announcement</h2>
        </div>

        {/* Card */}
        <div className="bg-[#ffff] rounded-2xl shadow-md p-6">
          <ul className="space-y-2">
            {visibleActivities.map((activity) => (
              <li key={activity.id} className="flex items-start gap-3 text-gray-700">
                <span className="h-2.5 w-2.5 rounded-full bg-[#073C9E] mt-1"></span>
                <p className="text-sm font-Poppins">{activity.text}</p>
              </li>
            ))}
          </ul>

          {/* View more / less */}
          {activities.length > 4 && (
            <div className="mt-3">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-[#073C9E] font-medium hover:underline flex items-center"
              >
                {expanded ? (
                  <>
                    View less
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="ml-1 h-4 w-4 sm:h-5 sm:w-5 rotate-180"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.47 13.28a.75.75 0 0 0 1.06 0l7.5-7.5a.75.75 0 0 0-1.06-1.06L12 11.69 5.03 4.72a.75.75 0 0 0-1.06 1.06l7.5 7.5Z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M11.47 19.28a.75.75 0 0 0 1.06 0l7.5-7.5a.75.75 0 1 0-1.06-1.06L12 17.69l-6.97-6.97a.75.75 0 0 0-1.06 1.06l7.5 7.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    View more ({remainingCount})
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.47 13.28a.75.75 0 0 0 1.06 0l7.5-7.5a.75.75 0 0 0-1.06-1.06L12 11.69 5.03 4.72a.75.75 0 0 0-1.06 1.06l7.5 7.5Z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M11.47 19.28a.75.75 0 0 0 1.06 0l7.5-7.5a.75.75 0 1 0-1.06-1.06L12 17.69l-6.97-6.97a.75.75 0 0 0-1.06 1.06l7.5 7.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
