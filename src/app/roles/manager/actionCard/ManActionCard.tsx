import { ChangeEvent, FC, FocusEvent, FormEvent, KeyboardEvent, ReactNode, useEffect, useState } from "react";

// --- 1. Interface Definitions ---

interface AccessLevels {
  dashboard: boolean;
  alerts: boolean;
  financial: boolean;
}

interface ModulePerms {
  maintenance: boolean;
  tenants: boolean;
  inventory: boolean;
  ticketsApprove: boolean;
}

interface ManagerForm {
  // Step 1
  fullName: string;
  dob: string;
  idType: string;
  idFile: File | null;
  // Step 2
  email: string;
  mobile: string;
  altPhone: string;
  emergencyName: string;
  emergencyPhone: string;
  // Step 3
  currentAddress: string;
  permanentAddress: string;
  // Step 4
  designation: string;
  joiningDate: string;
  experience: string;
  certifications: string;
  certificationFile: File | null;
  // Step 5
  username: string;
  password: string;
  forcePasswordChange: boolean;
  accessLevels: AccessLevels;
  modulePerms: ModulePerms;
  // Step 6
  policeReport: File | null;
  backgroundDocs: File | null;
  ndaFile: File | null;
  // Step 7
  bankAccount: string;
  ifsc: string;
  pan: string;
  taxForm: File | null;
  // Step 8
  workingHours: string;
  languages: string;
}

// Payload sent to parent (Files converted to names/strings based on logic in original JS)
type ManagerPayload = Omit<ManagerForm, 'idFile' | 'certificationFile' | 'policeReport' | 'backgroundDocs' | 'ndaFile' | 'taxForm'> & {
  idFile: string | null;
  certificationFile: string | null;
  policeReport: string | null;
  backgroundDocs: string | null;
  ndaFile: string | null;
  taxForm: string | null;
};

interface AddManagerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ManagerPayload) => void;
}

// --- 2. Helper Icons & Components ---

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

const SectionTitle: FC<{ children: ReactNode }> = ({ children }) => <h3 className="text-sm font-semibold text-gray-900 mb-3">{children}</h3>;
const Label: FC<{ children: ReactNode }> = ({ children }) => <span className="text-xs text-gray-600">{children}</span>;

const Input: FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className={`mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#3D63EA] ${props.className || ''}`} />
);

const Textarea: FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea {...props} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#3D63EA]" />
);

const Select: FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select {...props} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#3D63EA]" />
);

