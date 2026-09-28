import React, { useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  LockKeyhole,
  Phone,
  ShieldCheck,
} from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL as string;

interface MobileLoginScreenProps {
  onOtpSent: (phone: string) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  displayMessage: (
    type: "success" | "error",
    text: string
  ) => void;
}

const MobileLoginScreen: React.FC<MobileLoginScreenProps> = ({
  onOtpSent,
  isLoading,
  setIsLoading,
  displayMessage,
}) => {
  const [mobileNumber, setMobileNumber] = useState("");

  const isValidMobile = /^[6-9]\d{9}$/.test(mobileNumber);

  const handleMobileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 10);

    setMobileNumber(value);
  };

  const handleSendOtp = async () => {
    if (!isValidMobile) {
      displayMessage(
        "error",
        "Please enter a valid 10 digit mobile number."
      );
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
        displayMessage(
          "success",
          "OTP sent successfully."
        );

        onOtpSent(mobileNumber);
      } else {
        displayMessage(
          "error",
          response.data?.message ||
            "Unable to send OTP."
        );
      }
    } catch (error: any) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message;

      if (status === 404) {
        displayMessage(
          "error",
          "You don't have permission to login."
        );
      } else {
        displayMessage(
          "error",
          message ||
            "Unable to send OTP. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">

      {/* Header */}
      <div className="mb-7 text-center">

        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#001433] to-[#1261c9] shadow-lg shadow-blue-900/20">
          <Phone
            size={28}
            strokeWidth={2}
            className="text-white"
          />
        </div>

        <h1 className="text-[25px] font-bold tracking-tight text-[#001433]">
          Welcome back
        </h1>

        <p className="mt-2 text-sm leading-5 text-gray-500">
          Enter your registered mobile number
          <br />
          to securely access Rufrent.
        </p>
      </div>

      {/* Mobile input */}
      <div className="mb-5">

        <label
          htmlFor="mobileNumber"
          className="mb-2 block text-xs font-semibold text-gray-600"
        >
          Mobile Number
        </label>

        <div
          className={`flex h-[52px] overflow-hidden rounded-xl border bg-white transition-all ${
            mobileNumber.length > 0
              ? "border-[#1261c9] ring-4 ring-blue-50"
              : "border-gray-200"
          }`}
        >

          {/* Country */}
          <div className="flex w-[70px] shrink-0 items-center justify-center border-r border-gray-200 bg-gray-50">
            <span className="mr-1.5 text-lg">
              🇮🇳
            </span>

            <span className="text-sm font-semibold text-gray-700">
              +91
            </span>
          </div>

          {/* Number */}
          <input
            id="mobileNumber"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="Enter mobile number"
            value={mobileNumber}
            onChange={handleMobileChange}
            maxLength={10}
            disabled={isLoading}
            className="min-w-0 flex-1 bg-transparent px-4 text-[15px] font-medium text-gray-800 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
          />

          {isValidMobile && (
            <div className="flex items-center pr-4">
              <ShieldCheck
                size={19}
                className="text-green-500"
              />
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between px-1">
          <span className="text-[11px] text-gray-400">
            10 digit Indian mobile number
          </span>

          <span className="text-[11px] font-medium text-gray-400">
            {mobileNumber.length}/10
          </span>
        </div>
      </div>

      {/* Send OTP */}
      <button
        type="button"
        onClick={handleSendOtp}
        disabled={isLoading}
        className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#001433] to-[#1261c9] text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition-all duration-200 hover:shadow-xl hover:shadow-blue-900/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <span>Checking number...</span>
          </>
        ) : (
          <>
            <span>Send OTP</span>

            <ArrowRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </>
        )}
      </button>

      {/* Security information */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-3.5">

        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
          <LockKeyhole
            size={15}
            className="text-[#1261c9]"
          />
        </div>

        <div>
          <p className="text-xs font-semibold text-[#001433]">
            Secure login
          </p>

          <p className="mt-0.5 text-[11px] leading-4 text-gray-500">
            Only registered Rufrent users can
            access the dashboard. We will send
            a one-time password to your mobile.
          </p>
        </div>
      </div>

      <p className="mt-5 text-center text-[10px] leading-4 text-gray-400">
        By continuing, you confirm that this
        mobile number belongs to you.
      </p>
    </div>
  );
};

export default MobileLoginScreen;