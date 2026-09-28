import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  LogIn,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  sendMobileLoginOtpApi,
  verifyMobileLoginOtpApi,
  fetchUserRolesApi,
} from "@/app/shared/services/api/commonApiServices";

import { useRoleStore } from "../../store/roleStore";


/* ============================================================
   TYPES
============================================================ */

type LoginStep =
  | "mobile"
  | "otp";

interface RoleResponse {
  id?: number;
  role_id?: number;
  role?: string;
  role_name?: string;
  name?: string;
}


/* ============================================================
   ROLE → DASHBOARD
============================================================ */

const ROLE_PATHS: Record<string, string> = {
  resident: "/resident/dashboard",
  owner: "/owner/dashboard",
  manager: "/manager/dashboard",
  staff: "/staff/dashboard",
  admin: "/admin/dashboard",
};


/* ============================================================
   NORMALIZE ROLE
============================================================ */

const normalizeRole = (
  role: string | undefined | null
) => {
  return String(role || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, " ");
};


/* ============================================================
   LOGIN PAGE
============================================================ */

const LoginPage: React.FC = () => {

  const navigate = useNavigate();

  const { setUserData } = useRoleStore();

  const clearLoginToken = () => {
    localStorage.removeItem("pg_access_token");
  };

  const [step, setStep] =
    useState<LoginStep>("mobile");

  const [mobile, setMobile] =
    useState("");

  const [otp, setOtp] =
    useState([
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [countdown, setCountdown] =
    useState(0);

  const otpRefs =
    useRef<Array<HTMLInputElement | null>>([]);

  /* ==========================================================
     COUNTDOWN
  ========================================================== */

  useEffect(() => {

    if (countdown <= 0) {
      return;
    }

    const timer = setInterval(() => {

      setCountdown((value) =>
        value > 0 ? value - 1 : 0
      );

    }, 1000);

    return () => clearInterval(timer);

  }, [countdown]);


  /* ==========================================================
     CLEAR MESSAGE
  ========================================================== */

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };


  /* ==========================================================
     VALIDATE MOBILE
  ========================================================== */

  const validateMobile = () => {

    if (!mobile) {
      setError(
        "Please enter your mobile number."
      );

      return false;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {

      setError(
        "Please enter a valid 10 digit mobile number."
      );

      return false;
    }

    return true;
  };


  /* ==========================================================
     SEND OTP
  ========================================================== */

  const handleSendOtp = async () => {

    clearMessages();

    if (!validateMobile()) {
      return;
    }

    try {

      setLoading(true);

      const response =
        await sendMobileLoginOtpApi({
          phone: mobile,
        });

      if (!response.data?.success) {

        setError(
          response.data?.message ||
          "Unable to send OTP."
        );

        return;
      }

      setSuccess(
        "OTP sent successfully to your mobile number."
      );

      setStep("otp");

      setOtp([
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      setCountdown(30);

      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);

    } catch (err: any) {

      const message =
        err?.response?.data?.message ||
        "Unable to send OTP. Please try again.";

      setError(message);

    } finally {

      setLoading(false);
    }
  };


  /* ==========================================================
     OTP INPUT
  ========================================================== */

  const handleOtpChange = (
    index: number,
    value: string
  ) => {

    const digit =
      value.replace(/\D/g, "").slice(-1);

    const updated = [...otp];

    updated[index] = digit;

    setOtp(updated);

    if (
      digit &&
      index < otp.length - 1
    ) {
      otpRefs.current[index + 1]?.focus();
    }
  };


  /* ==========================================================
     OTP KEY DOWN
  ========================================================== */

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {

    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {

      otpRefs.current[index - 1]?.focus();
    }
  };


  /* ==========================================================
     PASTE OTP
  ========================================================== */

  const handleOtpPaste = (
    event: React.ClipboardEvent
  ) => {

    event.preventDefault();

    const pasted =
      event.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);

    if (!pasted) {
      return;
    }

    const updated = [
      "",
      "",
      "",
      "",
      "",
      "",
    ];

    pasted
      .split("")
      .forEach((digit, index) => {
        updated[index] = digit;
      });

    setOtp(updated);

    const nextIndex =
      Math.min(pasted.length, 5);

    setTimeout(() => {
      otpRefs.current[nextIndex]?.focus();
    }, 50);
  };


  

  /* ==========================================================
   VERIFY OTP
========================================================== */

const handleVerifyOtp = async () => {
  clearMessages();

  const otpValue = otp.join("");

  if (otpValue.length !== 6) {
    setError(
      "Please enter the complete 6 digit OTP."
    );
    return;
  }

  try {
    setLoading(true);

    /* ======================================================
       STEP 1
       VERIFY MOBILE OTP
    ====================================================== */

    const response =
      await verifyMobileLoginOtpApi({
        phone: mobile,
        otp: otpValue,
      });

    const data = response.data;

    if (!data?.success || !data?.token) {
      setError(
        data?.message ||
        "OTP verification failed."
      );

      return;
    }

    /* ======================================================
       STEP 2
       SAVE APPLICATION JWT

       Backend returns:

       data.token

       axiosInstance expects:

       localStorage["pg_access_token"]

       Save it BEFORE calling fetchUserRolesApi().
    ====================================================== */

    localStorage.setItem("pg_access_token", data.token);

    console.log(
      "Application JWT saved successfully"
    );

    /* ======================================================
       STEP 3
       FETCH USER ROLES

       This request will now automatically receive:

       Authorization: Bearer <application-jwt>
    ====================================================== */

    const rolesResponse =
      await fetchUserRolesApi({
        user_id: data.user.id,
      });

    console.log(
      "User Roles:",
      rolesResponse
    );

    /* ======================================================
       STEP 4
       EXTRACT ROLES
    ====================================================== */

    const roles: RoleResponse[] =
      rolesResponse || [];

    if (!roles.length) {
      clearLoginToken();

      setError(
        "No role is assigned to this account. Please contact the administrator."
      );

      return;
    }

    /* ======================================================
       STEP 5
       GET ASSIGNED ROLE
    ====================================================== */

    const assignedRole =
      roles[0];

    const role =
      assignedRole.role ||
      assignedRole.role_name ||
      assignedRole.name ||
      "";

    const normalizedRole =
      normalizeRole(role);

    console.log(
      "Assigned Role:",
      role
    );

    console.log(
      "Normalized Role:",
      normalizedRole
    );

    /* ======================================================
       STEP 6
       ROLE → DASHBOARD
    ====================================================== */

    const dashboardPath =
      ROLE_PATHS[normalizedRole];

    if (!dashboardPath) {
      clearLoginToken();

      setError(
        `Your account has the role "${role}", but no dashboard is configured for it.`
      );

      return;
    }

    /* ======================================================
       STEP 7
       STORE USER
    ====================================================== */

    await setUserData({
      id: data.user.id,

      role: normalizedRole,

      userName:
        `${data.user.first_name || ""} ${
          data.user.last_name || ""
        }`.trim() || "User",
    });

    /* ======================================================
       STEP 8
       SUCCESS
    ====================================================== */

    setSuccess(
      "Login successful. Redirecting..."
    );

    setTimeout(() => {
      navigate(
        dashboardPath,
        {
          replace: true,
        }
      );
    }, 300);

  } catch (err: any) {

    console.error(
      "OTP verification error:",
      err
    );

    const message =
      err?.response?.data?.message ||
      "Invalid OTP. Please try again.";

    setError(message);

  } finally {
    setLoading(false);
  }
};


  /* ==========================================================
     RESEND OTP
  ========================================================== */

  const handleResendOtp = async () => {

    if (countdown > 0 || loading) {
      return;
    }

    await handleSendOtp();
  };


  /* ==========================================================
     CHANGE MOBILE
  ========================================================== */

  const handleChangeMobile = () => {

    clearMessages();

    setStep("mobile");

    setOtp([
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    setCountdown(0);
  };


  /* ==========================================================
     RENDER
  ========================================================== */

  return (

    <div className="
      min-h-screen
      w-full
      bg-[#F6F8FC]
      flex
      items-center
      justify-center
      px-4
      py-8
    ">

      <div className="
        w-full
        max-w-[1050px]
        min-h-[620px]
        bg-white
        rounded-3xl
        overflow-hidden
        shadow-[0_25px_80px_rgba(0,20,51,0.14)]
        grid
        lg:grid-cols-2
      ">


        {/* ====================================================
            LEFT BRAND PANEL
        ==================================================== */}

        <div className="
          hidden
          lg:flex
          relative
          overflow-hidden
          bg-[#001433]
          p-12
          flex-col
          justify-between
        ">

          {/* Decorative circles */}

          <div className="
            absolute
            -top-32
            -right-32
            w-80
            h-80
            rounded-full
            bg-white/5
          " />

          <div className="
            absolute
            -bottom-40
            -left-32
            w-96
            h-96
            rounded-full
            bg-white/5
          " />


          {/* Logo */}

          <div className="relative z-10">

            <img
              src="/RUFRENT6.png"
              alt="Rufrent"
              className="h-12 object-contain"
            />

            <div className="
              mt-2
              text-white/60
              text-xs
              tracking-[0.35em]
              uppercase
            ">
              Smart PG Management
            </div>

          </div>


          {/* Main text */}

          <div className="
            relative
            z-10
            max-w-md
          ">

            <div className="
              w-14
              h-14
              rounded-2xl
              bg-white/10
              border
              border-white/10
              flex
              items-center
              justify-center
              mb-7
            ">

              <ShieldCheck
                className="text-white"
                size={28}
              />

            </div>

            <h1 className="
              text-4xl
              xl:text-5xl
              font-bold
              text-white
              leading-tight
            ">

              Welcome back.

            </h1>

            <p className="
              mt-5
              text-white/60
              text-base
              leading-7
            ">

              Access your PG dashboard securely
              using your registered mobile number.
              No passwords. No complicated login.

            </p>


            {/* Features */}

            <div className="
              mt-8
              space-y-4
            ">

              <div className="
                flex
                items-center
                gap-3
                text-white/80
                text-sm
              ">

                <CheckCircle2
                  size={18}
                  className="text-emerald-400"
                />

                Secure OTP authentication

              </div>

              <div className="
                flex
                items-center
                gap-3
                text-white/80
                text-sm
              ">

                <CheckCircle2
                  size={18}
                  className="text-emerald-400"
                />

                Role-based dashboard access

              </div>

              <div className="
                flex
                items-center
                gap-3
                text-white/80
                text-sm
              ">

                <CheckCircle2
                  size={18}
                  className="text-emerald-400"
                />

                Fast and passwordless

              </div>

            </div>

          </div>


          {/* Footer */}

          <div className="
            relative
            z-10
            text-xs
            text-white/40
          ">

            © {new Date().getFullYear()} Rufrent

          </div>

        </div>


        {/* ====================================================
            RIGHT LOGIN PANEL
        ==================================================== */}

        <div className="
          flex
          flex-col
          justify-center
          px-6
          sm:px-10
          lg:px-14
          py-10
        ">

          {/* Mobile logo */}

          <div className="
            lg:hidden
            flex
            justify-center
            mb-10
          ">

            <img
              src="/RUFRENT6.png"
              alt="Rufrent"
              className="h-11"
            />

          </div>


          {/* Header */}

          <div className="mb-8">

            <div className="
              inline-flex
              items-center
              justify-center
              w-12
              h-12
              rounded-2xl
              bg-[#001433]/5
              mb-5
            ">

              {step === "mobile" ? (

                <Smartphone
                  size={24}
                  className="text-[#001433]"
                />

              ) : (

                <LockKeyhole
                  size={24}
                  className="text-[#001433]"
                />

              )}

            </div>


            <h2 className="
              text-3xl
              font-bold
              text-[#001433]
            ">

              {step === "mobile"
                ? "Sign in"
                : "Verify OTP"}

            </h2>


            <p className="
              mt-2
              text-gray-500
              text-sm
              leading-6
            ">

              {step === "mobile"
                ? "Enter your registered mobile number to continue."
                : `We've sent a 6-digit OTP to +91 ${mobile}`}

            </p>

          </div>


          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (

            <div className="
              mb-5
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-600
            ">

              {error}

            </div>

          )}


          {/* ==================================================
              SUCCESS
          ================================================== */}

          {success && (

            <div className="
              mb-5
              rounded-xl
              border
              border-emerald-200
              bg-emerald-50
              px-4
              py-3
              text-sm
              text-emerald-700
              flex
              items-center
              gap-2
            ">

              <CheckCircle2
                size={17}
              />

              {success}

            </div>

          )}


          {/* ==================================================
              MOBILE STEP
          ================================================== */}

          {step === "mobile" && (

            <div>

              <label className="
                block
                text-sm
                font-semibold
                text-gray-700
                mb-2
              ">

                Mobile number

              </label>


              <div className="
                flex
                items-center
                border
                border-gray-200
                rounded-2xl
                bg-gray-50
                focus-within:bg-white
                focus-within:border-[#001433]
                focus-within:ring-4
                focus-within:ring-[#001433]/5
                transition
                overflow-hidden
              ">

                <div className="
                  px-4
                  text-sm
                  font-semibold
                  text-gray-600
                  border-r
                  border-gray-200
                ">

                  +91

                </div>


                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => {

                    const value =
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

                    setMobile(value);

                    if (error) {
                      setError("");
                    }

                  }}
                  onKeyDown={(e) => {

                    if (
                      e.key === "Enter"
                    ) {
                      handleSendOtp();
                    }

                  }}
                  placeholder="Enter mobile number"
                  className="
                    flex-1
                    bg-transparent
                    outline-none
                    px-4
                    py-4
                    text-base
                    text-gray-800
                  "
                />

              </div>


              <button
                type="button"
                onClick={handleSendOtp}
                disabled={
                  loading ||
                  mobile.length !== 10
                }
                className="
                  mt-5
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-[#001433]
                  hover:bg-[#002052]
                  disabled:bg-gray-300
                  disabled:cursor-not-allowed
                  text-white
                  py-4
                  font-semibold
                  transition-all
                  shadow-lg
                  shadow-[#001433]/15
                "
              >

                {loading ? (

                  <>
                    <RefreshCw
                      size={18}
                      className="animate-spin"
                    />

                    Sending OTP...

                  </>

                ) : (

                  <>
                    Send OTP

                    <ArrowRight
                      size={18}
                    />

                  </>

                )}

              </button>


              <div className="
                mt-8
                flex
                items-center
                justify-center
                gap-2
                text-xs
                text-gray-400
              ">

                <ShieldCheck
                  size={15}
                />

                Your login is secured with OTP

              </div>

            </div>
          )}


          {/* ==================================================
              OTP STEP
          ================================================== */}

          {step === "otp" && (

            <div>

              <div
                className="
                  flex
                  justify-center
                  gap-2
                  sm:gap-3
                  mb-6
                "
                onPaste={handleOtpPaste}
              >

                {otp.map(
                  (digit, index) => (

                    <input
                      key={index}
                      ref={(element) => {
                        otpRefs.current[index] =
                          element;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={
                        index === 0
                          ? "one-time-code"
                          : "off"
                      }
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(
                          index,
                          e.target.value
                        )
                      }
                      onKeyDown={(e) =>
                        handleOtpKeyDown(
                          index,
                          e
                        )
                      }
                      className="
                        w-11
                        h-14
                        sm:w-12
                        sm:h-14
                        text-center
                        text-xl
                        font-bold
                        text-[#001433]
                        border
                        border-gray-200
                        rounded-xl
                        bg-gray-50
                        outline-none
                        focus:bg-white
                        focus:border-[#001433]
                        focus:ring-4
                        focus:ring-[#001433]/5
                        transition
                      "
                    />

                  )
                )}

              </div>


              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={
                  loading ||
                  otp.join("").length !== 6
                }
                className="
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-[#001433]
                  hover:bg-[#002052]
                  disabled:bg-gray-300
                  disabled:cursor-not-allowed
                  text-white
                  py-4
                  font-semibold
                  transition-all
                  shadow-lg
                  shadow-[#001433]/15
                "
              >

                {loading ? (

                  <>
                    <RefreshCw
                      size={18}
                      className="animate-spin"
                    />

                    Verifying...

                  </>

                ) : (

                  <>
                    Verify & Continue

                    <ArrowRight
                      size={18}
                    />

                  </>

                )}

              </button>


              {/* Resend */}

              <div className="
                flex
                justify-center
                mt-5
              ">

                {countdown > 0 ? (

                  <p className="
                    text-sm
                    text-gray-400
                  ">

                    Resend OTP in{" "}

                    <span className="
                      font-semibold
                      text-[#001433]
                    ">

                      {countdown}s

                    </span>

                  </p>

                ) : (

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="
                      text-sm
                      font-semibold
                      text-[#001433]
                      hover:underline
                    "
                  >

                    Resend OTP

                  </button>

                )}

              </div>


              {/* Change number */}

              <button
                type="button"
                onClick={handleChangeMobile}
                disabled={loading}
                className="
                  mx-auto
                  mt-6
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-gray-500
                  hover:text-[#001433]
                  transition
                "
              >

                <ArrowLeft
                  size={16}
                />

                Change mobile number

              </button>


              <div className="
                mt-8
                flex
                justify-center
                gap-2
                text-xs
                text-gray-400
              ">

                <MessageSquare
                  size={14}
                />

                Didn't receive the OTP?

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default LoginPage;