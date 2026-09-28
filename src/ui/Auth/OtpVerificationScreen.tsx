import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";
import Cookies from "js-cookie";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MessageSquareText,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { useRoleStore } from "../../store/roleStore";
// import useUserListingsStore from "../../../apps/rentals/src/app/store/userListingsStore";
// import useActionsListingsStore from "../../../apps/rentals/src/app/store/actionsListingsStore";
// import useTransactionsStore from "../../store/transactionsStore";
import {
  fetchUserRolesApi,
} from "@/app/shared/services/api/commonApiServices";

const apiUrl = import.meta.env.VITE_API_URL as string;
const jwtSecretKey =
  import.meta.env.VITE_JWT_SECRET_KEY as string;

interface OtpVerificationScreenProps {
  mobileNumber: string;
  onBack: () => void;
  onClose: () => void;
  triggerBy: string;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  displayMessage: (
    type: "success" | "error",
    text: string
  ) => void;
}

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

/*
|--------------------------------------------------------------------------
| ROLE → DASHBOARD
|--------------------------------------------------------------------------
*/

const ROLE_ROUTES: Record<string, string> = {
  PG_GUEST: "/resident/dashboard",
  PG_OWNER: "/owner/dashboard",
  PG_MANAGER: "/manager/dashboard",
  PG_VENDOR: "/vendor/dashboard",
  PG_ADMIN: "/admin/dashboard",
};

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const OtpVerificationScreen: React.FC<
  OtpVerificationScreenProps
