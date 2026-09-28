// src/pages/AddGuest.tsx
import React, { FC, useEffect, useState } from "react";

// --- Type Definitions ---

/** Defines the structure of the guest creation form state. */
interface GuestForm {
  fullName: string;
  dob: string;
  idFiles: File[]; // Use File type for file inputs before processing
  email: string;
  mobile: string;
  altPhone: string;
  emergencyName: string;
  emergencyPhone: string;
  currentAddress: string;
  permanentAddress: string;
  username: string;
  password: string;
  forceChangeOnFirstLogin: boolean;
}

/** Defines the structure of the payload sent to the onSubmit handler. */
interface GuestPayload extends Omit<GuestForm, 'idFiles'> {
  idFiles: string[]; // File names array in the final payload
  draft: boolean;
}

/** Props for the AddGuestModal component. */
interface AddGuestModalProps {
  open: boolean;
  onClose?: () => void;
  onSubmit?: (payload: GuestPayload) => void;
}

/** Props for simple component wrappers. */
interface SimpleComponentProps {
  children: React.ReactNode;
}

/** Props for input components. */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

/** Props for character counter. */
interface CharacterCounterProps {
  value: string;
  maxLength: number;
}

// --- Helper Icons & Components (Defined outside to prevent re-renders) ---

const EyeIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeSlashIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.75 9.75" />
  </svg>
);

const SectionTitle: FC<SimpleComponentProps> = ({ children }) => <h3 className="text-sm font-semibold text-gray-900 mb-3">{children}</h3>;
const Label: FC<SimpleComponentProps> = ({ children }) => <span className="text-gray-700 text-sm">{children}</span>;

// Input component explicitly typed as a functional component that accepts input props
const Input: FC<InputProps> = (props) => (
  <input {...props} className={`mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#3D63EA] ${props.className || ''}`} />
);

// Textarea component explicitly typed
const Textarea: FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea {...props} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#3D63EA]" />
);

const CharacterCounter: FC<CharacterCounterProps> = ({ value, maxLength }) => (
  <div className="text-xs text-right text-gray-500 mt-1">{value.length} / {maxLength}</div>
);

// --- Main Modal Component ---

