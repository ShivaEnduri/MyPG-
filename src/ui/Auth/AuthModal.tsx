// packages/ui/src/components/AuthModal/AuthModal.tsx
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
// import Cookies from "js-cookie";
// import MobileInputScreen from "./MobileInputScreen";
import LoginSignupScreen from "./LoginSignupScreen";
import MessageToast from "./MessageToast";
import CloseButton from "./CloseButton";
import { useRoleStore } from "../../store/roleStore";
// import useUserListingsStore from "../../../apps/rentals/src/app/store/userListingsStore";
// import useActionsListingsStore from "../../../apps/rentals/src/app/store/actionsListingsStore";
// import useTransactionsStore from "../../store/transactionsStore";
//import { STUDIO_BASE } from "@packages/config/constants";
import MobileVerificationScreen from "./MobileVerificationScreen";

const apiUrl = import.meta.env.VITE_API_URL as string;
const jwtSecretKey = import.meta.env.VITE_JWT_SECRET_KEY as string;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerBy?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, triggerBy = "/" }) => {
  const { setUserData } = useRoleStore();
  // const { fetchUserListings } = useUserListingsStore();
  // const { fetchActionsListings } = useActionsListingsStore();
  // const { fetchUserTransactions } = useTransactionsStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLogin, setIsLogin] = React.useState(true);
  const [isMobileConfirmed, setIsMobileConfirmed] = React.useState(false);
  const [afterLoginIsMobile, setAfterLoginIsMobile] = React.useState(false);
  const [afterLoginData, setAfterLoginData] = React.useState<any>({});
  const [referralCode, setReferralCode] = React.useState("");
  const [selectedCountry, setSelectedCountry] = React.useState<any>(null);
  const [mobileNumber, setMobileNumber] = React.useState("");

  const shared = {
    isLogin,
    setIsLogin,
    isMobileConfirmed,
    setIsMobileConfirmed,
    afterLoginIsMobile,
    setAfterLoginIsMobile,
    afterLoginData,
    setAfterLoginData,
    referralCode,
    setReferralCode,
    selectedCountry,
    setSelectedCountry,
    mobileNumber,
    setMobileNumber,
    triggerBy,
    navigate,
    onClose,
    setUserData,
    fetchUserListings: () => Promise.resolve(),
    fetchActionsListings: () => Promise.resolve(),
    fetchUserTransactions: () => Promise.resolve(),
    // fetchUserListings,
    //fetchActionsListings,
    //fetchUserTransactions,
  };

  // These stores are not currently connected in this modal; provide the
  // callbacks required by MobileVerificationScreen until they are restored.
  const mobileVerificationProps = {
    ...shared,
    fetchUserListings: () => Promise.resolve(),
    fetchActionsListings: () => Promise.resolve(),
    fetchUserTransactions: () => Promise.resolve(),
  };

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) setReferralCode(ref);
  }, [searchParams]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
      setIsLogin(true);
      setIsMobileConfirmed(false);
      setAfterLoginIsMobile(false);
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 overflow-y-auto">
      <div
        className={`relative mx-5 w-full max-w-xl lg:max-w-2xl bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row ${
          isLogin ? "flex-row-reverse" : ""
        }`}
      >
        {/* Left Logo */}
        <div className="w-full bg-[#001433] h-24 md:min-h-[440px] md:rounded-r-full md:w-1/2 flex items-center justify-center p-6">
          <img src="/RUFRENT6.png" alt="logo" className="h-12" />
        </div>

        {/* Right Content */}
        <div className="relative w-full md:w-1/2 p-6 flex flex-col justify-center items-center">
          <MessageToast />
          <CloseButton onClose={onClose} />

          {((!isLogin && !isMobileConfirmed) || afterLoginIsMobile) ? (
            <MobileVerificationScreen {...mobileVerificationProps} />
          ) : (
            <LoginSignupScreen {...shared} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

// import React, { useEffect } from "react";
// import { useSearchParams } from "react-router-dom";

// import MobileLoginScreen from "./MobileLoginScreen";
// import OtpVerificationScreen from "./OtpVerificationScreen";
// import MessageToast from "./MessageToast";
// import CloseButton from "./CloseButton";

// interface AuthModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   triggerBy?: string;
// }

// const AuthModal: React.FC<AuthModalProps> = ({
//   isOpen,
//   onClose,
//   triggerBy = "/",
// }) => {
//   const [searchParams] = useSearchParams();

//   const [step, setStep] = React.useState<"mobile" | "otp">("mobile");
//   const [mobileNumber, setMobileNumber] = React.useState("");
//   const [isLoading, setIsLoading] = React.useState(false);

//   const displayMessage = (
//     type: "success" | "error",
//     text: string
//   ) => {
//     window.dispatchEvent(
//       new CustomEvent("showToast", {
//         detail: {
//           type,
//           text,
//         },
//       })
//     );
//   };

//   useEffect(() => {
//     if (!isOpen) {
//       document.body.classList.remove("overflow-hidden");
//       return;
//     }

//     document.body.classList.add("overflow-hidden");

//     setStep("mobile");
//     setMobileNumber("");
//     setIsLoading(false);

//     const ref = searchParams.get("ref");

//     if (ref) {
//       console.log("Referral code ignored:", ref);
//     }

//     return () => {
//       document.body.classList.remove("overflow-hidden");
//     };
//   }, [isOpen, searchParams]);

//   if (!isOpen) {
//     return null;
//   }

//   const handleOtpSent = (phone: string) => {
//     setMobileNumber(phone);
//     setStep("otp");
//   };

//   const handleBackToMobile = () => {
//     setStep("mobile");
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#001433]/75 backdrop-blur-sm p-4 sm:p-6">
//       <div className="relative w-full max-w-[430px] overflow-hidden rounded-3xl bg-white shadow-2xl">

//         {/* Decorative top section */}
//         <div className="relative h-[150px] overflow-hidden bg-gradient-to-br from-[#001433] via-[#05275c] to-[#0a4da2]">

//           {/* Decorative circles */}
//           <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/10" />
//           <div className="absolute -left-16 -bottom-20 h-48 w-48 rounded-full bg-white/10" />
//           <div className="absolute right-20 bottom-[-35px] h-20 w-20 rounded-full bg-white/5" />

//           <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
//             <img
//               src="/RUFRENT6.png"
//               alt="Rufrent"
//               className="mb-3 h-10 object-contain"
//             />

//             <p className="text-[11px] font-medium tracking-[0.22em] text-white/60 uppercase">
//               Secure Access
//             </p>
//           </div>
//         </div>

//         {/* Close */}
//         <CloseButton onClose={onClose} />

//         {/* Toast */}
//         <MessageToast />

//         {/* Content */}
//         <div className="px-6 pb-7 pt-7 sm:px-8">
//           {step === "mobile" ? (
//             <MobileLoginScreen
//               onOtpSent={handleOtpSent}
//               isLoading={isLoading}
//               setIsLoading={setIsLoading}
//               displayMessage={displayMessage}
//             />
//           ) : (
//             <OtpVerificationScreen
//               mobileNumber={mobileNumber}
//               onBack={handleBackToMobile}
//               onClose={onClose}
//               triggerBy={triggerBy}
//               isLoading={isLoading}
//               setIsLoading={setIsLoading}
//               displayMessage={displayMessage}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthModal;