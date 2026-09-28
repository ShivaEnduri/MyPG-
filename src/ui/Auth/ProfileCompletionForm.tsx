import { useState } from "react";

const Input = ({ id, type = "text", label, ...props }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="mt-1">
      <input
        id={id} name={id} type={type}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        {...props}
      />
    </div>
  </div>
);

interface ProfileCompletionFormProps {
  dbUser: any;
  updateProfile: (formData: any) => Promise<void>;
  sendOtp: (payload: { phone: string }) => Promise<any>;
  verifyOtp: (payload: { phone: string; otp: string }) => Promise<any>;
  onClose: () => void;
}

const ProfileCompletionForm = ({
  dbUser,
  updateProfile,
  sendOtp,
  verifyOtp,
  onClose,
}: ProfileCompletionFormProps) => {
  const [formData, setFormData] = useState({
    first_name: dbUser?.first_name || "",
    last_name:  dbUser?.last_name  || "",
    email:      dbUser?.email      || "",
    mobile_no:  dbUser?.mobile_no  || "",
    gender_id:  dbUser?.gender_id  || "",
    dob:        dbUser?.dob        || "",
    location:   dbUser?.location   || "",
  });

  const [otp, setOtp]               = useState("");
  const [otpSent, setOtpSent]       = useState(false);
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

  const handleSendOtp = async () => {
    if (!formData.mobile_no) return alert("Enter phone number first");
    try {
      setOtpLoading(true);
      await sendOtp({ phone: formData.mobile_no });
      setOtpSent(true);
    } catch {
      alert("Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert("Enter OTP");
    try {
      setOtpLoading(true);
      await verifyOtp({ phone: formData.mobile_no, otp });
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
    <form onSubmit={handleSubmit} className="w-full space-y-3">
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
      <Input id="mobile_no" type="tel" label="Mobile Number" value={formData.mobile_no} onChange={handlePhoneChange} />

      {!otpSent && (
        <button type="button" onClick={handleSendOtp} disabled={otpLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md text-sm">
          {otpLoading ? "Sending..." : "Send OTP"}
        </button>
      )}

      {otpSent && !otpVerified && (
        <>
          <Input id="otp" label="Enter OTP" value={otp} onChange={(e: any) => setOtp(e.target.value)} />
          <button type="button" onClick={handleVerifyOtp} disabled={otpLoading}
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

export default ProfileCompletionForm;