const AddGuestModal: FC<AddGuestModalProps> = ({ open, onClose, onSubmit }) => {
  const initialForm: GuestForm = {
    fullName: "", dob: "", idFiles: [],
    email: "", mobile: "", altPhone: "", emergencyName: "", emergencyPhone: "",
    currentAddress: "", permanentAddress: "",
    username: "", password: "", forceChangeOnFirstLogin: true,
  };

  // State initialization with explicit typing
  const [form, setForm] = useState<GuestForm>(initialForm);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps: number = 4;
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    // Type e as KeyboardEvent
    function onKey(e: KeyboardEvent): void { if (e.key === "Escape") onClose?.(); }
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const isStepValid = (): boolean => {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Basic international phone number regex (1-15 digits, optional '+' prefix)
    const mobileRegex: RegExp = /^\+?[1-9]\d{1,14}$/; 
    // Requires at least 8 characters, one letter, one digit, one special character
    const passwordRegex: RegExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    switch (currentStep) {
      case 1:
        // Validate required fields for Step 1
        return form.fullName.trim() !== "" && form.dob.trim() !== "" && form.idFiles.length > 0;
      case 2:
        // Validate required fields for Step 2
        return emailRegex.test(form.email) && mobileRegex.test(form.mobile);
      case 3:
        // Validate required fields for Step 3
        return form.currentAddress.trim() !== "" && form.permanentAddress.trim() !== "";
      case 4:
        // Validate required fields for Step 4
        return form.username.trim() !== "" && passwordRegex.test(form.password);
      default:
        return false;
    }
  };

  if (!open) return null;

  // Function to update form state with optional length check
  const update = (key: keyof GuestForm, value: string | boolean, maxLength?: number): void => {
    if (typeof value === 'string') {
      if (maxLength === undefined || value.length <= maxLength) {
        // Use type assertion for dynamic key update
        setForm(f => ({ ...f, [key]: value } as GuestForm));
      }
    } else {
      setForm(f => ({ ...f, [key]: value }));
    }
  };

  // Handler for file input change
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files) {
      setForm(s => ({ ...s, idFiles: [...s.idFiles, ...Array.from(files)] }));
    }
  };

  const removeFile = (idx: number): void => setForm(s => ({ ...s, idFiles: s.idFiles.filter((_, i) => i !== idx) }));

  const nextStep = (): void => { if (isStepValid()) setCurrentStep(p => p + 1); };
  const prevStep = (): void => setCurrentStep(p => p - 1);

  // Function to prepare the final data payload
  const processPayload = (draft: boolean): GuestPayload => {
    return {
      fullName: form.fullName,
      dob: form.dob,
      email: form.email,
      mobile: form.mobile,
      altPhone: form.altPhone,
      emergencyName: form.emergencyName,
      emergencyPhone: form.emergencyPhone,
      currentAddress: form.currentAddress,
      permanentAddress: form.permanentAddress,
      username: form.username,
      password: form.password,
      forceChangeOnFirstLogin: form.forceChangeOnFirstLogin,
      // Map File objects to their names for the payload
      idFiles: form.idFiles.map(f => f.name), 
      draft: draft,
    };
  };

  // Submit handler
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!isStepValid()) return;
    onSubmit?.(processPayload(false));
    onClose?.();
  };

  const handleSaveDraft = (): void => {
    onSubmit?.(processPayload(true));
    onClose?.();
  };

  // Styling constants
  const baseButtonStyles: string = "px-4 py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";
  const primaryButtonStyles: string = "bg-[#605BFF] text-white hover:bg-[#5048e6] disabled:bg-gray-300 disabled:cursor-not-allowed";
  const secondaryButtonStyles: string = "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 focus:ring-gray-400";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog">
      <form onSubmit={handleSubmit} className="w-full max-w-4xl rounded-2xl bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">New Guest</h2>
          <button type="button" onClick={onClose} className="h-9 w-9 grid place-items-center rounded-full hover:bg-gray-100"><svg viewBox="0 0 20 20" className="h-5 w-5"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" /></svg></button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-6 py-5 space-y-6">
          {currentStep === 1 && (
            <section>
              <SectionTitle>Step 1: Personal Information</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <Label>Full name *</Label>
                  <Input 
                    value={form.fullName} 
                    onChange={e => update("fullName", e.target.value)} 
                    placeholder="John Doe" 
                  />
                </label>
                <label>
                  <Label>Date of birth *</Label>
                  <Input 
                    type="date" 
                    value={form.dob} 
                    onChange={e => update("dob", e.target.value)} 
                  />
                </label>
                <div className="sm:col-span-2">
                  <Label>Photo ID upload (Aadhaar, passport, license) *</Label>
                  <div className="mt-1 rounded-lg border border-dashed border-gray-300 p-4">
                    <label className="flex cursor-pointer items-center gap-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#6b6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <span className="text-sm text-gray-600">Upload ID documents</span>
                      <input type="file" multiple accept=".pdf,image/*" onChange={handleFile} className="hidden" />
                    </label>
                    {form.idFiles.length > 0 && 
                      <div className="mt-3 grid grid-cols-1 gap-2">
                        {form.idFiles.map((f, i) => (
                          <div key={i} className="flex items-center justify-between gap-3 rounded bg-gray-50 px-3 py-2">
                            <div className="truncate text-sm">{f.name}</div>
                            <button type="button" onClick={() => removeFile(i)} className="text-sm text-red-500">Remove</button>
                          </div>
                        ))}
                      </div>
                    }
                  </div>
                </div>
              </div>
            </section>
          )}

          {currentStep === 2 && (
            <section>
              <SectionTitle>Step 2: Contact Details</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <Label>Primary email address *</Label>
                  <Input 
                    type="email" 
                    value={form.email} 
                    onChange={e => update("email", e.target.value)} 
                    placeholder="guest@example.com" 
                  />
                </label>
                <label>
                  <Label>Mobile number *</Label>
                  <Input 
                    value={form.mobile} 
                    onChange={e => update("mobile", e.target.value)} 
                    placeholder="+91 9XXXXXXXXX" 
                  />
                </label>
                <label>
                  <Label>Alternate phone</Label>
                  <Input 
                    value={form.altPhone} 
                    onChange={e => update("altPhone", e.target.value)} 
                  />
                </label>
                <label>
                  <Label>Emergency contact name</Label>
                  <Input 
                    value={form.emergencyName} 
                    onChange={e => update("emergencyName", e.target.value)} 
                  />
                </label>
                <div className="sm:col-span-2">
                  <label>
                    <Label>Emergency contact phone</Label>
                    <Input 
                      value={form.emergencyPhone} 
                      onChange={e => update("emergencyPhone", e.target.value)} 
                    />
                  </label>
                </div>
              </div>
            </section>
          )}
          
          {currentStep === 3 && (
            <section>
              <SectionTitle>Step 3: Address</SectionTitle>
              <div className="grid gap-4">
                <div>
                  <Label>Current residential address *</Label>
                  <Textarea 
                    value={form.currentAddress} 
                    onChange={e => update("currentAddress", e.target.value, 150)} 
                    rows={3} 
                  />
                  <CharacterCounter value={form.currentAddress} maxLength={150} />
                </div>
                <div>
                  <Label>Permanent address *</Label>
                  <Textarea 
                    value={form.permanentAddress} 
                    onChange={e => update("permanentAddress", e.target.value, 150)} 
                    rows={3} 
                  />
                  <CharacterCounter value={form.permanentAddress} maxLength={150} />
                </div>
              </div>
            </section>
          )}
          
          {currentStep === 4 && (
            <section>
              <SectionTitle>Step 4: Login & Access</SectionTitle>
              <div className="space-y-4">
                <label>
                  <Label>Desired username *</Label>
                  <Input 
                    value={form.username} 
                    onChange={e => update("username", e.target.value)} 
                    placeholder="username" 
                  />
                </label>
                <div>
                  <Label>Initial password *</Label>
                  <div className="relative mt-1">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      value={form.password} 
                      onChange={e => update("password", e.target.value)} 
                      className="pr-10" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(s => !s)} 
                      className="absolute inset-y-0 right-0 grid place-content-center px-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">8+ chars, letters, numbers & special character.</p>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    id="forceChange" 
                    type="checkbox" 
                    checked={form.forceChangeOnFirstLogin} 
                    // Explicitly type change event for checkbox
                    onChange={e => update("forceChangeOnFirstLogin", e.target.checked)} 
                    className="h-4 w-4 rounded" 
                  />
                  <label htmlFor="forceChange" className="text-sm text-gray-700">Require change on first login</label>
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t mt-auto">
          <button type="button" onClick={onClose} className={`${baseButtonStyles} ${secondaryButtonStyles}`}>Cancel</button>
          <button type="button" onClick={handleSaveDraft} className={`${baseButtonStyles} ${secondaryButtonStyles}`}>Save Draft</button>
          {currentStep > 1 && <button type="button" onClick={prevStep} className={`${baseButtonStyles} ${secondaryButtonStyles}`}>Back</button>}
          {currentStep < totalSteps && <button type="button" onClick={nextStep} disabled={!isStepValid()} className={`${baseButtonStyles} ${primaryButtonStyles}`}>Next</button>}
          {currentStep === totalSteps && <button type="submit" disabled={!isStepValid()} className={`${baseButtonStyles} ${primaryButtonStyles}`}>Create Guest</button>}
        </div>
      </form>
    </div>
  );
}

export default AddGuestModal;