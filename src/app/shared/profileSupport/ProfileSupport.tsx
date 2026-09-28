import React, {
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Bell,
  ChevronRight,
  Globe,
  HelpCircle,
  KeyRound,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  User,
  UserRound,
  Wrench,
  FileText,
  Headphones,
} from "lucide-react";

import { PageShell } from "@/app/shared/components/PageShell";

import UpdateDetailsModal, {
  type UpdateField,
} from "./UpdateModal";

import SuccessModal from "@/ui/Shared/SuccessModal";

import FailureView from "@/ui/Shared/FailureView";

import {
  updatePgUserInfo,
  updateGuestInfo,
} from "@/app/shared/services/api/commonApiServices";

import { useProfileSupportStore } from "@/app/shared/store/profileSupportStore";

import { useAuth } from "@/hooks/context/AuthContext";


// ============================================================
// TYPES
// ============================================================

interface ActionCardProps {
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  onClick?: () => void;
}

interface ContactItemProps {
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  phone?: string;
}

interface SettingRowProps {
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  value?: string;
  danger?: boolean;
  onClick?: () => void;
}


// ============================================================
// ACTION CARD
// ============================================================

const ActionCard: FC<ActionCardProps> = ({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        flex min-w-0 items-center
        rounded-lg
        border border-slate-200/80
        bg-white
        text-left
        shadow-[0_1px_2px_rgba(15,23,42,0.03)]
        transition-all duration-150
        hover:border-slate-300
        hover:shadow-sm
        active:scale-[0.99]

        min-h-[37px]
        px-1.5 py-1

        sm:min-h-[48px]
        sm:px-2.5 sm:py-1.5

        lg:min-h-[66px]
        lg:px-3.5 lg:py-2.5

        xl:min-h-[72px]
        xl:px-4
      "
    >
      <div
        className={`
          ${iconBg}
          ${iconColor}
          flex shrink-0 items-center justify-center
          rounded-lg

          h-6 w-6

          sm:h-8 sm:w-8

          lg:h-10 lg:w-10

          xl:h-11 xl:w-11
        `}
      >
        {icon}
      </div>

      <div className="ml-2 min-w-0 flex-1 sm:ml-2.5">
        <p
          className="
            truncate
            text-[9px]
            font-semibold
            leading-tight
            text-slate-900

            sm:text-[11px]

            lg:text-[13px]

            xl:text-[14px]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-[1px]
            truncate
            text-[7px]
            leading-tight
            text-slate-500

            sm:text-[9px]

            lg:text-[10px]

            xl:text-[11px]
          "
        >
          {description}
        </p>
      </div>

      <ChevronRight
        className="
          ml-1
          shrink-0
          text-slate-400

          h-2.5 w-2.5

          sm:h-3.5 sm:w-3.5

          lg:h-4 lg:w-4
        "
      />
    </button>
  );
};


// ============================================================
// CONTACT ITEM
// ============================================================

const ContactItem: FC<ContactItemProps> = ({
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  phone,
}) => {
  const handleCall = () => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  return (
    <div
      className="
        flex min-w-0 items-center
        border-b border-slate-100
        last:border-b-0

        px-1.5 py-0.5

        sm:px-2.5 sm:py-1

        lg:px-3.5 lg:py-1.5

        xl:px-4 xl:py-2
      "
    >
      <div
        className={`
          ${iconBg}
          ${iconColor}
          flex shrink-0 items-center justify-center
          rounded-full

          h-5 w-5

          sm:h-7 sm:w-7

          lg:h-8 lg:w-8

          xl:h-9 xl:w-9
        `}
      >
        {icon}
      </div>

      <div className="ml-2 min-w-0 flex-1">
        <p
          className="
            truncate
            text-[8px]
            font-semibold
            text-slate-800

            sm:text-[10px]

            lg:text-[11px]

            xl:text-[12px]
          "
        >
          {title}
        </p>

        <p
          className="
            truncate
            text-[7px]
            text-slate-500

            sm:text-[8.5px]

            lg:text-[9px]

            xl:text-[10px]
          "
        >
          {subtitle}
        </p>
      </div>

      {phone && (
        <button
          type="button"
          onClick={handleCall}
          aria-label={`Call ${title}`}
          className="
            ml-1
            flex shrink-0
            items-center
            justify-center
            rounded-lg
            border border-blue-200
            bg-blue-50/40
            text-blue-600
            transition-colors
            hover:bg-blue-50

            h-6 w-6

            sm:h-7 sm:w-7

            lg:h-8 lg:w-8

            xl:h-9 xl:w-9
          "
        >
          <Phone
            className="
              h-3 w-3

              sm:h-3.5 sm:w-3.5

              lg:h-4 lg:w-4
            "
          />
        </button>
      )}
    </div>
  );
};