> = ({
  mobileNumber,
  onBack,
  onClose,
  isLoading,
  setIsLoading,
  displayMessage,
}) => {
  const { setUserData } = useRoleStore();

  // const { fetchUserListings } =
  //   useUserListingsStore();

  // const { fetchActionsListings } =
  //   useActionsListingsStore();

  // const { fetchUserTransactions } =
  //   useTransactionsStore();

  const [otp, setOtp] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );

  const [resendTimer, setResendTimer] =
    useState(RESEND_SECONDS);

  const inputRefs = useRef<
    Array<HTMLInputElement | null>
  >([]);

  /*
  |--------------------------------------------------------------------------
  | RESEND COUNTDOWN
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendTimer((previous) =>
        previous > 0 ? previous - 1 : 0
      );
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [resendTimer]);

  /*
  |--------------------------------------------------------------------------
  | FORMAT MOBILE
  |--------------------------------------------------------------------------
  */

  const maskedMobile = `+91 ${mobileNumber.slice(
    0,
    2
  )}******${mobileNumber.slice(-2)}`;

  /*
  |--------------------------------------------------------------------------
  | OTP CHANGE
  |--------------------------------------------------------------------------
  */

  const handleOtpChange = (
    index: number,
    value: string
  ) => {
    const digit = value
      .replace(/\D/g, "")
      .slice(-1);

    const updatedOtp = [...otp];

    updatedOtp[index] = digit;

    setOtp(updatedOtp);

    if (
      digit &&
      index < OTP_LENGTH - 1
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /*
  |--------------------------------------------------------------------------
  | BACKSPACE
  |--------------------------------------------------------------------------
  */

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      e.key === "ArrowLeft" &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      e.key === "ArrowRight" &&
      index < OTP_LENGTH - 1
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PASTE OTP
  |--------------------------------------------------------------------------
  */

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) {
      return;
    }

    const updatedOtp = Array(
      OTP_LENGTH
    ).fill("");

    pasted
      .split("")
      .forEach((digit, index) => {
        updatedOtp[index] = digit;
      });

    setOtp(updatedOtp);

    const focusIndex = Math.min(
      pasted.length,
      OTP_LENGTH - 1
    );

    inputRefs.current[
      focusIndex
    ]?.focus();
  };

  /*
  |--------------------------------------------------------------------------
  | VERIFY OTP
  |--------------------------------------------------------------------------
  */

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== OTP_LENGTH) {
      displayMessage(
        "error",
        "Please enter the complete 6 digit OTP."
      );
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${apiUrl}/mobile-login/verify-otp`,
        {
          phone: mobileNumber,
          otp: otpValue,
        }
      );

      const data = response.data;

      if (!data?.success || !data?.token) {
        displayMessage(
          "error",
          data?.message ||
            "OTP verification failed."
        );
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | SAVE JWT
      |--------------------------------------------------------------------------
      */

      Cookies.set(
        jwtSecretKey,
        data.token,
        {
          expires: 1,
          sameSite: "lax",
          secure:
            window.location.protocol ===
            "https:",
        }
      );

      /*
      |--------------------------------------------------------------------------
      | USER DATA
      |--------------------------------------------------------------------------
      */

      const dbUser = data.user;

      if (!dbUser?.id) {
        throw new Error(
          "User information was not returned by the server."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | FETCH USER ROLE
      |
      | Role is intentionally NOT taken from JWT.
      | Backend stores role separately.
      |--------------------------------------------------------------------------
      */

     const roles = await fetchUserRolesApi({
  user_id: dbUser.id,
});

const assignedRole =
  Array.isArray(roles)
    ? roles[0]
    : (roles as {
        data?: { role?: string; role_name?: string }[];
      } | null | undefined)?.data?.[0];


      const roleName =
        assignedRole?.role ||
        assignedRole?.role_name ||
        "";

      const normalizedRole =
        String(roleName)
          .trim()
          .toUpperCase();

      /*
      |--------------------------------------------------------------------------
      | ROLE VALIDATION
      |--------------------------------------------------------------------------
      */

      const dashboardPath =
        ROLE_ROUTES[normalizedRole];

      if (!dashboardPath) {
        Cookies.remove(jwtSecretKey);

        displayMessage(
          "error",
          "Your account does not have access to this application."
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | UPDATE ZUSTAND USER
      |--------------------------------------------------------------------------
      */

      await setUserData({
        id: dbUser.id,
        role: normalizedRole.toLowerCase(),
        userName:
          `${dbUser.first_name || ""} ${
            dbUser.last_name || ""
          }`.trim() || "User",
      });

      /*
      |--------------------------------------------------------------------------
      | LOAD USER DATA
      |
      | These are kept because your existing application
      | depends on these stores.
      |--------------------------------------------------------------------------
      */

      // await Promise.allSettled([
      //   fetchUserListings(dbUser.id),
      //   fetchActionsListings(dbUser.id),
      //   fetchUserTransactions(dbUser.id),
      // ]);

      /*
      |--------------------------------------------------------------------------
      | SUCCESS
      |--------------------------------------------------------------------------
      */

      displayMessage(
        "success",
        "Login successful!"
      );

      /*
      |--------------------------------------------------------------------------
      | DASHBOARD
      |--------------------------------------------------------------------------
      */

      window.location.href =
        dashboardPath;

      onClose();
    } catch (error: any) {
      console.error(
        "OTP verification error:",
        error
      );

      const status =
        error.response?.status;

      const message =
        error.response?.data?.message;

      if (status === 400) {
        displayMessage(
          "error",
          message ||
            "Invalid or expired OTP."
        );
      } else {
        displayMessage(
          "error",
          message ||
            error.message ||
            "Unable to verify OTP."
        );
      }

      setOtp(
        Array(OTP_LENGTH).fill("")
      );

      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | RESEND OTP
  |--------------------------------------------------------------------------
  */

  const handleResendOtp = async () => {
    if (resendTimer > 0 || isLoading) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${apiUrl}/mobile-login/send-otp`,
        {
          phone: mobileNumber,
        }
      );

      if (response.data?.success) {
        setOtp(
          Array(OTP_LENGTH).fill("")
        );

        setResendTimer(
          RESEND_SECONDS
        );

        displayMessage(
          "success",
          "A new OTP has been sent."
        );

        inputRefs.current[0]?.focus();
      } else {
        displayMessage(
          "error",
          response.data?.message ||
            "Unable to resend OTP."
        );
      }
    } catch (error: any) {
      displayMessage(
        "error",
        error.response?.data?.message ||
          "Failed to resend OTP."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="w-full">

      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        disabled={isLoading}
        className="mb-5 flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-[#001433] disabled:opacity-50"
      >
        <ArrowLeft size={15} />
        Change mobile number
      </button>

      {/* Icon */}
      <div className="mb-5 flex justify-center">
        <div className="relative">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#001433] to-[#1261c9] shadow-lg shadow-blue-900/20">
            <MessageSquareText
              size={28}
              className="text-white"
            />
          </div>

          <div className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green-500">
            <CheckCircle2
              size={14}
              className="text-white"
            />
          </div>

        </div>
      </div>

      {/* Heading */}
      <div className="mb-7 text-center">

        <h1 className="text-[24px] font-bold tracking-tight text-[#001433]">
          Verify your number
        </h1>

        <p className="mt-2 text-sm leading-5 text-gray-500">
          We've sent a 6-digit OTP to
        </p>

        <p className="mt-1 text-sm font-semibold text-[#001433]">
          {maskedMobile}
        </p>
      </div>

      {/* OTP */}
      <div className="mb-6">

        <div className="flex justify-center gap-2.5 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] =
                  element;
              }}
              type="tel"
              inputMode="numeric"
              autoComplete={
                index === 0
                  ? "one-time-code"
                  : "off"
              }
              maxLength={1}
              value={digit}
              disabled={isLoading}
              onChange={(e) =>
                handleOtpChange(
                  index,
                  e.target.value
                )
              }
              onKeyDown={(e) =>
                handleKeyDown(
                  index,
                  e
                )
              }
              onPaste={handlePaste}
              className={`h-12 w-10 rounded-xl border text-center text-lg font-bold text-[#001433] outline-none transition-all sm:h-14 sm:w-12 ${
                digit
                  ? "border-[#1261c9] bg-blue-50/50 ring-2 ring-blue-100"
                  : "border-gray-200 bg-white focus:border-[#1261c9] focus:ring-4 focus:ring-blue-50"
              }`}
            />
          ))}
        </div>

        <p className="mt-3 text-center text-[11px] text-gray-400">
          Enter the OTP received on your mobile
        </p>
      </div>

      {/* Verify */}
      <button
        type="button"
        onClick={handleVerifyOtp}
        disabled={
          isLoading ||
          otp.join("").length !==
            OTP_LENGTH
        }
        className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#001433] to-[#1261c9] text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />
            <span>Verifying...</span>
          </>
        ) : (
          <>
            <ShieldCheck size={18} />
            <span>Verify & Continue</span>
          </>
        )}
      </button>

      {/* Resend */}
      <div className="mt-5 text-center">

        {resendTimer > 0 ? (
          <p className="text-xs text-gray-400">
            Didn't receive the OTP?{" "}
            <span className="font-semibold text-gray-500">
              Resend in {resendTimer}s
            </span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1261c9] hover:underline disabled:opacity-50"
          >
            <RefreshCw size={13} />
            Resend OTP
          </button>
        )}
      </div>

      {/* Security */}
      <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-400">
        <ShieldCheck size={13} />
        <span>Your verification is secure</span>
      </div>
    </div>
  );
};

export default OtpVerificationScreen;