interface StyledFileInputProps {
  required?: boolean;
  file: File | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const StyledFileInput: FC<StyledFileInputProps> = ({ required, file, onChange }) => (
  <div className="mt-1">
    <label className="inline-flex items-center gap-4">
      <span className="px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-200">
        Choose File
      </span>
      <input
        type="file"
        required={required}
        onChange={onChange}
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
      />
      <span className="text-sm text-gray-600">{file?.name || "No file chosen"}</span>
    </label>
  </div>
);

const CharacterCounter: FC<{ value: string; maxLength: number }> = ({ value, maxLength }) => (
  <div className="text-xs text-right text-gray-500 mt-1">
    {value.length} / {maxLength}
  </div>
);

// --- 3. Main Modal Component ---

const AddManagerModal: FC<AddManagerModalProps> = ({ open, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 8;
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<ManagerForm>({
    // Step 1
    fullName: "", dob: "", idType: "aadhaar", idFile: null,
    // Step 2
    email: "", mobile: "", altPhone: "", emergencyName: "", emergencyPhone: "",
    // Step 3
    currentAddress: "", permanentAddress: "",
    // Step 4
    designation: "PG Manager", joiningDate: "", experience: "", certifications: "", certificationFile: null,
    // Step 5
    username: "", password: "", forcePasswordChange: true,
    accessLevels: { dashboard: true, alerts: true, financial: false },
    modulePerms: { maintenance: true, tenants: true, inventory: false, ticketsApprove: false },
    // Step 6
    policeReport: null, backgroundDocs: null, ndaFile: null,
    // Step 7
    bankAccount: "", ifsc: "", pan: "", taxForm: null,
    // Step 8
    workingHours: "", languages: "",
  });
  
  const validateField = (name: string, value: string) => {
    let errorMsg = "";
    if (name === "pan") {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (value && !panRegex.test(value)) {
        errorMsg = "Invalid PAN format.";
      }
    }
    if (name === "bankAccount") {
      const accountRegex = /^\d{9,18}$/;
      if (value && !accountRegex.test(value)) {
        errorMsg = "Invalid account number.";
      }
    }
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };
  
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };
  
  const isStepValid = (): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    switch (currentStep) {
      case 1: return form.fullName.trim() !== "" && form.dob.trim() !== "" && form.idFile !== null;
      case 2: return form.email.trim() !== "" && form.mobile.trim() !== "";
      case 3: return form.currentAddress.trim() !== "" && form.permanentAddress.trim() !== "";
      case 4: return form.designation.trim() !== "" && form.joiningDate.trim() !== "" && form.experience.trim() !== "" && form.certifications.trim() !== "";
      case 5: return form.username.trim() !== "" && passwordRegex.test(form.password);
      case 6: return form.policeReport !== null && form.backgroundDocs !== null && form.ndaFile !== null;
      case 7: return form.bankAccount.trim() !== "" && !errors.bankAccount && form.ifsc.trim() !== "" && form.pan.trim() !== "" && !errors.pan && form.taxForm !== null;
      default: return true;
    }
  };

  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) { if (e.key === "Escape") onClose?.(); }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const nextStep = () => { if (isStepValid()) setCurrentStep(p => p + 1); };
  const prevStep = () => setCurrentStep(p => p - 1);

  // Generic update function. 
  // We use `any` for value to accommodate strings, booleans, and files without complex overloads,
  // but restrict keys to ManagerForm keys.
  const update = (key: keyof ManagerForm, value: any, maxLength?: number) => {
    if (maxLength === undefined || (typeof value === 'string' && value.length <= maxLength)) {
      setForm(f => ({ ...f, [key]: value }));
    }
  };

  // Explicit typing for nested updates to ensure safety with specific sub-objects
  const updateNested = <K extends 'accessLevels' | 'modulePerms'>(
    group: K, 
    key: keyof ManagerForm[K]
  ) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ 
      ...f, 
      [group]: { 
        ...f[group], 
        [key]: e.target.checked 
      } 
    }));
  };

  const handleFile = (key: keyof ManagerForm) => (e: ChangeEvent<HTMLInputElement>) => {
    update(key, e.target.files?.[0] ?? null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isStepValid()) return;
    
    // Create payload and convert files to names for the onSubmit callback
    const payload: any = { ...form };
    
    const fileKeys: (keyof ManagerForm)[] = ["idFile", "certificationFile", "policeReport", "backgroundDocs", "ndaFile", "taxForm"];
    
    fileKeys.forEach(k => {
      const file = form[k] as File | null;
      payload[k] = file?.name || null;
    });

    onSubmit?.(payload as ManagerPayload);
  };

  const baseButtonStyles = "px-4 py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";
  const primaryButtonStyles = "bg-[#3D63EA] text-white hover:bg-blue-600 focus:ring-[#3D63EA] disabled:bg-gray-300 disabled:cursor-not-allowed";
  const secondaryButtonStyles = "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 focus:ring-gray-400";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog">
      <form onSubmit={handleSubmit} className="w-full max-w-4xl rounded-2xl bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Add Manager</h2>
          <button type="button" onClick={onClose} className="h-9 w-9 grid place-items-center rounded-full hover:bg-gray-100"><svg viewBox="0 0 20 20" className="h-5 w-5"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" /></svg></button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
          {currentStep === 1 && <section><SectionTitle>1. Personal Information</SectionTitle><div className="grid md:grid-cols-3 gap-4"><label className="block"><Label>Full name *</Label><Input required value={form.fullName} onChange={e => update("fullName", e.target.value)} placeholder="e.g., Rahul Sharma" /></label><label className="block"><Label>Date of birth *</Label><Input required type="date" value={form.dob} onChange={e => update("dob", e.target.value)} /></label><label className="block"><Label>Photo ID type</Label><Select value={form.idType} onChange={e => update("idType", e.target.value)}><option value="aadhaar">Aadhaar</option><option value="passport">Passport</option><option value="driver">Driver’s License</option></Select></label><div className="block md:col-span-3"><Label>Photo ID upload *</Label><StyledFileInput required file={form.idFile} onChange={handleFile("idFile")} /></div></div></section>}
          {currentStep === 2 && <section><SectionTitle>2. Contact Details</SectionTitle><div className="grid md:grid-cols-3 gap-4"><label className="block"><Label>Primary email *</Label><Input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="name@email.com" /></label><label className="block"><Label>Mobile number *</Label><Input required value={form.mobile} onChange={(e) => update("mobile", e.target.value)} placeholder="+91-xxxxxxxxxx" /></label><label className="block"><Label>Alternate phone</Label><Input value={form.altPhone} onChange={(e) => update("altPhone", e.target.value)} /></label><label className="block"><Label>Emergency contact name</Label><Input value={form.emergencyName} onChange={(e) => update("emergencyName", e.target.value)} /></label><label className="block"><Label>Emergency contact number</Label><Input value={form.emergencyPhone} onChange={(e) => update("emergencyPhone", e.target.value)} /></label></div></section>}
          {currentStep === 3 && <section><SectionTitle>3. Address</SectionTitle><div className="grid md:grid-cols-2 gap-4"><label className="block"><Label>Current residential address *</Label><Textarea required rows={3} value={form.currentAddress} onChange={e => update("currentAddress", e.target.value, 200)} /><CharacterCounter value={form.currentAddress} maxLength={200} /></label><label className="block"><Label>Permanent address *</Label><Textarea required rows={3} value={form.permanentAddress} onChange={e => update("permanentAddress", e.target.value, 200)} /><CharacterCounter value={form.permanentAddress} maxLength={200} /></label></div></section>}
          {currentStep === 4 && <section><SectionTitle>4. Professional Credentials</SectionTitle><div className="grid md:grid-cols-3 gap-4"><label className="block"><Label>Designation *</Label><Input required value={form.designation} onChange={e => update("designation", e.target.value)} /></label><label className="block md:col-span-2"><Label>Date of joining *</Label><Input required type="date" value={form.joiningDate} onChange={e => update("joiningDate", e.target.value)} /></label><div className="block md:col-span-3"><Label>Work experience summary *</Label><Textarea required rows={2} value={form.experience} onChange={e => update("experience", e.target.value, 200)} placeholder="Brief summary" /><CharacterCounter value={form.experience} maxLength={200} /></div><div className="block md:col-span-3"><Label>Relevant certifications (text summary) *</Label><Textarea required rows={2} value={form.certifications} onChange={e => update("certifications", e.target.value, 200)} placeholder="Hospitality, safety, first aid, etc." /><CharacterCounter value={form.certifications} maxLength={200} /></div><div className="block md:col-span-3"><Label>Upload certification documents (Optional)</Label><StyledFileInput file={form.certificationFile} onChange={handleFile("certificationFile")} /></div></div></section>}
          {currentStep === 5 && <section><SectionTitle>5. Login & Access Permissions</SectionTitle><div className="grid md:grid-cols-3 gap-4"><label className="block"><Label>Desired username *</Label><Input required value={form.username} onChange={e => update("username", e.target.value)} /></label><div className="block"><Label>Initial password *</Label><div className="relative mt-1"><Input required type={isPasswordVisible ? "text" : "password"} value={form.password} onChange={e => update("password", e.target.value)} className="pr-10" /><button type="button" onClick={() => setIsPasswordVisible(v => !v)} className="absolute inset-y-0 right-0 grid place-content-center px-3 text-gray-500 hover:text-gray-700">{isPasswordVisible ? <EyeSlashIcon/> : <EyeIcon />}</button></div><p className="text-xs text-gray-500 mt-1">8+ chars, letters, numbers & special character.</p></div><label className="flex items-center gap-2 mt-6"><input type="checkbox" checked={form.forcePasswordChange} onChange={e => update("forcePasswordChange", e.target.checked)} /><span className="text-sm text-gray-700">Force password change</span></label></div><div className="grid md:grid-cols-2 gap-4 mt-3"><div className="rounded-lg border p-3"><div className="text-xs font-medium text-gray-700 mb-2">Access levels</div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.accessLevels.dashboard} onChange={updateNested("accessLevels", "dashboard")} /> Dashboard view</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.accessLevels.alerts} onChange={updateNested("accessLevels", "alerts")} /> Alerts management</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.accessLevels.financial} onChange={updateNested("accessLevels", "financial")} /> Financial approvals</label></div><div className="rounded-lg border p-3"><div className="text-xs font-medium text-gray-700 mb-2">Module-specific permissions</div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.modulePerms.maintenance} onChange={updateNested("modulePerms", "maintenance")} /> Maintenance tickets</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.modulePerms.tenants} onChange={updateNested("modulePerms", "tenants")} /> Tenant communications</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.modulePerms.inventory} onChange={updateNested("modulePerms", "inventory")} /> Inventory access</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.modulePerms.ticketsApprove} onChange={updateNested("modulePerms", "ticketsApprove")} /> Approve/close tickets</label></div></div></section>}
          {currentStep === 6 && <section><SectionTitle>6. Compliance & Verification</SectionTitle><div className="grid md:grid-cols-3 gap-4"><div className="block"><Label>Police verification report *</Label><StyledFileInput required file={form.policeReport} onChange={handleFile("policeReport")} /></div><div className="block"><Label>Background check documents *</Label><StyledFileInput required file={form.backgroundDocs} onChange={handleFile("backgroundDocs")} /></div><div className="block"><Label>Signed NDA *</Label><StyledFileInput required file={form.ndaFile} onChange={handleFile("ndaFile")} /></div></div></section>}
          {currentStep === 7 && <section><SectionTitle>7. Payroll & Tax Information</SectionTitle><div className="grid md:grid-cols-3 gap-4"><label className="block"><Label>Bank account number *</Label><Input name="bankAccount" required value={form.bankAccount} onChange={e => update("bankAccount", e.target.value)} onBlur={handleBlur} /><p className="text-xs text-red-500 h-4 mt-1">{errors.bankAccount}</p></label><label className="block"><Label>IFSC *</Label><Input name="ifsc" required value={form.ifsc} onChange={e => update("ifsc", e.target.value)} /><p className="h-4 mt-1"></p></label><label className="block"><Label>PAN / Tax ID *</Label><Input name="pan" required value={form.pan} onChange={e => update("pan", e.target.value.toUpperCase())} onBlur={handleBlur} /><p className="text-xs text-red-500 h-4 mt-1">{errors.pan}</p></label><div className="block md:col-span-3"><Label>Form 16 / Tax document *</Label><StyledFileInput required file={form.taxForm} onChange={handleFile("taxForm")} /></div></div></section>}
          {currentStep === 8 && <section><SectionTitle>8. Additional Preferences</SectionTitle><div className="grid md:grid-cols-2 gap-4"><label className="block"><Label>Preferred working hours / shift</Label><Input placeholder="e.g., 9am–6pm (Mon–Sat)" value={form.workingHours} onChange={(e) => update("workingHours", e.target.value)} /></label><label className="block"><Label>Language proficiency</Label><Input placeholder="e.g., English, Hindi, Telugu" value={form.languages} onChange={(e) => update("languages", e.target.value)} /></label></div></section>}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t mt-auto">
          <button type="button" onClick={onClose} className={`${baseButtonStyles} ${secondaryButtonStyles}`}>Cancel</button>
          {currentStep > 1 && <button type="button" onClick={prevStep} className={`${baseButtonStyles} ${secondaryButtonStyles}`}>Back</button>}
          {currentStep < totalSteps && <button type="button" onClick={nextStep} disabled={!isStepValid()} className={`${baseButtonStyles} ${primaryButtonStyles}`}>Next</button>}
          {currentStep === totalSteps && <button type="submit" className={`${baseButtonStyles} ${primaryButtonStyles}`}>Save Manager</button>}
        </div>
      </form>
    </div>
  );
}

export default AddManagerModal;