// ============================================================
// SETTING ROW
// ============================================================

const SettingRow: FC<SettingRowProps> = ({
  icon,
  iconBg,
  iconColor,
  title,
  value,
  danger = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        flex w-full items-center
        border-b border-slate-100
        last:border-b-0
        text-left
        transition-colors
        hover:bg-slate-50/60

        px-1.5 py-0.5

        sm:px-2.5 sm:py-1

        lg:px-3.5 lg:py-1.5

        xl:px-4 xl:py-2
      "
    >
      <div
        className={`
          ${iconBg}
          ${iconColor}
          flex shrink-0 items-center justify-center
          rounded-md

          h-5 w-5

          sm:h-7 sm:w-7

          lg:h-8 lg:w-8

          xl:h-9 xl:w-9
        `}
      >
        {icon}
      </div>

      <span
        className={`
          ml-1.5
          flex-1
          text-[8px]
          font-medium

          sm:ml-2
          sm:text-[10px]

          lg:ml-2.5
          lg:text-[11px]

          xl:text-[12px]

          ${danger ? "text-red-500" : "text-slate-800"}
        `}
      >
        {title}
      </span>

      {value && (
        <span
          className="
            mr-1
            text-[8px]
            text-slate-500

            sm:text-[9px]

            lg:text-[10px]

            xl:text-[11px]
          "
        >
          {value}
        </span>
      )}

      <ChevronRight
        className="
          shrink-0
          text-slate-400

          h-3 w-3

          sm:h-3.5 sm:w-3.5
        "
      />
    </button>
  );
};


// ============================================================
// PROFILE & SUPPORT
// ============================================================

