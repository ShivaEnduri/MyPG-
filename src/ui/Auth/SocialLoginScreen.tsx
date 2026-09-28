import { FaGoogle, FaGithub, FaTwitter, FaMicrosoft } from "react-icons/fa";

const socialButtons = [
  { type: "google",    icon: <FaGoogle />,    label: "Continue with Google",    colorClass: "bg-red-500 hover:bg-red-600" },
  { type: "microsoft", icon: <FaMicrosoft />, label: "Continue with Microsoft", colorClass: "bg-indigo-600 hover:bg-indigo-700" },
  { type: "twitter",   icon: <FaTwitter />,   label: "Continue with Twitter",   colorClass: "bg-sky-400 hover:bg-sky-500" },
  { type: "github",    icon: <FaGithub />,    label: "Continue with GitHub",    colorClass: "bg-gray-800 hover:bg-black" },
];

interface SocialLoginScreenProps {
  socialLogin: (type: string) => void;
  socialAuthError: { provider: string; message: string };
  isAuthenticating: boolean;
}

const SocialLoginScreen = ({
  socialLogin,
  socialAuthError,
  isAuthenticating,
}: SocialLoginScreenProps) => (
  <div className="w-full space-y-4">
    <div className="text-center mb-4">
      <h2 className="text-2xl font-bold">Welcome</h2>
      <p className="text-sm text-gray-500 mt-1">Sign in to continue</p>
    </div>

    <div className="flex flex-col gap-3">
      {socialButtons.map(({ type, icon, label, colorClass }) => (
        <div key={type}>
          <button
            type="button"
            disabled={isAuthenticating}
            onClick={() => socialLogin(type)}
            className={`w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-md text-sm font-medium text-white ${colorClass} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {icon} {label}
          </button>

          {socialAuthError.provider === type && (
            <p className="text-red-500 text-xs mt-1 text-center">
              {socialAuthError.message}
            </p>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default SocialLoginScreen;