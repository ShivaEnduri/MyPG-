



import React, {
  useEffect,
  useState,
  useRef,
  type ChangeEvent,
} from "react";

// ============================================================
// ASSETS
// ============================================================

import guest from "@/app/shared/assests/guest.png";
import lp_img from "@/app/shared/assests/pgImg.png";
import manager from "@/app/shared/assests/manager.png";
import owner from "@/app/shared/assests/owner.png";

import automationImg from "@/app/shared/assests/automation.png";
import guestExperienceImg from "@/app/shared/assests/guestExperience.png";
import transparencyImg from "@/app/shared/assests/screenTransparency.png";
import singleLoginImg from "@/app/shared/assests/singleLogin.png";

// ============================================================
// COMPONENTS
// ============================================================

import tailwindStyles from "@/styles/tailwindStyles";

//import RequestCallbackModal from "./RequestCallbackModal";
import { PowerfulToolsSection } from "./PowerfulToolsSection";
import { PropertiesNearbySection } from "./PropertiesNearbySection";
import PGNavbar from "./LandingPageNavbar";

import Dropdown from "@/ui/Shared/Dropdown";

import { ThreeDots } from "react-loader-spinner";

// ============================================================
// STORES
// ============================================================

import { usePgLocationStore } from "../../shared/store/pgLocationStore";
import { usePgTypeStore } from "../../shared/store/pgTypeStore";
import { usePgCategoryStore } from "../../shared/store/pgCategoryStore";
import { usePgAmenitiesStore } from "../../shared/store/amenitiesStore";

// ============================================================
// AUTH
// ============================================================

import {
  useAuth,
  useAuthModal,
} from "@/hooks/context/AuthContext";

// ============================================================
// TYPES
// ============================================================

type BlueDotsProps = {
  className?: string;
};

export interface SearchFilters {
  stateId?: string;
  cityId?: string;
  pgType?: string;
  pgCategory?: string;
  pgAmenity?: string;
}

// ============================================================
// DECORATIVE DOTS
// ============================================================

const BlueDots: React.FC<BlueDotsProps> = ({ className }) => (
  <svg
    className={className}
    width="448"
    height="431"
    viewBox="0 0 448 431"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.0968 -109.926C16.0968 -105.468 12.4934 -101.853 8.04839 -101.853C3.60339 -101.853 0 -105.468 0 -109.926C0 -114.385 3.60339 -118 8.04839 -118C12.4934 -118 16.0968 -114.385 16.0968 -109.926Z"
      fill="currentColor"
    />

    <path
      d="M64.3871 -109.926C64.3871 -105.468 60.7837 -101.853 56.3387 -101.853C51.8937 -101.853 48.2903 -105.468 48.2903 -109.926C48.2903 -114.385 51.8937 -118 56.3387 -118C60.7837 -118 64.3871 -114.385 64.3871 -109.926Z"
      fill="currentColor"
    />

    <path
      d="M112.677 -109.926C112.677 -105.468 109.074 -101.853 104.629 -101.853C100.184 -101.853 96.5806 -105.468 96.5806 -109.926C96.5806 -114.385 100.184 -118 104.629 -118C109.074 -118 112.677 -105.468 112.677 -109.926Z"
      fill="currentColor"
    />

    <path
      d="M499 422.927C499 427.385 495.397 431 490.952 431C486.507 431 482.903 427.385 482.903 422.927C482.903 418.468 486.507 414.853 490.952 414.853C495.397 414.853 499 418.468 499 422.927Z"
      fill="currentColor"
    />
  </svg>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

export const Landingpage: React.FC = () => {
  // ==========================================================
  // ZUSTAND STORES
  // ==========================================================

  const {
    states,
    cities,
    loading: locationLoading,
    fetchStates,
    fetchCities,
    clearCities,
  } = usePgLocationStore();

  const {
    pgTypes,
    loading: pgTypeLoading,
    fetchPgTypes,
  } = usePgTypeStore();

  const {
    categories,
    loading: categoryLoading,
    fetchCategories,
  } = usePgCategoryStore();

  const {
    amenities,
    loading: amenitiesLoading,
    fetchAmenities,
  } = usePgAmenitiesStore();

  // ==========================================================
  // AUTH
  // ==========================================================

  const { user } = useAuth();

  const {
    openModal,
    loginIntent,
    clearIntent,
  } = useAuthModal();

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [stateId, setStateId] = useState<string>("");
  const [cityId, setCityId] = useState<string>("");
  const [pgType, setPgType] = useState<string>("");
  const [pgCategory, setPgCategory] = useState<string>("");
  const [pgAmenity, setPgAmenity] = useState<string>("");

  const [searchClicked, setSearchClicked] = useState<boolean>(false);

  const [searchFilters, setSearchFilters] =
    useState<SearchFilters | null>(null);

  const [isCallbackModalOpen, setIsCallbackModalOpen] =
    useState<boolean>(false);

  // ==========================================================
  // REFS
  // ==========================================================

  const propertiesRef = useRef<HTMLDivElement | null>(null);

  // ==========================================================
  // INITIAL DATA
  // ==========================================================

  useEffect(() => {
    fetchStates();
    fetchPgTypes();
    fetchCategories();
    fetchAmenities();
  }, [
    fetchStates,
    fetchPgTypes,
    fetchCategories,
    fetchAmenities,
  ]);

  // ==========================================================
  // STATE CHANGE
  // ==========================================================

  const handleStateChange = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedStateId = e.target.value;

    setStateId(selectedStateId);
    setCityId("");

    if (selectedStateId) {
      fetchCities(Number(selectedStateId));
    } else {
      clearCities();
    }
  };

  // ==========================================================
  // DROPDOWN OPTIONS
  // ==========================================================

  const stateOptions = Array.isArray(states)
    ? states
        .filter((state) => state && state.name)
        .map((state) => ({
          id: String(state.id),
          name: state.name,
        }))
    : [];

  const cityOptions = Array.isArray(cities)
    ? cities
        .filter((city) => city && city.city)
        .map((city) => ({
          id: String(city.id),
          name: city.city,
        }))
    : [];

  const pgTypeOptions = Array.isArray(pgTypes)
    ? pgTypes
        .filter((type) => type && type.pg_type)
        .map((type) => ({
          id: String(type.id),
          name: type.pg_type,
        }))
    : [];

  const categoryOptions = Array.isArray(categories)
    ? categories
        .filter((category) => category && category.category)
        .map((category) => ({
          id: String(category.id),
          name:
            category.category.charAt(0).toUpperCase() +
            category.category.slice(1),
        }))
    : [];

  const amenityOptions = Array.isArray(amenities)
    ? amenities
        .filter(
          (amenity) =>
            amenity && amenity.amenity_name
        )
        .map((amenity) => ({
          id: String(amenity.id),
          name: amenity.amenity_name
            .replace(/([A-Z])/g, " $1")
            .trim(),
        }))
    : [];

  // ==========================================================
  // SEARCH
  // ==========================================================

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSearchClicked(true);

    const filters: SearchFilters = {
      stateId,
      cityId,
      pgType,
      pgCategory,
      pgAmenity,
    };

    console.log("Search Filters:", filters);

    setSearchFilters(filters);

    setTimeout(() => {
      if (propertiesRef.current) {
        const yOffset = -80;

        const element = propertiesRef.current;

        const y =
          element.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      }

      setSearchClicked(false);
    }, 100);
  };

  // ==========================================================
  // REQUEST CALLBACK
  // ==========================================================

  // const handleRequestCallbackClick = () => {
  //   if (!user) {
  //     openModal("callback");
  //     return;
  //   }

  //   setIsCallbackModalOpen(true);
  // };

  // ==========================================================
  // OPEN CALLBACK AFTER LOGIN
  // ==========================================================

  useEffect(() => {
    if (user && loginIntent === "callback") {
      setIsCallbackModalOpen(true);
      clearIntent();
    }
  }, [user, loginIntent, clearIntent]);

  // ==========================================================
  // WHY CHOOSE MYPG
  // ==========================================================

  const whyChooseCards = [
    {
      img: automationImg,
      text: "Saves time with automation",
    },
    {
      img: transparencyImg,
      text: "Increases transparency for owners/managers",
    },
    {
      img: guestExperienceImg,
      text: "Enhances guest experience",
    },
    {
      img: singleLoginImg,
      text: "Single login, Multiple Services (RR Ecosystem)",
    },
  ];

  // ==========================================================
  // LOADING
  // ==========================================================

  const loading =
    locationLoading ||
    pgTypeLoading ||
    categoryLoading ||
    amenitiesLoading;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="bg-white flex flex-col justify-center">
      <PGNavbar />

      {/* ======================================================
          HERO SECTION
      ====================================================== */}

      <div className="flex justify-center">
        <section
          id="home"
          className="
            relative
            text-center
            bg-cover
            bg-center
            bg-no-repeat
            md:w-[calc(100vw-100px)]
            md:rounded-b-3xl
            w-full
            min-h-[90vh]
            md:min-h-[60vh]
            lg:min-h-[70vh]
          "
          style={{
            backgroundImage: `url(${lp_img})`,
          }}
        >
          <div className="relative md:rounded-b-3xl flex flex-col items-center">

            <h1
              className={`
                ${tailwindStyles.heading_1}
                text-yellow-500
                mt-1
                md:mt-4
                mb-1
                md:mb-4
                text-shadow-lg/30
                max-w-[80%]
              `}
            >
              PG MANAGEMENT. SIMPLIFIED
            </h1>

            <p
              className={`
                ${tailwindStyles.heading_3}
                text-gray-200
                max-w-[85%]
                mb-2
                md:mb-8
              `}
            >
              From Occupancy Tracking To Guest Convenience,
              MyPG By Rufrent Helps Owners, Managers, And Guests
              Manage Everything In One Place.
            </p>

            {/* SEARCH BOX */}

            <div
              className="
                relative
                z-10
                p-4
                rounded-md
                md:rounded-2xl
                shadow-lg
                bg-white
                text-[#001433]
                w-[85%]
                md:w-auto
              "
            >
              {loading ? (
                <div className="flex justify-center items-center py-2">
                  <ThreeDots
                    height="40"
                    width="40"
                    color="#3B82F6"
                  />
                </div>
              ) : (
                <form
                  className="flex flex-col items-center gap-3"
                  onSubmit={handleSubmit}
                >
                  {/* FIRST ROW */}

                 {/* <div className="grid grid-cols-2 md:grid-cols-3 w-full gap-3"> */}
                    {/* <Dropdown
                      label="State"
                      value={stateId}
                      onChange={handleStateChange}
                      options={stateOptions}
                    />

                    <Dropdown
                      label="City"
                      value={cityId}
                      onChange={(
                        e: ChangeEvent<HTMLSelectElement>
                      ) => {
                        setCityId(e.target.value);
                      }}
                      options={cityOptions}
                      disabled={!stateId}
                    />

                    <div className="col-span-2 md:col-span-1">
                      <Dropdown
                        label="PG Type"
                        value={pgType}
                        onChange={(
                          e: ChangeEvent<HTMLSelectElement>
                        ) => {
                          setPgType(e.target.value);
                        }}
                        options={pgTypeOptions}
                      />
                    </div>
                  </div> */}

                  {/* SECOND ROW */}

                  <div className="flex w-full md:w-3/4 gap-3">
                    {/* <Dropdown
                      label="Category"
                      value={pgCategory}
                      onChange={(
                        e: ChangeEvent<HTMLSelectElement>
                      ) => {
                        setPgCategory(e.target.value);
                      }}
                      options={categoryOptions}
                    />

                    <Dropdown
                      label="Amenities"
                      value={pgAmenity}
                      onChange={(
                        e: ChangeEvent<HTMLSelectElement>
                      ) => {
                        setPgAmenity(e.target.value);
                      }}
                      options={amenityOptions}
                    /> */}

                    {/* DESKTOP SEARCH */}

                    <button
                      type="submit"
                      className={`
                        ${
                          searchClicked
                            ? "bg-gray-500 text-white"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }
                        px-4
                        py-0
                        text-sm
                        font-semibold
                        rounded-full
                        text-center
                        hidden
                        md:block
                        transition
                        duration-300
                      `}
                      disabled={searchClicked}
                    >
                      {searchClicked ? (
                        <ThreeDots
                          height="24"
                          width="24"
                          color="white"
                        />
                      ) : (
                        "Search"
                      )}
                    </button>
                  </div>

                  {/* MOBILE SEARCH */}

                  <button
                    type="submit"
                    className={`
                      ${
                        searchClicked
                          ? "bg-gray-500 text-white"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }
                      px-4
                      py-1
                      text-sm
                      font-semibold
                      text-center
                      block
                      md:hidden
                      w-full
                      rounded-md
                      transition
                      duration-300
                    `}
                    disabled={searchClicked}
                  >
                    {searchClicked ? (
                      <div className="flex justify-center">
                        <ThreeDots
                          height="24"
                          width="24"
                          color="white"
                        />
                      </div>
                    ) : (
                      "Search"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* NEED HELP */}

          {/* <div className="flex justify-center mt-2 md:mt-8 text-center gap-2">
            <p className="text-white text-sm md:text-base font-medium mt-2">
              Need help to list your PG?
            </p>

            <button
              type="button"
              onClick={handleRequestCallbackClick}
              className="
                mt-1
                bg-yellow-500
                hover:bg-yellow-600
                text-white
                px-3
                py-1
                md:px-4
                md:py-2
                rounded-full
                text-sm
                font-semibold
                transition
                duration-300
              "
            >
              Request Callback
            </button>
          </div> */}
        </section>
      </div>

      {/* ======================================================
          OWNER / MANAGER / GUEST
      ====================================================== */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          flex-wrap
          justify-center
          items-center
          w-full
          py-8
          gap-6
          sm:gap-4
          px-4
        "
      >
        {[
          {
            text:
              "Track occupancy, finances, and maintenance — all from a single dashboard.",
            img: owner,
            title: "OWNER",
            imgSize: "w-[90px] sm:w-[100px]",
          },
          {
            text:
              "Manage day-to-day tasks, check-ins/checkouts, and service requests effortlessly.",
            img: manager,
            title: "MANAGERS",
            imgSize: "w-[130px] sm:w-[160px]",
          },
          {
            text:
              "Seamless check-ins, bill tracking, and service requests right from your mobile devices.",
            img: guest,
            title: "GUESTS",
            imgSize: "w-[110px] sm:w-[140px]",
          },
        ].map((card, index) => (
          <div
            key={index}
            className="
              flex
              flex-col
              items-center
              text-center
              w-full
              sm:w-[300px]
              md:w-[330px]
              bg-white
              rounded-2xl
              shadow-xl
            "
          >
            <p
              className="
                px-4
                sm:px-2
                mt-4
                text-black
                font-montserrat
                text-[15px]
                sm:text-[17px]
                font-semibold
                leading-snug
              "
            >
              {card.text}
            </p>

            <div
              className="
                w-[160px]
                sm:w-[200px]
                h-[160px]
                sm:h-[200px]
                rounded-full
                bg-[#EAEFFF]
                flex
                justify-center
                items-center
                my-5
              "
            >
              <img
                src={card.img}
                alt={card.title}
                className={card.imgSize}
              />
            </div>

            <h3
              className="
                text-black
                font-montserrat
                text-[18px]
                sm:text-[20px]
                font-bold
                mb-6
                tracking-tight
              "
            >
              {card.title}
            </h3>
          </div>
        ))}
      </div>

      {/* ======================================================
          PROPERTIES NEARBY
      ====================================================== */}

      <div ref={propertiesRef}>
        <PropertiesNearbySection
          searchFilters={searchFilters}
        />
      </div>

      {/* ======================================================
          WHY CHOOSE MYP G
      ====================================================== */}

      <div
        className="
          w-full
          py-16
          sm:py-24
          px-4
          bg-white
          bg-[radial-gradient(theme(colors.gray.200)_1px,transparent_1px)]
          [background-size:16px_16px]
        "
      >
        <div className="relative max-w-6xl mx-auto">

          <BlueDots
            className="
              absolute
              top-0
              right-0
              w-[150px]
              h-[150px]
              sm:w-[200px]
              sm:h-[200px]
              text-[#605BFF]
              -mt-8
              z-0
            "
          />

          <BlueDots
            className="
              absolute
              bottom-0
              left-0
              w-[150px]
              h-[150px]
              sm:w-[200px]
              sm:h-[200px]
              text-[#605BFF]
              -mb-8
              z-0
            "
          />

          <div className="relative z-10 flex flex-col items-center">

            <h2
              className="
                text-black
                font-poppins
                font-semibold
                text-center
                text-4xl
                sm:text-5xl
                md:text-6xl
                leading-tight
                tracking-tighter
                mb-12
                md:mb-20
              "
            >
              Why Choose MyPG?
            </h2>

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-4
                gap-8
                md:gap-12
              "
            >
              {whyChooseCards.map((card, index) => (
                <div
                  key={index}
                  className="
                    flex
                    flex-col
                    items-center
                    p-6
                    bg-white
                    rounded-3xl
                    shadow-xl
                  "
                >
                  <div
                    className="
                      w-full
                      h-48
                      sm:h-56
                      flex
                      items-center
                      justify-center
                      mb-6
                    "
                  >
                    <img
                      src={card.img}
                      alt={card.text}
                      className="
                        max-w-full
                        max-h-full
                        object-contain
                      "
                    />
                  </div>

                  <p
                    className="
                      text-black
                      font-poppins
                      font-medium
                      text-lg
                      sm:text-xl
                      text-center
                    "
                  >
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          POWERFUL TOOLS
      ====================================================== */}

      <PowerfulToolsSection />

      {/* ======================================================
          CALLBACK MODAL
      ====================================================== */}

      {/* <RequestCallbackModal
        open={isCallbackModalOpen}
        onClose={() => setIsCallbackModalOpen(false)}
      /> */}

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="bg-[#001433] text-gray-200 py-6 text-center">
        <div className="max-w-6xl mx-auto px-4">

          <div className="flex justify-center space-x-4 mb-4">

            <a
              href="https://www.facebook.com/profile.php?id=61574863504948"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                alt="Facebook"
                className="w-6"
              />
            </a>

            <a
              href="https://www.instagram.com/rufrent/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                alt="Instagram"
                className="w-6"
              />
            </a>

            <a
              href="https://youtube.com/@rufrent?si=_q9JHLZIH47LMSus"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
                alt="YouTube"
                className="w-6"
              />
            </a>
          </div>

          <p className="text-xs text-gray-400">
            © 2024-25 QTIMinds Pvt. Ltd.
          </p>
        </div>
      </footer>
    </div>
  );
};