const ProfileSupport: FC = () => {
  const { dbUser } = useAuth();

  const {
    profileSupport,
    loading,
    error,
    fetchProfileSupport,
  } = useProfileSupportStore();


  // ==========================================================
  // MODAL STATE
  // ==========================================================

  const [showPersonalModal, setShowPersonalModal] =
    useState(false);

  const [showEmergencyModal, setShowEmergencyModal] =
    useState(false);

  const [savingPersonal, setSavingPersonal] =
    useState(false);

  const [savingEmergency, setSavingEmergency] =
    useState(false);


  // ==========================================================
  // SUCCESS MODAL
  // ==========================================================

  const [successModal, setSuccessModal] = useState({
    open: false,
    title: "Success",
    message: "",
  });


  // ==========================================================
  // FAILURE MODAL
  // ==========================================================

  const [failureModal, setFailureModal] =
    useState(false);


  // ==========================================================
  // FETCH
  // ==========================================================

  useEffect(() => {
    if (!dbUser?.id) return;

    fetchProfileSupport(dbUser.id);
  }, [dbUser?.id, fetchProfileSupport]);


  // ==========================================================
  // DATA
  // ==========================================================

  const profile = profileSupport?.profile;
  const stay = profileSupport?.stay;
 const emergencyContact = profileSupport?.emergencyContact
  ? {
      id: profileSupport.emergencyContact.id,
      name: profileSupport.emergencyContact.name,
      mobile: profileSupport.emergencyContact.mobile,
    }
  : null;
  const managerContact =
    profileSupport?.managerContact;
  const pg = profileSupport?.pg;
  const notifications =
    profileSupport?.notifications;
  const importantContacts =
    profileSupport?.importantContacts;
  const settings =
    profileSupport?.settings;

  const supportSummary =
    profileSupport?.support?.summary;


  // ==========================================================
  // FORM FIELDS
  // ==========================================================

  const personalFields: UpdateField[] =
    useMemo(
      () => [
        {
          key: "firstName",
          label: "First Name",
          type: "text",
          placeholder: "Enter first name",
          required: true,
        },
        {
          key: "lastName",
          label: "Last Name",
          type: "text",
          placeholder: "Enter last name",
          required: true,
        },
        {
          key: "email",
          label: "Email",
          type: "email",
          placeholder: "Enter email",
          required: true,
        },
        {
          key: "mobile",
          label: "Mobile Number",
          type: "tel",
          placeholder: "Enter mobile number",
          required: true,
        },
      ],
      []
    );


  const emergencyFields: UpdateField[] =
    useMemo(
      () => [
        {
      key: "emergency_contact_name",
      label: "Emergency Contact Name",
      type: "text",
      placeholder: "Enter contact name",
      required: true,
    },
    {
      key: "emergency_contact",
      label: "Emergency Contact Number",
      type: "tel",
      placeholder: "Enter contact number",
      required: true,
    },
      ],
      []
    );


  // ==========================================================
  // INITIAL PERSONAL VALUES
  // ==========================================================

  const personalInitialValues =
    useMemo(
      () => ({
        firstName: profile?.firstName || "",
        lastName: profile?.lastName || "",
        email: profile?.email || "",
        mobile: profile?.mobile || "",
      }),
      [
        profile?.firstName,
        profile?.lastName,
        profile?.email,
        profile?.mobile,
      ]
    );


  // ==========================================================
  // INITIAL EMERGENCY VALUES
  // ==========================================================

  const emergencyInitialValues =
    useMemo(
      () => ({
        emergency_contact_name: emergencyContact?.name || "",
        emergency_contact: emergencyContact?.mobile || "",
      }),
      [
        emergencyContact?.name,
        emergencyContact?.mobile,
      ]
    );


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading && !profileSupport) {
    return (
      <PageShell noScroll>
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div
              className="
                h-6 w-6
                animate-spin
                rounded-full
                border-2
                border-slate-200
                border-t-blue-600
              "
            />

            <p className="text-[10px] text-slate-500 sm:text-xs">
              Loading profile...
            </p>
          </div>
        </div>
      </PageShell>
    );
  }


  // ==========================================================
  // FORMATTED VALUES
  // ==========================================================

  const roomName =
    stay?.room?.name || "Room not assigned";

  const bedName =
    stay?.bed?.number !== undefined
      ? `Bed ${stay.bed.number}`
      : "Bed not assigned";

  const profileStatus =
    profile?.isActive ? "Active" : "Inactive";

  const notificationCount =
    notifications?.summary?.active ?? 0;


  // ==========================================================
  // HANDLERS
  // ==========================================================

  const handlePersonalDetails = () => {
    setShowPersonalModal(true);
  };


  const handleEmergencyContact = () => {
    setShowEmergencyModal(true);
  };


  // ==========================================================
  // SAVE PERSONAL DETAILS
  // ==========================================================

  const handleSavePersonalDetails = async (
    values: Record<string, string>
  ) => {
    if (!profile?.userId) {
      setFailureModal(true);
      return;
    }

    try {
      setSavingPersonal(true);

      await updatePgUserInfo({
        id: profile.userId,

        fields: {
          first_name:
            values.firstName.trim(),

          last_name:
            values.lastName.trim(),

          email_id:
            values.email.trim(),

          mobile_no:
            values.mobile.trim(),
        },
      });

      setShowPersonalModal(false);

      setSuccessModal({
        open: true,
        title: "Profile Updated",
        message:
          "Your personal details have been updated successfully.",
      });
    } catch (err) {
      console.error(
        "Failed to update personal details:",
        err
      );

      setShowPersonalModal(false);
      setFailureModal(true);
    } finally {
      setSavingPersonal(false);
    }
  };


  
 // ==========================================================
// SAVE EMERGENCY CONTACT
// ==========================================================

const handleSaveEmergencyContact = async (
  values: Record<string, string>
) => {
  // The ID must be the guest-info record ID.
  // Example from Postman: 266
  if (!emergencyContact?.id) {
    console.error(
      "Emergency contact ID is missing:",
      emergencyContact
    );

    setShowEmergencyModal(false);
    setFailureModal(true);
    return;
  }

  try {
    setSavingEmergency(true);

    const payload = {
      id: Number(emergencyContact.id),

      fields: {
        emergency_contact:
          values.emergency_contact?.trim() || "",

        emergency_contact_name:
          values.emergency_contact_name?.trim() || "",
      },
    };

    console.log(
      "Updating emergency contact:",
      JSON.stringify(payload, null, 2)
    );

    await updateGuestInfo(payload);

    setShowEmergencyModal(false);

    setSuccessModal({
      open: true,
      title: "Emergency Contact Updated",
      message:
        "Your emergency contact has been updated successfully.",
    });
  } catch (err) {
    console.error(
      "Failed to update emergency contact:",
      err
    );

    setShowEmergencyModal(false);
    setFailureModal(true);
  } finally {
    setSavingEmergency(false);
  }
};
  // ==========================================================
  // SUCCESS MODAL CLOSE
  // ==========================================================

  const handleSuccessClose = async () => {
    setSuccessModal((prev) => ({
      ...prev,
      open: false,
    }));

    if (dbUser?.id) {
      await fetchProfileSupport(dbUser.id);
    }
  };


  // ==========================================================
  // OTHER HANDLERS
  // ==========================================================

  const handleManagerContact = () => {
    console.log("Manager Contact");
  };

  const handleRules = () => {
    console.log("PG Rules & Policies");
  };

  const handleFaq = () => {
    console.log("FAQ & Help");
  };


  // ==========================================================
  // RAISE SUPPORT TICKET
  // ==========================================================

  const handleSupport = () => {
    window.location.href =
      "/resident/requests";
  };


  const handleNotifications = () => {
    console.log("Notifications");
  };

  

  const handlePrivacy = () => {
    console.log("Privacy");
  };

  const handleLogout = () => {
    console.log("Logout");
  };


  // ==========================================================
  // JSX
  // ==========================================================

  return (
    <>
      <PageShell noScroll>
        <div className="flex h-full min-h-0 flex-col overflow-hidden">

          {/* ==================================================
              HEADER
          ================================================== */}

          <header
            className="
              flex shrink-0 items-center justify-between

              h-[28px]

              sm:h-[35px]

              lg:h-[50px]

              xl:h-[54px]
            "
          >
            <p
              className="
                text-[15px]
                font-bold
                tracking-[-0.4px]
                text-blue-600

                sm:text-[19px]

                lg:text-[26px]

                xl:text-[28px]
              "
            >
              MyPG
            </p>

            <div
              className="
                flex
                items-center
                gap-1

                sm:gap-1.5

                lg:gap-2
              "
            >
              {/* Notifications */}

              <button
                type="button"
                onClick={handleNotifications}
                aria-label="Notifications"
                className="
                  relative
                  flex
                  items-center
                  justify-center
                  rounded-full

                  h-7 w-7

                  sm:h-8 sm:w-8

                  lg:h-9 lg:w-9

                  xl:h-10 xl:w-10
                "
              >
                <Bell
                  className="
                    h-4 w-4

                    sm:h-[18px] sm:w-[18px]

                    lg:h-5 lg:w-5

                    xl:h-[21px] xl:w-[21px]
                  "
                />

                {notificationCount > 0 && (
                  <span
                    className="
                      absolute
                      right-0
                      top-0
                      flex
                      items-center
                      justify-center
                      rounded-full
                      bg-orange-500
                      text-[6px]
                      font-bold
                      text-white

                      h-3 w-3

                      sm:h-3.5 sm:w-3.5

                      lg:h-4 lg:w-4
                    "
                  >
                    {notificationCount > 99
                      ? "99+"
                      : notificationCount}
                  </span>
                )}
              </button>

              {/* PG Selector */}

              <button
                type="button"
                className="
                  flex
                  items-center
                  gap-1
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-1.5
                  py-0.5
                  text-[7px]
                  font-medium
                  text-slate-700

                  sm:px-2
                  sm:py-1
                  sm:text-[9px]

                  lg:px-3.5
                  lg:py-1.5
                  lg:text-[11px]

                  xl:px-4
                  xl:py-2
                  xl:text-[12px]
                "
              >
                <span className="max-w-[100px] truncate sm:max-w-[160px]">
                  {pg?.name || "My PG"}
                </span>

                <ChevronRight
                  className="
                    rotate-90

                    h-2.5 w-2.5

                    sm:h-3 sm:w-3

                    lg:h-3.5 lg:w-3.5
                  "
                />
              </button>
            </div>
          </header>


          {/* ==================================================
              TITLE
          ================================================== */}

          <div
            className="
              flex
              shrink-0
              items-center

              pb-0.5

              sm:pb-1

              lg:pb-2.5

              xl:pb-3
            "
          >
            <h1
              className="
                text-[14px]
                font-bold
                tracking-[-0.3px]
                text-slate-900

                sm:text-[17px]

                lg:text-[23px]

                xl:text-[25px]
              "
            >
              Profile &amp; Support
            </h1>
          </div>


          {/* ==================================================
              CONTENT
          ================================================== */}

          <div
            className="
              min-h-0
              flex-1
              overflow-hidden

              flex
              flex-col

              gap-1

              sm:gap-1.5

              lg:gap-3

              xl:gap-3.5
            "
          >

            {/* ==================================================
                PROFILE
            ================================================== */}

            <section
              className="
                shrink-0
                rounded-xl
                border
                border-slate-200/80
                bg-white
                shadow-[0_1px_2px_rgba(15,23,42,0.02)]

                px-1.5
                py-1

                sm:px-2.5
                sm:py-2

                lg:px-4
                lg:py-3

                xl:px-5
                xl:py-3.5
              "
            >
              <div className="flex min-w-0 items-center">

                {/* Avatar */}

                <div
                  className="
                    flex
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-gradient-to-br
                    from-blue-50
                    to-sky-100
                    ring-1
                    ring-blue-100

                    h-8 w-8

                    sm:h-11 sm:w-11

                    lg:h-16 lg:w-16

                    xl:h-[68px] xl:w-[68px]
                  "
                >
                  <UserRound
                    className="
                      text-blue-500

                      h-5 w-5

                      sm:h-6 sm:w-6

                      lg:h-7 lg:w-7

                      xl:h-8 xl:w-8
                    "
                    strokeWidth={1.7}
                  />
                </div>


                {/* Profile Details */}

                <div
                  className="
                    ml-2
                    min-w-0
                    flex-1

                    sm:ml-2.5

                    lg:ml-4
                  "
                >
                  <div className="flex min-w-0 items-center gap-1.5">

                    <h2
                      className="
                        min-w-0
                        truncate
                        text-[10px]
                        font-bold
                        text-slate-900

                        sm:text-[13px]

                        lg:text-[17px]

                        xl:text-[18px]
                      "
                    >
                      {profile?.name || "Resident"}
                    </h2>

                    <span
                      className={`
                        shrink-0
                        rounded-full
                        px-1.5
                        py-[1px]
                        text-[6px]
                        font-semibold

                        sm:px-2
                        sm:text-[7px]

                        lg:px-2.5
                        lg:py-1
                        lg:text-[9px]

                        ${
                          profileStatus === "Active"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-500"
                        }
                      `}
                    >
                      {profileStatus}
                    </span>
                  </div>

                  <p
                    className="
                      text-[7px]
                      text-slate-500

                      sm:text-[9px]

                      lg:text-[10.5px]

                      xl:text-[11px]
                    "
                  >
                    {roomName}
                    <span className="mx-1">•</span>
                    {bedName}
                  </p>

                  <div
                    className="
                      mt-0.5
                      flex
                      items-center
                      gap-2
                      text-[6.5px]
                      text-slate-500

                      sm:text-[8px]

                      lg:text-[9.5px]

                      xl:text-[10px]
                    "
                  >
                    {profile?.mobile && (
                      <span className="flex items-center gap-0.5">
                        <Phone className="h-2.5 w-2.5" />
                        <span>{profile.mobile}</span>
                      </span>
                    )}

                    {profile?.email && (
                      <span className="hidden items-center gap-0.5 sm:flex">
                        <Mail className="h-2.5 w-2.5" />

                        <span className="truncate">
                          {profile.email}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>


            {/* ==================================================
                ACTION CARDS
            ================================================== */}

            <section
              className="
                grid
                shrink-0
                grid-cols-2

                gap-0.5

                sm:gap-1.5

                lg:grid-cols-3
                lg:gap-2.5

                xl:gap-3
              "
            >

              {/* Personal Details */}

              <ActionCard
                icon={
                  <User className="h-3 w-3 sm:h-4 sm:w-4 lg:h-[18px] lg:w-[18px]" />
                }
                iconBg="bg-blue-50"
                iconColor="text-blue-600"
                title="Personal Details"
                description="Update your personal info"
                onClick={handlePersonalDetails}
              />


              {/* Emergency Contact */}

              <ActionCard
                icon={
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 lg:h-[18px] lg:w-[18px]" />
                }
                iconBg="bg-orange-50"
                iconColor="text-orange-500"
                title="Emergency Contact"
                description={
                  emergencyContact?.mobile
                    ? `Current: ${emergencyContact.mobile}`
                    : "Add or update contact"
                }
                onClick={handleEmergencyContact}
              />


              {/* Manager Contact */}

              <ActionCard
                icon={
                  <UserRound className="h-3 w-3 sm:h-4 sm:w-4 lg:h-[18px] lg:w-[18px]" />
                }
                iconBg="bg-violet-50"
                iconColor="text-violet-600"
                title="Manager Contact"
                description={
                  managerContact?.name
                    ? managerContact.name
                    : "Connect with PG manager"
                }
                onClick={handleManagerContact}
              />


              {/* PG Rules */}

              <ActionCard
                icon={
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 lg:h-[18px] lg:w-[18px]" />
                }
                iconBg="bg-emerald-50"
                iconColor="text-emerald-600"
                title="PG Rules & Policies"
                description="View rules & policies"
                onClick={handleRules}
              />


              {/* FAQ */}

              <ActionCard
                icon={
                  <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 lg:h-[18px] lg:w-[18px]" />
                }
                iconBg="bg-blue-50"
                iconColor="text-blue-600"
                title="FAQ & Help"
                description="Find answers to common questions"
                onClick={handleFaq}
              />


              {/* Support Ticket */}

              <ActionCard
                icon={
                  <Headphones className="h-3 w-3 sm:h-4 sm:w-4 lg:h-[18px] lg:w-[18px]" />
                }
                iconBg="bg-orange-50"
                iconColor="text-orange-500"
                title="Raise Support Ticket"
                description={
                  supportSummary?.openRequests
                    ? `${supportSummary.openRequests} open request${
                        supportSummary.openRequests > 1
                          ? "s"
                          : ""
                      }`
                    : "Report an issue or request help"
                }
                onClick={handleSupport}
              />
            </section>


            {/* ==================================================
                BOTTOM CARDS
            ================================================== */}

            <div
              className="
                shrink-0
                grid
                grid-cols-1

                gap-1

                sm:grid-cols-2
                sm:gap-1.5

                lg:grid-cols-[1.2fr_0.8fr]
                lg:gap-2.5

                xl:gap-3
              "
            >

              {/* =================================================
                  IMPORTANT CONTACTS
              ================================================= */}

              <section
                className="
                  h-fit
                  self-start
                  overflow-hidden

                  rounded-xl
                  border
                  border-slate-200/80
                  bg-white
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between

                    px-1.5
                    pt-1
                    pb-0.5

                    sm:px-2.5
                    sm:pt-2

                    lg:px-3.5
                    lg:pt-2.5

                    xl:px-4
                    xl:pt-3
                  "
                >
                  <h3
                    className="
                      text-[8px]
                      font-bold
                      text-slate-900

                      sm:text-[10px]

                      lg:text-[12px]

                      xl:text-[13px]
                    "
                  >
                    Important Contacts
                  </h3>

                  <Phone
                    className="
                      h-3 w-3
                      text-slate-300

                      lg:h-3.5
                      lg:w-3.5
                    "
                  />
                </div>


                <div>

                  {/* Manager */}

                  {importantContacts?.manager && (
                    <ContactItem
                      icon={
                        <UserRound className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                      }
                      iconBg="bg-emerald-50"
                      iconColor="text-emerald-600"
                      title={
                        importantContacts.manager.name
                      }
                      subtitle="PG Manager"
                      phone={
                        importantContacts.manager.mobile
                      }
                    />
                  )}


                  {/* PG Primary */}

                  {importantContacts?.pgPrimary && (
                    <ContactItem
                      icon={
                        <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                      }
                      iconBg="bg-blue-50"
                      iconColor="text-blue-600"
                      title={
                        importantContacts.pgPrimary.name
                      }
                      subtitle="Primary PG Contact"
                      phone={
                        importantContacts.pgPrimary.mobile
                      }
                    />
                  )}


                  {/* PG Alternate */}

                  {importantContacts?.pgAlternate && (
                    <ContactItem
                      icon={
                        <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                      }
                      iconBg="bg-orange-50"
                      iconColor="text-orange-500"
                      title={
                        importantContacts.pgAlternate.name
                      }
                      subtitle="Alternate PG Contact"
                      phone={
                        importantContacts.pgAlternate.mobile
                      }
                    />
                  )}


                  {/* Security */}

                  {importantContacts?.security && (
                    <ContactItem
                      icon={
                        <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                      }
                      iconBg="bg-violet-50"
                      iconColor="text-violet-600"
                      title={
                        importantContacts.security.name
                      }
                      subtitle="Security"
                      phone={
                        importantContacts.security.mobile
                      }
                    />
                  )}


                  {/* Housekeeping */}

                  {importantContacts?.housekeeping && (
                    <ContactItem
                      icon={
                        <Wrench className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                      }
                      iconBg="bg-orange-50"
                      iconColor="text-orange-500"
                      title={
                        importantContacts.housekeeping.name
                      }
                      subtitle="Housekeeping"
                      phone={
                        importantContacts.housekeeping.mobile
                      }
                    />
                  )}

                </div>
              </section>


              {/* =================================================
                  SETTINGS
              ================================================= */}

              <section
                className="
                  h-fit
                  self-start
                  overflow-hidden

                  rounded-xl
                  border
                  border-slate-200/80
                  bg-white
                "
              >

                {/* Notifications */}

                <SettingRow
                  icon={
                    <Bell className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                  }
                  iconBg="bg-violet-50"
                  iconColor="text-violet-600"
                  title="Notifications"
                  value={
                    settings?.notifications !== null &&
                    settings?.notifications !== undefined
                      ? String(
                          settings.notifications
                        )
                      : notificationCount > 0
                        ? `${notificationCount} active`
                        : "Not configured"
                  }
                  onClick={handleNotifications}
                />


               


                {/* Privacy */}

                <SettingRow
                  icon={
                    <KeyRound className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                  }
                  iconBg="bg-blue-50"
                  iconColor="text-blue-600"
                  title="Privacy"
                  value={
                    settings?.privacy !== null &&
                    settings?.privacy !== undefined
                      ? String(settings.privacy)
                      : "Not configured"
                  }
                  onClick={handlePrivacy}
                />


                {/* Logout */}

                <SettingRow
                  icon={
                    <LogOut className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                  }
                  iconBg="bg-red-50"
                  iconColor="text-red-500"
                  title="Logout"
                  danger
                  onClick={handleLogout}
                />
              </section>
            </div>
          </div>
        </div>
      </PageShell>


      {/* ========================================================
          PERSONAL DETAILS MODAL
      ======================================================== */}

      <UpdateDetailsModal
        open={showPersonalModal}
        title="Personal Details"
        description="Update your personal information"
        fields={personalFields}
        initialValues={personalInitialValues}
        saving={savingPersonal}
        accent="blue"
        onClose={() => {
          if (!savingPersonal) {
            setShowPersonalModal(false);
          }
        }}
        onSubmit={handleSavePersonalDetails}
      />


      {/* ========================================================
          EMERGENCY CONTACT MODAL
      ======================================================== */}

      <UpdateDetailsModal
        open={showEmergencyModal}
        title="Emergency Contact"
        description="Update your emergency contact details"
        fields={emergencyFields}
        initialValues={emergencyInitialValues}
        saving={savingEmergency}
        accent="orange"
        onClose={() => {
          if (!savingEmergency) {
            setShowEmergencyModal(false);
          }
        }}
        onSubmit={handleSaveEmergencyContact}
      />


      {/* ========================================================
          SUCCESS MODAL
      ======================================================== */}

      <SuccessModal
        open={successModal.open}
        title={successModal.title}
        message={successModal.message}
        onClose={handleSuccessClose}
      />


      {/* ========================================================
          FAILURE MODAL
      ======================================================== */}

      {failureModal && (
        <div
          className="
            fixed
            inset-0
            z-[70]
            flex
            items-center
            justify-center
            bg-black/40
            px-3
          "
          onClick={() => setFailureModal(false)}
        >
          <div
            className="
              w-full
              max-w-md
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-xl
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="max-h-[80vh] overflow-auto">
              <FailureView />
            </div>

            <div className="flex justify-center pb-5">
              <button
                type="button"
                onClick={() =>
                  setFailureModal(false)
                }
                className="
                  rounded-lg
                  bg-slate-700
                  px-5
                  py-2
                  text-sm
                  font-medium
                  text-white
                  hover:bg-slate-800
                "
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSupport;