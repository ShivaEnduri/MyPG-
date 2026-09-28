import React, {
  useEffect,
  useState,
} from "react";

import {
  X,
  User,
  Users,
  CalendarDays,
  CreditCard,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

import { addPgUserBookingApi } from "@/app/shared/services/api/commonApiServices";

import {
  useUserDetailsStore,
} from "@/app/shared/store/pgUserDetailsStore";

import {
  usePgGuestTypeStore,
} from "@/app/shared/store/guestTypeStore";


/* ============================================================
   TYPES
============================================================ */

export interface AddUserBookingModalProps {
  open: boolean;

  /*
   * PG ID comes from:
   *
   * selectedPg?.id ?? selectedPgId
   */
  pgId: number | string | null;

  onClose: () => void;

  onSuccess?: () => void;
}


// interface FormState {
//   /* ==========================================================
//      RESIDENT
//   ========================================================== */

//   first_name: string;
//   last_name: string;
//   email_id: string;
//   mobile_no: string;
//   gender_id: string;

//   /* ==========================================================
//      GUEST
//   ========================================================== */

//   guest_type: string;
//   perm_address: string;
//   emergency_contact: string;
//   emergency_contact_name: string;

//   /* ==========================================================
//      BOOKING
//   ========================================================== */

//   bkg_date: string;
//   planned_check_in_date: string;
//   planned_check_out_date: string;

//   monthly_rent: string;
//   secuirty_deposit: string;
//   notice_period_time: string;

//   remarks: string;
// }

interface FormState {
  // Resident
  first_name: string;
  last_name: string;
  email_id: string;
  mobile_no: string;
  gender_id: string;

  // Guest
  guest_type: string;
  perm_address: string;
  emergency_contact: string;
  emergency_contact_name: string;

  // Booking
  room_id: string;
  bed_id: string;
  bkg_date: string;
  planned_check_in_date: string;
  actual_check_in_date: string;
  planned_check_out_date: string;
  monthly_rent: string;
  secuirty_deposit: string;
  notice_period_time: string;
  remarks: string;
}


/* ============================================================
   DEFAULT FORM
============================================================ */

// const getDefaultForm = (): FormState => ({
//   /* Resident */

//   first_name: "",
//   last_name: "",
//   email_id: "",
//   mobile_no: "",
//   gender_id: "",

//   /* Guest */

//   guest_type: "",
//   perm_address: "",
//   emergency_contact: "",
//   emergency_contact_name: "",

//   /* Booking */

//   bkg_date: new Date()
//     .toISOString()
//     .split("T")[0],

//   planned_check_in_date: "",
//   planned_check_out_date: "",

//   monthly_rent: "",
//   secuirty_deposit: "",
//   notice_period_time: "30",

//   remarks: "",
// });

const getDefaultForm = (): FormState => ({
  first_name: "",
  last_name: "",
  email_id: "",
  mobile_no: "",
  gender_id: "",

  guest_type: "",
  perm_address: "",
  emergency_contact: "",
  emergency_contact_name: "",

  room_id: "",
  bed_id: "",

  bkg_date: new Date().toISOString().split("T")[0],
  planned_check_in_date: "",
  actual_check_in_date: "",
  planned_check_out_date: "",

  monthly_rent: "",
  secuirty_deposit: "",
  notice_period_time: "30",
  remarks: "",
});

/* ============================================================
   VALIDATION
============================================================ */

type Errors = Partial<
  Record<keyof FormState, string>
>;


const validateForm = (
  form: FormState,
  pgId: number | string | null
): Errors => {
  const errors: Errors = {};

  /* ==========================================================
     PG
  ========================================================== */

  if (!pgId) {
    errors.first_name =
      "Please select a PG first.";

    return errors;
  }


  /* ==========================================================
     RESIDENT
  ========================================================== */

  if (!form.first_name.trim()) {
    errors.first_name =
      "First name is required";
  } else if (
    form.first_name.trim().length < 2
  ) {
    errors.first_name =
      "Minimum 2 characters";
  }


  if (!form.last_name.trim()) {
    errors.last_name =
      "Last name is required";
  } else if (
    form.last_name.trim().length < 2
  ) {
    errors.last_name =
      "Minimum 2 characters";
  }


  if (!form.email_id.trim()) {
    errors.email_id =
      "Email is required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      form.email_id.trim()
    )
  ) {
    errors.email_id =
      "Enter a valid email";
  }


  if (!form.mobile_no.trim()) {
    errors.mobile_no =
      "Mobile number is required";
  } else if (
    !/^[6-9]\d{9}$/.test(
      form.mobile_no.trim()
    )
  ) {
    errors.mobile_no =
      "Enter valid 10 digit mobile";
  }


  if (!form.gender_id) {
    errors.gender_id =
      "Select gender";
  }


  /* ==========================================================
     GUEST
  ========================================================== */

  if (!form.guest_type) {
    errors.guest_type =
      "Select guest type";
  }


  if (!form.perm_address.trim()) {
    errors.perm_address =
      "Permanent address is required";
  } else if (
    form.perm_address.trim().length < 5
  ) {
    errors.perm_address =
      "Enter a valid address";
  }


  if (!form.emergency_contact.trim()) {
    errors.emergency_contact =
      "Emergency contact is required";
  } else if (
    !/^[6-9]\d{9}$/.test(
      form.emergency_contact.trim()
    )
  ) {
    errors.emergency_contact =
      "Enter valid 10 digit number";
  }


  if (!form.emergency_contact_name.trim()) {
    errors.emergency_contact_name =
      "Emergency contact name is required";
  } else if (
    form.emergency_contact_name.trim().length < 2
  ) {
    errors.emergency_contact_name =
      "Enter valid contact name";
  }


  /* ==========================================================
     BOOKING
  ========================================================== */

  if (!form.bkg_date) {
    errors.bkg_date =
      "Booking date is required";
  }


  if (!form.planned_check_in_date) {
    errors.planned_check_in_date =
      "Check-in date is required";
  }


  if (!form.planned_check_out_date) {
    errors.planned_check_out_date =
      "Check-out date is required";
  }


  if (
    form.planned_check_in_date &&
    form.planned_check_out_date &&
    form.planned_check_out_date <
      form.planned_check_in_date
  ) {
    errors.planned_check_out_date =
      "Must be after check-in";
  }


  if (!form.monthly_rent.trim()) {
    errors.monthly_rent =
      "Monthly rent is required";
  } else if (
    Number(form.monthly_rent) <= 0
  ) {
    errors.monthly_rent =
      "Enter valid rent";
  }


  if (!form.secuirty_deposit.trim()) {
    errors.secuirty_deposit =
      "Security deposit is required";
  } else if (
    Number(form.secuirty_deposit) < 0
  ) {
    errors.secuirty_deposit =
      "Invalid amount";
  }


  if (!form.notice_period_time.trim()) {
    errors.notice_period_time =
      "Notice period is required";
  } else if (
    Number(form.notice_period_time) < 0
  ) {
    errors.notice_period_time =
      "Invalid notice period";
  }


  return errors;
};


/* ============================================================
   COMPONENT
============================================================ */

export default function AddUserBookingModal({
  open,
  pgId,
  onClose,
  onSuccess,
}: AddUserBookingModalProps) {


  /* ==========================================================
     MASTER DATA STORES
  ========================================================== */

  const {
    genders,
    fetchGenders,
  } = useUserDetailsStore();


  const {
  guestTypes,
  loading: guestTypesLoading,
  fetchGuestTypes,
} = usePgGuestTypeStore();

useEffect(() => {
  fetchGuestTypes();
}, [fetchGuestTypes]);


  /* ==========================================================
     FORM STATE
  ========================================================== */

  const [
    form,
    setForm,
  ] = useState<FormState>(
    getDefaultForm()
  );


  const [
    errors,
    setErrors,
  ] = useState<Errors>({});


  const [
    submitting,
    setSubmitting,
  ] = useState(false);


  const [
    submitError,
    setSubmitError,
  ] = useState("");


  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");


  /* ==========================================================
     FETCH GENDERS + GUEST TYPES
  ========================================================== */

  useEffect(() => {
    if (!open) {
      return;
    }

    /*
     * Gender master
     */
    if (genders.length === 0) {
      fetchGenders();
    }

    
  }, [
    open,
    pgId,
    genders.length,
    fetchGenders,
   
  ]);


  /* ==========================================================
     RESET FORM
  ========================================================== */

  useEffect(() => {
    if (open) {
      setForm(
        getDefaultForm()
      );

      setErrors({});

      setSubmitError("");

      setSuccessMessage("");
    }
  }, [open, pgId]);


  /* ==========================================================
     UPDATE FIELD
  ========================================================== */

  const updateField = (
    field: keyof FormState,
    value: string
  ) => {

    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));


    setErrors((previous) => {

      if (!previous[field]) {
        return previous;
      }

      const next = {
        ...previous,
      };

      delete next[field];

      return next;
    });


    setSubmitError("");
  };


  /* ==========================================================
     SUBMIT
  ========================================================== */

  const handleSubmit = async (
    event: React.FormEvent
  ) => {

    event.preventDefault();


    const validationErrors =
      validateForm(
        form,
        pgId
      );


    setErrors(
      validationErrors
    );


    if (
      Object.keys(
        validationErrors
      ).length > 0
    ) {
      return;
    }


    if (!pgId) {
      setSubmitError(
        "Please select a PG first."
      );

      return;
    }


    try {

      setSubmitting(true);

      setSubmitError("");

      setSuccessMessage("");


      /* ========================================================
         API PAYLOAD
      ======================================================== */

      const payload = {

        /* ======================================================
           USER / RESIDENT
        ====================================================== */

        first_name:
          form.first_name.trim(),

        last_name:
          form.last_name.trim(),

        email_id:
          form.email_id.trim(),

        mobile_no:
          form.mobile_no.trim(),

        gender_id:
          Number(
            form.gender_id
          ),

        /*
         * These are still required by
         * the user table API.
         *
         * They are NOT displayed in UI.
         */
        is_active: 1,

        rstatus: 1,


        /* ======================================================
           GUEST
        ====================================================== */

        guest: {

          guest_type:
            Number(
              form.guest_type
            ),

          /*
           * Guest status is no longer
           * shown to the user.
           *
           * Backend receives default active
           * value.
           */
          guest_status: 4,

          pg_id:
            Number(pgId),

          perm_address:
            form.perm_address.trim(),

          emergency_contact:
            form.emergency_contact.trim(),

          emergency_contact_name:
            form.emergency_contact_name.trim(),
        },


        /* ======================================================
           BOOKING
        ====================================================== */

       booking: {
  pg_id: Number(pgId),

  room_id: Number(form.room_id),
  bed_id: Number(form.bed_id),

  bkg_date: form.bkg_date,

  planned_check_in_date:
    form.planned_check_in_date,

  actual_check_in_date:
    form.actual_check_in_date,

  planned_check_out_date:
    form.planned_check_out_date,

  bkg_status: 1,

  monthly_rent:
    Number(form.monthly_rent),

  secuirty_deposit:
    Number(form.secuirty_deposit),

  notice_period_time:
    Number(form.notice_period_time),

  remarks:
    form.remarks.trim(),
},
      };


      console.log(
        "Add User Booking Payload:",
        payload
      );


      await addPgUserBookingApi(
        payload
      );


      setSuccessMessage(
        "Booking added successfully."
      );


      onSuccess?.();


      /*
       * Small delay so user can see
       * success message.
       */

      setTimeout(() => {
        onClose();
      }, 700);


    } catch (error: any) {

      console.error(
        "Add booking failed:",
        error
      );


      setSubmitError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to add booking. Please try again."
      );

    } finally {

      setSubmitting(false);
    }
  };


  /* ==========================================================
     DON'T RENDER
  ========================================================== */

  if (!open) {
    return null;
  }


  /* ==========================================================
     STYLES
  ========================================================== */

  const inputClass = (
    field: keyof FormState
  ) => `
    h-[25px]
    w-full
    rounded-md
    border
    ${
      errors[field]
        ? "border-red-300 bg-red-50"
        : "border-slate-200 bg-white"
    }
    px-1.5
    text-[7px]
    font-medium
    text-slate-800
    outline-none
    transition
    placeholder:text-slate-300
    focus:border-blue-400
    focus:ring-1
    focus:ring-blue-100

    sm:h-[27px]
    sm:text-[7.5px]

    md:h-[29px]
    md:text-[8px]

    lg:h-[30px]
    lg:text-[8.5px]
  `;


  const labelClass = `
    mb-0.5
    block
    text-[6.5px]
    font-bold
    leading-none
    text-slate-600

    sm:text-[7px]

    md:text-[7.5px]
  `;


  const errorClass = `
    mt-0.5
    block
    text-[5.5px]
    font-medium
    leading-none
    text-red-500

    sm:text-[6px]
  `;


  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-slate-900/40
        p-1.5
        backdrop-blur-[1px]

        sm:p-3
      "
      onMouseDown={(event) => {

        if (
          event.target ===
            event.currentTarget &&
          !submitting
        ) {
          onClose();
        }

      }}
    >

      {/* ======================================================
          MODAL
      ====================================================== */}

      <div
        className="
          flex
          max-h-[94vh]
          w-full
          max-w-[650px]
          flex-col
          overflow-hidden
          rounded-md
          border
          border-slate-200
          bg-white
          shadow-2xl

          sm:max-h-[92vh]
        "
      >

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-slate-100
            bg-white
            px-2
            py-1.5

            sm:px-3
            sm:py-2
          "
        >

          <div
            className="
              flex
              min-w-0
              items-center
              gap-1.5
            "
          >

            <div
              className="
                flex
                h-6
                w-6
                shrink-0
                items-center
                justify-center
                rounded-md
                bg-blue-50

                sm:h-7
                sm:w-7
              "
            >

              <User
                className="
                  h-3
                  w-3
                  text-blue-600
                "
              />

            </div>


            <div className="min-w-0">

              <h2
                className="
                  truncate
                  text-[9px]
                  font-extrabold
                  leading-tight
                  text-slate-900

                  sm:text-[10px]
                  md:text-[11px]
                "
              >
                Add New Booking
              </h2>

              <p
                className="
                  text-[6px]
                  font-medium
                  leading-tight
                  text-slate-400

                  sm:text-[6.5px]
                "
              >
                Add resident and booking details
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="
              flex
              h-5
              w-5
              shrink-0
              items-center
              justify-center
              rounded-md
              text-slate-400
              hover:bg-slate-100
              hover:text-slate-700
              disabled:opacity-50
            "
            aria-label="Close"
          >

            <X
              className="
                h-3
                w-3
              "
            />

          </button>

        </div>


        {/* ====================================================
            FORM
        ==================================================== */}

        <form
          onSubmit={handleSubmit}
          className="
            min-h-0
            flex-1
            overflow-y-auto
            px-2
            py-1.5

            sm:px-3
            sm:py-2
          "
        >

          {/* ==================================================
              RESIDENT DETAILS
          ================================================== */}

          <section
            className="
              mb-1.5
              rounded-md
              border
              border-slate-100
              bg-slate-50/60
              p-1.5

              sm:p-2
            "
          >

            <SectionTitle
              icon={
                <User className="h-2.5 w-2.5" />
              }
              title="Resident Details"
            />


            <div
              className="
                grid
                grid-cols-2
                gap-x-1.5
                gap-y-1

                sm:grid-cols-4
              "
            >

              {/* FIRST NAME */}

              <Field>

                <label
                  className={labelClass}
                >
                  First Name *
                </label>

                <input
                  value={
                    form.first_name
                  }
                  onChange={(e) =>
                    updateField(
                      "first_name",
                      e.target.value
                    )
                  }
                  placeholder="First name"
                  className={inputClass(
                    "first_name"
                  )}
                />

                <FieldError
                  error={
                    errors.first_name
                  }
                  className={
                    errorClass
                  }
                />

              </Field>


              {/* LAST NAME */}

              <Field>

                <label
                  className={labelClass}
                >
                  Last Name *
                </label>

                <input
                  value={
                    form.last_name
                  }
                  onChange={(e) =>
                    updateField(
                      "last_name",
                      e.target.value
                    )
                  }
                  placeholder="Last name"
                  className={inputClass(
                    "last_name"
                  )}
                />

                <FieldError
                  error={
                    errors.last_name
                  }
                  className={
                    errorClass
                  }
                />

              </Field>


              {/* EMAIL */}

              <Field>

                <label
                  className={labelClass}
                >
                  Email *
                </label>

                <input
                  type="email"
                  value={
                    form.email_id
                  }
                  onChange={(e) =>
                    updateField(
                      "email_id",
                      e.target.value
                    )
                  }
                  placeholder="email@example.com"
                  className={inputClass(
                    "email_id"
                  )}
                />

                <FieldError
                  error={
                    errors.email_id
                  }
                  className={
                    errorClass
                  }
                />

              </Field>


              {/* MOBILE */}

              <Field>

                <label
                  className={labelClass}
                >
                  Mobile *
                </label>

                <input
                  inputMode="numeric"
                  maxLength={10}
                  value={
                    form.mobile_no
                  }
                  onChange={(e) =>
                    updateField(
                      "mobile_no",
                      e.target.value
                        .replace(
                          /\D/g,
                          ""
                        )
                    )
                  }
                  placeholder="10 digit mobile"
                  className={inputClass(
                    "mobile_no"
                  )}
                />

                <FieldError
                  error={
                    errors.mobile_no
                  }
                  className={
                    errorClass
                  }
                />

              </Field>


              {/* GENDER */}

              <Field>

                <label
                  className={labelClass}
                >
                  Gender *
                </label>

                <SelectWrapper>

                  <select
                    value={
                      form.gender_id
                    }
                    onChange={(e) =>
                      updateField(
                        "gender_id",
                        e.target.value
                      )
                    }
                    className={inputClass(
                      "gender_id"
                    )}
                  >

                    <option value="">
                      Select gender
                    </option>

                    {genders.map(
                      (gender: any) => (

                        <option
                          key={
                            gender.id
                          }
                          value={
                            gender.id
                          }
                        >
                          {
                            gender.gender_type
                          }
                        </option>

                      )
                    )}

                  </select>

                </SelectWrapper>

                <FieldError
                  error={
                    errors.gender_id
                  }
                  className={
                    errorClass
                  }
                />

              </Field>

            </div>

          </section>


          {/* ==================================================
              GUEST DETAILS
          ================================================== */}

          <section
            className="
              mb-1.5
              rounded-md
              border
              border-slate-100
              bg-slate-50/60
              p-1.5

              sm:p-2
            "
          >

            <SectionTitle
              icon={
                <Users className="h-2.5 w-2.5" />
              }
              title="Guest Details"
            />


            <div
              className="
                grid
                grid-cols-2
                gap-x-1.5
                gap-y-1

                sm:grid-cols-4
              "
            >

              {/* GUEST TYPE */}

              <Field>

                <label
                  className={labelClass}
                >
                  Guest Type *
                </label>

                <SelectWrapper>

                  <select
                    value={
                      form.guest_type
                    }
                    onChange={(e) =>
                      updateField(
                        "guest_type",
                        e.target.value
                      )
                    }
                    className={inputClass(
                      "guest_type"
                    )}
                    disabled={
                      guestTypesLoading
                    }
                  >

                    <option value="">
                      {guestTypesLoading
                        ? "Loading..."
                        : "Select type"}
                    </option>

                    {guestTypes.map(
                      (type: any) => (

                        <option
                          key={
                            type.id
                          }
                          value={
                            type.id
                          }
                        >
                          {
                            type.guest_type
                          }
                        </option>

                      )
                    )}

                  </select>

                </SelectWrapper>

                <FieldError
                  error={
                    errors.guest_type
                  }
                  className={
                    errorClass
                  }
                />

              </Field>


              {/* PERMANENT ADDRESS */}

              <Field
                className="
                  col-span-2
                "
              >

                <label
                  className={labelClass}
                >
                  Permanent Address *
                </label>

                <input
                  value={
                    form.perm_address
                  }
                  onChange={(e) =>
                    updateField(
                      "perm_address",
                      e.target.value
                    )
                  }
                  placeholder="Permanent address"
                  className={inputClass(
                    "perm_address"
                  )}
                />

                <FieldError
                  error={
                    errors.perm_address
                  }
                  className={
                    errorClass
                  }
                />

              </Field>


              {/* EMERGENCY CONTACT */}

              <Field>

                <label
                  className={labelClass}
                >
                  Emergency Contact *
                </label>

                <input
                  inputMode="numeric"
                  maxLength={10}
                  value={
                    form.emergency_contact
                  }
                  onChange={(e) =>
                    updateField(
                      "emergency_contact",
                      e.target.value
                        .replace(
                          /\D/g,
                          ""
                        )
                    )
                  }
                  placeholder="10 digit mobile"
                  className={inputClass(
                    "emergency_contact"
                  )}
                />

                <FieldError
                  error={
                    errors.emergency_contact
                  }
                  className={
                    errorClass
                  }
                />

              </Field>


              {/* EMERGENCY NAME */}

              <Field>

                <label
                  className={labelClass}
                >
                  Emergency Name *
                </label>

                <input
                  value={
                    form.emergency_contact_name
                  }
                  onChange={(e) =>
                    updateField(
                      "emergency_contact_name",
                      e.target.value
                    )
                  }
                  placeholder="Contact name"
                  className={inputClass(
                    "emergency_contact_name"
                  )}
                />

                <FieldError
                  error={
                    errors.emergency_contact_name
                  }
                  className={
                    errorClass
                  }
                />

              </Field>

            </div>

          </section>


          {/* ==================================================
              BOOKING DETAILS
          ================================================== */}

          <section
            className="
              mb-1.5
              rounded-md
              border
              border-slate-100
              bg-slate-50/60
              p-1.5

              sm:p-2
            "
          >

            <SectionTitle
              icon={
                <CalendarDays className="h-2.5 w-2.5" />
              }
              title="Booking Details"
            />


            <div
              className="
                grid
                grid-cols-2
                gap-x-1.5
                gap-y-1

                sm:grid-cols-4
              "
            >

              {/* BOOKING DATE */}

              <Field>

                <label
                  className={labelClass}
                >
                  Booking Date *
                </label>

                <input
                  type="date"
                  value={
                    form.bkg_date
                  }
                  onChange={(e) =>
                    updateField(
                      "bkg_date",
                      e.target.value
                    )
                  }
                  className={inputClass(
                    "bkg_date"
                  )}
                />

                <FieldError
                  error={
                    errors.bkg_date
                  }
                  className={
                    errorClass
                  }
                />

              </Field>


              {/* CHECK IN */}

              <Field>

                <label
                  className={labelClass}
                >
                  Planned Check-in *
                </label>

                <input
                  type="date"
                  value={
                    form.planned_check_in_date
                  }
                  onChange={(e) =>
                    updateField(
                      "planned_check_in_date",
                      e.target.value
                    )
                  }
                  className={inputClass(
                    "planned_check_in_date"
                  )}
                />

                <FieldError
                  error={
                    errors.planned_check_in_date
                  }
                  className={
                    errorClass
                  }
                />

              </Field>


              {/* CHECK OUT */}

              <Field>

                <label
                  className={labelClass}
                >
                  Planned Check-out *
                </label>

                <input
                  type="date"
                  value={
                    form.planned_check_out_date
                  }
                  onChange={(e) =>
                    updateField(
                      "planned_check_out_date",
                      e.target.value
                    )
                  }
                  className={inputClass(
                    "planned_check_out_date"
                  )}
                />

                <FieldError
                  error={
                    errors.planned_check_out_date
                  }
                  className={
                    errorClass
                  }
                />

              </Field>


              {/* NOTICE */}

              <Field>

                <label
                  className={labelClass}
                >
                  Notice Period
                </label>

                <div
                  className="relative"
                >

                  <input
                    inputMode="numeric"
                    value={
                      form.notice_period_time
                    }
                    onChange={(e) =>
                      updateField(
                        "notice_period_time",
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    className={`${inputClass(
                      "notice_period_time"
                    )} pr-7`}
                  />

                  <span
                    className="
                      pointer-events-none
                      absolute
                      right-1.5
                      top-1/2
                      -translate-y-1/2
                      text-[5.5px]
                      font-semibold
                      text-slate-400
                    "
                  >
                    days
                  </span>

                </div>

                <FieldError
                  error={
                    errors.notice_period_time
                  }
                  className={
                    errorClass
                  }
                />

              </Field>

            </div>

          </section>


          {/* ==================================================
              PAYMENT DETAILS
          ================================================== */}

          <section
            className="
              mb-1.5
              rounded-md
              border
              border-slate-100
              bg-slate-50/60
              p-1.5

              sm:p-2
            "
          >

            <SectionTitle
              icon={
                <CreditCard className="h-2.5 w-2.5" />
              }
              title="Payment Details"
            />


            <div
              className="
                grid
                grid-cols-2
                gap-x-1.5
                gap-y-1

                sm:grid-cols-4
              "
            >

              {/* RENT */}

              <Field>

                <label
                  className={labelClass}
                >
                  Monthly Rent *
                </label>

                <input
                  inputMode="decimal"
                  value={
                    form.monthly_rent
                  }
                  onChange={(e) =>
                    updateField(
                      "monthly_rent",
                      e.target.value.replace(
                        /[^0-9.]/g,
                        ""
                      )
                    )
                  }
                  placeholder="₹ 0"
                  className={inputClass(
                    "monthly_rent"
                  )}
                />

                <FieldError
                  error={
                    errors.monthly_rent
                  }
                  className={
                    errorClass
                  }
                />

              </Field>


              {/* SECURITY */}

              <Field>

                <label
                  className={labelClass}
                >
                  Security Deposit *
                </label>

                <input
                  inputMode="decimal"
                  value={
                    form.secuirty_deposit
                  }
                  onChange={(e) =>
                    updateField(
                      "secuirty_deposit",
                      e.target.value.replace(
                        /[^0-9.]/g,
                        ""
                      )
                    )
                  }
                  placeholder="₹ 0"
                  className={inputClass(
                    "secuirty_deposit"
                  )}
                />

                <FieldError
                  error={
                    errors.secuirty_deposit
                  }
                  className={
                    errorClass
                  }
                />

              </Field>


              {/* REMARKS */}

              <Field
                className="
                  col-span-2
                "
              >

                <label
                  className={labelClass}
                >
                  Remarks
                </label>

                <input
                  value={
                    form.remarks
                  }
                  onChange={(e) =>
                    updateField(
                      "remarks",
                      e.target.value
                    )
                  }
                  placeholder="Optional remarks"
                  className={inputClass(
                    "remarks"
                  )}
                />

              </Field>

            </div>

          </section>


          {/* ==================================================
              ERROR
          ================================================== */}

          {submitError && (

            <div
              className="
                mb-1.5
                flex
                items-center
                gap-1
                rounded-md
                border
                border-red-100
                bg-red-50
                px-1.5
                py-1
                text-[6.5px]
                font-semibold
                text-red-600
              "
            >

              <AlertCircle
                className="
                  h-2.5
                  w-2.5
                  shrink-0
                "
              />

              <span>
                {submitError}
              </span>

            </div>

          )}


          {/* ==================================================
              SUCCESS
          ================================================== */}

          {successMessage && (

            <div
              className="
                mb-1.5
                flex
                items-center
                gap-1
                rounded-md
                border
                border-emerald-100
                bg-emerald-50
                px-1.5
                py-1
                text-[6.5px]
                font-semibold
                text-emerald-600
              "
            >

              <CheckCircle2
                className="
                  h-2.5
                  w-2.5
                  shrink-0
                "
              />

              <span>
                {successMessage}
              </span>

            </div>

          )}

        </form>


        {/* ====================================================
            FOOTER
        ==================================================== */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            gap-2
            border-t
            border-slate-100
            bg-white
            px-2
            py-1.5

            sm:px-3
            sm:py-2
          "
        >

          <div
            className="
              flex
              items-center
              gap-1
              text-[5.5px]
              font-medium
              text-slate-400

              sm:text-[6px]
            "
          >

            <ShieldCheck
              className="
                h-2.5
                w-2.5
              "
            />

            Required fields are marked *

          </div>


          <div
            className="
              flex
              items-center
              gap-1
            "
          >

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="
                h-[25px]
                rounded-md
                border
                border-slate-200
                bg-white
                px-2
                text-[6.5px]
                font-bold
                text-slate-600
                hover:bg-slate-50
                disabled:opacity-50

                sm:h-[27px]
                sm:px-3
                sm:text-[7px]
              "
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={submitting}
              onClick={handleSubmit}
              className="
                flex
                h-[25px]
                items-center
                justify-center
                gap-1
                rounded-md
                bg-blue-600
                px-2.5
                text-[6.5px]
                font-bold
                text-white
                shadow-sm
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-60

                sm:h-[27px]
                sm:px-3.5
                sm:text-[7px]
              "
            >

              {submitting ? (

                <>
                  <Loader2
                    className="
                      h-2.5
                      w-2.5
                      animate-spin
                    "
                  />

                  Saving...
                </>

              ) : (

                <>
                  <CheckCircle2
                    className="
                      h-2.5
                      w-2.5
                    "
                  />

                  Add Booking
                </>

              )}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   FIELD
============================================================ */

function Field({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {

  return (
    <div
      className={`
        min-w-0
        ${className}
      `}
    >
      {children}
    </div>
  );
}


/* ============================================================
   FIELD ERROR
============================================================ */

function FieldError({
  error,
  className,
}: {
  error?: string;
  className: string;
}) {

  if (!error) {
    return null;
  }

  return (
    <span
      className={className}
    >
      {error}
    </span>
  );
}


/* ============================================================
   SECTION TITLE
============================================================ */

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {

  return (
    <div
      className="
        mb-1
        flex
        items-center
        gap-1
      "
    >

      <div
        className="
          flex
          h-4
          w-4
          items-center
          justify-center
          rounded
          bg-blue-100
          text-blue-600
        "
      >
        {icon}
      </div>


      <span
        className="
          text-[7px]
          font-extrabold
          leading-none
          text-slate-800

          sm:text-[7.5px]
        "
      >
        {title}
      </span>

    </div>
  );
}


/* ============================================================
   SELECT WRAPPER
============================================================ */

function SelectWrapper({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="relative">

      {children}

      <ChevronDown
        className="
          pointer-events-none
          absolute
          right-1
          top-1/2
          h-2.5
          w-2.5
          -translate-y-1/2
          text-slate-400
        "
      />

    </div>
  );
}