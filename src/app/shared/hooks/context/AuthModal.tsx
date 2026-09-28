


import { X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { FaGoogle, FaGithub, FaTwitter, FaMicrosoft } from "react-icons/fa";
import { useAuth, useAuthModal } from "@/hooks/context/AuthContext";

import { sendOtpApi, verifyOtpApi } from "../../services/api/commonApiServices";

// ── Reusable Input ────────────────────────────────────────────────────────────

const Input = ({ id, type = "text", label, ...props }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1">
      <input
        id={id}
        name={id}
        type={type}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        {...props}
      />
    </div>
  </div>
);

// ── Profile completion form ───────────────────────────────────────────────────

const ProfileForm = ({ onClose }: { onClose: () => void }) => {
  const { updateProfile, dbUser } = useAuth(); 

   const [formData, setFormData] = useState({
    first_name: dbUser?.first_name || "",
    last_name:  dbUser?.last_name  || "",
    email:      dbUser?.email      || "",   // pre-filled if available
    mobile_no:  dbUser?.mobile_no  || "",
    gender_id:  dbUser?.gender_id  || "",
    dob:        dbUser?.dob        || "",
    location:   dbUser?.location   || "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (key: string) => (e: any) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const handlePhoneChange = (e: any) => {
    setFormData((prev) => ({ ...prev, mobile_no: e.target.value }));
    setOtpSent(false);
    setOtpVerified(false);
    setOtp("");
  };

  const sendOtp = async () => {
    if (!formData.mobile_no) return alert("Enter phone number first");
    try {
      setOtpLoading(true);
      await sendOtpApi({ phone: formData.mobile_no });
      setOtpSent(true);
    } catch {
      alert("Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");
    try {
      setOtpLoading(true);
      await verifyOtpApi({ phone: formData.mobile_no, otp });
      setOtpVerified(true);
    } catch {
      alert("Invalid OTP ❌");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitError("");
    const { first_name, last_name, email, mobile_no, gender_id, dob, location } = formData;
    if (!first_name || !last_name || !email || !mobile_no || !otpVerified || !gender_id || !dob || !location) {
      setSubmitError("Please complete all fields and verify your mobile number.");
      return;
    }
    try {
      await updateProfile(formData);
      onClose();
    } catch {
      setSubmitError("Failed to update profile. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="text-xl font-bold text-center">Complete Your Profile</h2>
      <p className="text-sm text-gray-500 text-center">Just a few more details to get started</p>

      {submitError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm text-center">{submitError}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Input id="first_name" label="First Name" value={formData.first_name} onChange={set("first_name")} />
        <Input id="last_name"  label="Last Name"  value={formData.last_name}  onChange={set("last_name")} />
      </div>

      <Input id="email" type="email" label="Email" value={formData.email} onChange={set("email")} />

      {/* Mobile + OTP */}
      <Input id="mobile_no" type="tel" label="Mobile Number" value={formData.mobile_no} onChange={handlePhoneChange} />

      {!otpSent && (
        <button type="button" onClick={sendOtp} disabled={otpLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md text-sm">
          {otpLoading ? "Sending..." : "Send OTP"}
        </button>
      )}

      {otpSent && !otpVerified && (
        <>
          <Input id="otp" label="Enter OTP" value={otp} onChange={(e: any) => setOtp(e.target.value)} />
          <button type="button" onClick={verifyOtp} disabled={otpLoading}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-md text-sm">
            {otpLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      {otpVerified && <p className="text-green-600 text-sm font-medium">✅ Mobile Verified</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Gender</label>
        <select value={formData.gender_id} onChange={set("gender_id")}
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500">
          <option value="">Select Gender</option>
          <option value="1">Male</option>
          <option value="2">Female</option>
        </select>
      </div>

      <Input id="dob" type="date" label="Date of Birth" value={formData.dob} onChange={set("dob")} />
      <Input id="location" label="Location" value={formData.location} onChange={set("location")} />

      <button type="submit"
        className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md">
        Save & Continue
      </button>
    </form>
  );
};

// ── Social login screen ───────────────────────────────────────────────────────

type SocialProvider = "google" | "microsoft" | "twitter" | "github" | "facebook";

const socialButtons: Array<{
  type: SocialProvider;
  icon: ReactNode;
  label: string;
  colorClass: string;
}> = [
  { type: "google",    icon: <FaGoogle />,    label: "Continue with Google",    colorClass: "bg-red-500 hover:bg-red-600" },
  { type: "microsoft", icon: <FaMicrosoft />, label: "Continue with Microsoft", colorClass: "bg-indigo-600 hover:bg-indigo-700" },
  { type: "twitter",   icon: <FaTwitter />,   label: "Continue with Twitter",   colorClass: "bg-sky-400 hover:bg-sky-500" },
  { type: "github",    icon: <FaGithub />,    label: "Continue with GitHub",    colorClass: "bg-gray-800 hover:bg-black" },
];

// ── Main AuthModal ────────────────────────────────────────────────────────────

export const AuthModal = () => {
  const { isModalOpen, closeModal } = useAuthModal();
  const { socialLogin, showProfileForm, socialAuthError, isAuthenticating } = useAuth();

  if (!isModalOpen) return null;

  // return (
  //   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50">
  //     <div className="relative w-full max-w-md p-8 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">

  //       <button onClick={closeModal}
  //         className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
  //         <X size={24} />
  //       </button>

  //       {showProfileForm ? (
  //         // ── Profile completion ──
  //         <ProfileForm onClose={closeModal} />
  //       ) : (
  //         // ── Social login buttons ──
  //         <div className="space-y-4">
  //           <div className="text-center mb-6">
  //             <h2 className="text-2xl font-bold">Welcome</h2>
  //             <p className="text-sm text-gray-500 mt-1">Sign in to continue</p>
  //           </div>

  //           <div className="flex flex-col gap-3">
  //             {socialButtons.map(({ type, icon, label, colorClass }) => (
  //               <div key={type}>
  //                 {/* ✅ onClick is a direct synchronous handler — no async wrapper here */}
  //                 <button
  //                   type="button"
  //                   disabled={isAuthenticating}
  //                   onClick={() => socialLogin(type)}
  //                   className={`w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-md text-sm font-medium text-white ${colorClass} disabled:opacity-50 disabled:cursor-not-allowed`}
  //                 >
  //                   {icon} {label}
  //                 </button>

  //                 {socialAuthError.provider === type && (
  //                   <p className="text-red-500 text-xs mt-1 text-center">
  //                     {socialAuthError.message}
  //                   </p>
  //                 )}
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // ); commented out on july2 for changing the design

  return (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 overflow-y-auto">
    <div
      className={`relative mx-5 w-full max-w-xl lg:max-w-2xl bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row`}
    >
      {/* ================= Left Logo ================= */}
      <div className="w-full bg-[#001433] h-24 md:min-h-[440px] md:rounded-r-full md:w-1/2 flex items-center justify-center p-6">
        <img
          src="/RUFRENT6.png"
          alt="logo"
          className="h-12 object-contain"
        />
      </div>

      {/* ================= Right Content ================= */}
      <div className="relative w-full md:w-1/2 p-6 flex flex-col justify-center items-center">

        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        {showProfileForm ? (
          <ProfileForm onClose={closeModal} />
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">
                Welcome
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Sign in to continue
              </p>
            </div>

            <div className="w-full flex flex-col gap-3">
              {socialButtons.map(({ type, icon, label, colorClass }) => (
                <div key={type}>
                  <button
                    type="button"
                    disabled={isAuthenticating}
                    onClick={() => socialLogin(type)}
                    className={`w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-md text-sm font-medium text-white transition ${colorClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {icon}
                    {label}
                  </button>

                  {socialAuthError.provider === type && (
                    <p className="text-red-500 text-xs mt-1 text-center">
                      {socialAuthError.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  </div>
);
};