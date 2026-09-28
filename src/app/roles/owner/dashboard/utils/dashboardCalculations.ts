// OwnerDashboard/utils/dashboardCalculations.ts

/* ============================================================
   STATUS IDS
============================================================ */

export const STATUS = {
  REVIEW: 1,
  APPROVED: 2,
  VACANT: 3,
  RESERVED: 4,
  OCCUPIED: 5,
  JOINED: 6,
  DEPARTED: 7,
  CANCELLED: 8,
  AVAILABLE: 9,
  ACTIVE: 10,

  TICKET_RAISED: 11,
  TICKET_IN_PROGRESS: 12,
  TICKET_RESOLVED: 13,

  INVOICE_NEEDED: 15,
  INVOICE_GENERATED: 16,

  PAYMENT_DUE: 18,
  PAID_FULL: 19,

  KYC_REQUESTED: 21,
  KYC_SUBMITTED: 22,
  KYC_APPROVED: 23,

  NOTICE_GIVEN: 24,
  NOTICE_ACCEPTED: 25,
  IN_NOTICE_PERIOD: 26,

  PAID_PARTIAL: 27,
} as const;

/* ============================================================
   STATUS NAMES
============================================================ */

export const STATUS_NAMES: Record<number, string> = {
  1: "Review",
  2: "Approved",
  3: "Vacant",
  4: "Reserved",
  5: "Occupied",
  6: "Joined",
  7: "Departed",
  8: "Cancelled",
  9: "Available",
  10: "Active",
  11: "Ticket Raised",
  12: "Ticket In Progress",
  13: "Ticket Resolved",
  15: "Invoice Needed",
  16: "Invoice Generated",
  18: "Payment Due",
  19: "Paid Full",
  21: "KYC Requested",
  22: "KYC Submitted",
  23: "KYC Approved",
  24: "Notice Given",
  25: "Notice Accepted",
  26: "In Notice Period",
  27: "Paid Partial",
};

/* ============================================================
   GENERIC HELPERS
============================================================ */

export const toNumber = (value: unknown): number => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

export const formatCurrency = (value: unknown): string => {
  return `₹${toNumber(value).toLocaleString("en-IN")}`;
};

export const getStatusName = (status?: unknown): string => {
  return STATUS_NAMES[toNumber(status)] || "Unknown";
};

export const getInitials = (
  firstName?: string,
  lastName?: string
): string => {
  const first = firstName?.trim()?.charAt(0) || "";
  const last = lastName?.trim()?.charAt(0) || "";

  return `${first}${last}`.toUpperCase() || "G";
};

export const parseDate = (value: unknown): Date | null => {
  if (!value) return null;

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

export const formatDate = (value: unknown): string => {
  const date = parseDate(value);

  if (!date) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatShortDate = (value: unknown): string => {
  const date = parseDate(value);

  if (!date) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

export const getDaysFromNow = (value: unknown): number | null => {
  const date = parseDate(value);

  if (!date) return null;

  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const target = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  return Math.ceil(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
};


/* ============================================================
   SERVICE REQUEST CALCULATIONS
============================================================ */

export interface ServiceRequestStats {
  totalOpen: number;
  overdueIssues: number;
  resolvedThisWeek: number;
}


export const calculateServiceRequestStats = (
  requests: any[] = []
): ServiceRequestStats => {

  /* ==========================================================
     OPEN REQUESTS

     11 = Ticket Raised
     12 = Ticket In Progress
  ========================================================== */

  const openRequests =
    requests.filter((request) => {
      const status = toNumber(
        request?.service_status
      );

      return (
        status === STATUS.TICKET_RAISED ||
        status === STATUS.TICKET_IN_PROGRESS
      );
    });


  const totalOpen =
    openRequests.length;


  /* ==========================================================
     OVERDUE REQUESTS

     Open request + ETA has passed
  ========================================================== */

  const now = new Date();


  const overdueIssues =
    openRequests.filter((request) => {

      const eta =
        parseDate(
          request?.request_eta_date
        );

      if (!eta) {
        return false;
      }

      return eta < now;

    }).length;


  /* ==========================================================
     RESOLVED THIS WEEK

     13 = Ticket Resolved
  ========================================================== */

  const startOfWeek =
    new Date(now);

  const day =
    startOfWeek.getDay();

  const diff =
    day === 0
      ? 6
      : day - 1;

  startOfWeek.setDate(
    startOfWeek.getDate() - diff
  );

  startOfWeek.setHours(
    0,
    0,
    0,
    0
  );


  const resolvedThisWeek =
    requests.filter((request) => {

      const status =
        toNumber(
          request?.service_status
        );

      if (
        status !==
        STATUS.TICKET_RESOLVED
      ) {
        return false;
      }

      const resolvedDate =
        parseDate(
          request?.request_resolve_date ??
          request?.resolved_date ??
          request?.last_updated
        );

      if (!resolvedDate) {
        return false;
      }

      return (
        resolvedDate >=
          startOfWeek &&
        resolvedDate <= now
      );

    }).length;


  return {
    totalOpen,
    overdueIssues,
    resolvedThisWeek,
  };
};

/* ============================================================
   ROOM CALCULATIONS
============================================================ */

export interface OccupancyStats {
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  reservedBeds: number;
  availableBeds: number;
  vacantBeds: number;
  occupancyPercentage: number;
}

export const calculateOccupancy = (
  rooms: any[] = [],
  beds: any[] = []
): OccupancyStats => {
  const totalRooms = rooms.length;

  const totalBeds =
    beds.length ||
    rooms.reduce((sum, room) => {
      return sum + toNumber(room?.nbeds);
    }, 0);

  let occupiedBeds = 0;
  let reservedBeds = 0;
  let availableBeds = 0;
  let vacantBeds = 0;

  beds.forEach((bed) => {
    const status = toNumber(
      bed?.bed_status ??
        bed?.status ??
        bed?.current_status ??
        bed?.bedStatus
    );

    const statusName = String(
      bed?.status_name ??
        bed?.bed_status_name ??
        ""
    ).toLowerCase();

    if (
      status === STATUS.OCCUPIED ||
      statusName === "occupied"
    ) {
      occupiedBeds++;
    } else if (
      status === STATUS.RESERVED ||
      statusName === "reserved"
    ) {
      reservedBeds++;
    } else if (
      status === STATUS.AVAILABLE ||
      statusName === "available"
    ) {
      availableBeds++;
    } else if (
      status === STATUS.VACANT ||
      statusName === "vacant"
    ) {
      vacantBeds++;
    }
  });

  /*
   * If the backend does not expose bed status in the expected
   * property, keep the values safe instead of inventing data.
   */
  const knownStatusCount =
    occupiedBeds +
    reservedBeds +
    availableBeds +
    vacantBeds;

  if (knownStatusCount === 0 && totalBeds > 0) {
    availableBeds = totalBeds;
  }

  const occupancyPercentage =
    totalBeds > 0
      ? Math.round((occupiedBeds / totalBeds) * 100)
      : 0;

  return {
    totalRooms,
    totalBeds,
    occupiedBeds,
    reservedBeds,
    availableBeds,
    vacantBeds,
    occupancyPercentage,
  };
};

/* ============================================================
   BOOKING CALCULATIONS
============================================================ */

export const getUpcomingCheckIns = (
  bookings: any[] = [],
  limit = 5
): any[] => {
  const now = new Date();

  return [...bookings]
    .filter((booking) => {
      const date = parseDate(
        booking?.planned_check_in_date ??
          booking?.check_in_date
      );

      if (!date) return false;

      return (
        date >= now &&
        toNumber(booking?.bkg_status) !== STATUS.CANCELLED
      );
    })
    .sort((a, b) => {
      const dateA = parseDate(
        a?.planned_check_in_date ?? a?.check_in_date
      );

      const dateB = parseDate(
        b?.planned_check_in_date ?? b?.check_in_date
      );

      return (
        (dateA?.getTime() || 0) -
        (dateB?.getTime() || 0)
      );
    })
    .slice(0, limit);
};

export const getUpcomingCheckouts = (
  bookings: any[] = [],
  limit = 5
): any[] => {
  const now = new Date();

  return [...bookings]
    .filter((booking) => {
      const date = parseDate(
        booking?.planned_check_out_date ??
          booking?.check_out_date
      );

      if (!date) return false;

      return (
        date >= now &&
        toNumber(booking?.bkg_status) !== STATUS.CANCELLED
      );
    })
    .sort((a, b) => {
      const dateA = parseDate(
        a?.planned_check_out_date ?? a?.check_out_date
      );

      const dateB = parseDate(
        b?.planned_check_out_date ?? b?.check_out_date
      );

      return (
        (dateA?.getTime() || 0) -
        (dateB?.getTime() || 0)
      );
    })
    .slice(0, limit);
};

/* ============================================================
   VACANCY
============================================================ */

export const calculateUpcomingVacancies = (
  bookings: any[] = [],
  beds: any[] = [],
  limit = 5
): any[] => {
  const vacancies: any[] = [];

  /*
   * Vacant/available beds are immediately available.
   */
  beds.forEach((bed) => {
    const status = toNumber(
      bed?.bed_status ??
        bed?.status ??
        bed?.current_status
    );

    const statusName = String(
      bed?.status_name ??
        bed?.bed_status_name ??
        ""
    ).toLowerCase();

    if (
      status === STATUS.VACANT ||
      status === STATUS.AVAILABLE ||
      statusName === "vacant" ||
      statusName === "available"
    ) {
      vacancies.push({
        ...bed,
        vacancyDate: null,
        vacancyType: "Available",
      });
    }
  });

  /*
   * Bookings which have an upcoming checkout also become
   * potential vacancies.
   */
  bookings.forEach((booking) => {
    const checkoutDate = parseDate(
      booking?.planned_check_out_date ??
        booking?.check_out_date
    );

    if (!checkoutDate) return;

    if (
      checkoutDate >= new Date() &&
      toNumber(booking?.bkg_status) !== STATUS.CANCELLED
    ) {
      vacancies.push({
        ...booking,
        vacancyDate: checkoutDate,
        vacancyType: "Expected",
      });
    }
  });

  return vacancies
    .sort((a, b) => {
      const dateA = a.vacancyDate
        ? new Date(a.vacancyDate).getTime()
        : 0;

      const dateB = b.vacancyDate
        ? new Date(b.vacancyDate).getTime()
        : 0;

      return dateA - dateB;
    })
    .slice(0, limit);
};

/* ============================================================
   MAINTENANCE
============================================================ */

export interface MaintenanceStats {
  total: number;
  raised: number;
  inProgress: number;
  resolved: number;
}

export const calculateMaintenance = (
  requests: any[] = []
): MaintenanceStats => {
  let raised = 0;
  let inProgress = 0;
  let resolved = 0;

  requests.forEach((request) => {
    const status = toNumber(
      request?.request_status ??
        request?.status ??
        request?.service_status
    );

    if (status === STATUS.TICKET_RAISED) {
      raised++;
    } else if (status === STATUS.TICKET_IN_PROGRESS) {
      inProgress++;
    } else if (status === STATUS.TICKET_RESOLVED) {
      resolved++;
    }
  });

  return {
    total: requests.length,
    raised,
    inProgress,
    resolved,
  };
};

/* ============================================================
   RESIDENT HAPPINESS
============================================================ */

export interface ResidentHappinessStats {
  totalResidents: number;
  activeResidents: number;
  notices: number;
  kycPending: number;
  happinessScore: number;
}

export const calculateResidentHappiness = (
  guests: any[] = [],
  bookings: any[] = []
): ResidentHappinessStats => {
  const activeResidents = guests.filter((guest) => {
    const status = toNumber(
      guest?.guest_status ??
        guest?.status
    );

    /*
     * Joined / occupied / active guests are treated as active.
     * If guest status isn't available, consider the guest active.
     */
    return (
      status === 0 ||
      status === STATUS.JOINED ||
      status === STATUS.OCCUPIED ||
      status === STATUS.ACTIVE
    );
  }).length;

  const notices = guests.filter((guest) => {
    const status = toNumber(
      guest?.guest_status ??
        guest?.status
    );

    return (
      status === STATUS.NOTICE_GIVEN ||
      status === STATUS.NOTICE_ACCEPTED ||
      status === STATUS.IN_NOTICE_PERIOD
    );
  }).length;

  const kycPending = guests.filter((guest) => {
    const status = toNumber(
      guest?.guest_status ??
        guest?.status
    );

    return (
      status === STATUS.KYC_REQUESTED ||
      status === STATUS.KYC_SUBMITTED
    );
  }).length;

  /*
   * This is an operational health score, not a real resident
   * satisfaction survey score.
   *
   * Once you have ratings/feedback data, this calculation can
   * be replaced without changing the component.
   */
  const totalResidents = guests.length;

  if (totalResidents === 0) {
    return {
      totalResidents: 0,
      activeResidents: 0,
      notices: 0,
      kycPending: 0,
      happinessScore: 0,
    };
  }

  const maintenancePenalty =
    bookings.length > 0
      ? Math.min(15, bookings.length / 10)
      : 0;

  const noticePenalty = Math.min(
    10,
    notices * 2
  );

  const kycPenalty = Math.min(
    5,
    kycPending
  );

  const happinessScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        100 -
          maintenancePenalty -
          noticePenalty -
          kycPenalty
      )
    )
  );

  return {
    totalResidents,
    activeResidents,
    notices,
    kycPending,
    happinessScore,
  };
};

/* ============================================================
   RENT
============================================================ */

export interface RentStats {
  expected: number;
  collected: number;
  pending: number;
  partial: number;
  collectionPercentage: number;
}

export const calculateRentStatus = (
  bookings: any[] = []
): RentStats => {
  let expected = 0;
  let collected = 0;
  let partial = 0;

  bookings.forEach((booking) => {
    const rent = toNumber(
      booking?.monthly_rent ??
        booking?.rent
    );

    expected += rent;

    const status = toNumber(
      booking?.bkg_status
    );

    if (status === STATUS.PAID_FULL) {
      collected += rent;
    } else if (status === STATUS.PAID_PARTIAL) {
      partial += rent;
    }
  });

  const pending = Math.max(
    0,
    expected - collected - partial
  );

  const collectionPercentage =
    expected > 0
      ? Math.round(
          (collected / expected) * 100
        )
      : 0;

  return {
    expected,
    collected,
    pending,
    partial,
    collectionPercentage,
  };
};


/* ============================================================
   UPCOMING VACANCIES
============================================================ */

export interface VacancyItem {
  roomName: string;
  date: string;
  bedNumber?: string | number;
  bedId: number;
}

const BOOKING_STATUS = {
  OCCUPIED: 5,
} as const;

/**
 * Returns the beginning of today.
 *
 * Example:
 * 24 Aug 2026 00:00:00
 */
export const getStartOfToday = (): Date => {
  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  return today;
};

/**
 * Returns the end of the 15th day from today.
 *
 * Example:
 * Today = Aug 24
 *
 * Valid range:
 * Aug 24 -> Sep 8 inclusive
 */
export const getEndOf15thDay = (): Date => {
  const date =
    getStartOfToday();

  date.setDate(
    date.getDate() + 15
  );

  date.setHours(
    23,
    59,
    59,
    999
  );

  return date;
};

/**
 * Returns all upcoming vacancies for the
 * next 15 days.
 *
 * BUSINESS RULE:
 *
 * A bed is considered an upcoming vacancy when:
 *
 * 1. Booking exists for the bed.
 * 2. Booking status is OCCUPIED (5).
 * 3. Planned checkout date exists.
 * 4. Checkout date is between today and
 *    today + 15 days.
 *
 * RESERVED bookings are NOT included.
 */
export const getUpcomingVacancies = (
  bookings: any[] = [],
  rooms: any[] = [],
  bedInfoList: any[] = []
): VacancyItem[] => {
  if (
    !bookings ||
    bookings.length === 0
  ) {
    return [];
  }

  const startDate =
    getStartOfToday();

  const endDate =
    getEndOf15thDay();

  /*
   * Prevent duplicate beds from appearing
   * multiple times.
   */
  const processedBeds =
    new Set<number>();

  /*
   * Sort by checkout date.
   * Earliest vacancy comes first.
   */
  const sortedBookings =
    [...bookings].sort(
      (a: any, b: any) => {
        const dateA =
          a?.planned_check_out_date
            ? new Date(
                a.planned_check_out_date
              ).getTime()
            : Infinity;

        const dateB =
          b?.planned_check_out_date
            ? new Date(
                b.planned_check_out_date
              ).getTime()
            : Infinity;

        return dateA - dateB;
      }
    );

  const result: VacancyItem[] =
    [];

  sortedBookings.forEach(
    (booking: any) => {
      /*
       * Only OCCUPIED bookings.
       */
      if (
        Number(
          booking?.bkg_status
        ) !==
        BOOKING_STATUS.OCCUPIED
      ) {
        return;
      }

      const bedId =
        Number(
          booking?.bed_id
        );

      /*
       * Ignore invalid or duplicate beds.
       */
      if (
        !bedId ||
        processedBeds.has(bedId)
      ) {
        return;
      }

      const checkoutValue =
        booking?.planned_check_out_date;

      if (!checkoutValue) {
        return;
      }

      const checkoutDate =
        new Date(
          checkoutValue
        );

      /*
       * Ignore invalid dates.
       */
      if (
        Number.isNaN(
          checkoutDate.getTime()
        )
      ) {
        return;
      }

      /*
       * Only:
       *
       * today <= checkout <= today + 15 days
       */
      if (
        checkoutDate <
          startDate ||
        checkoutDate >
          endDate
      ) {
        return;
      }

      /*
       * Mark bed as processed.
       */
      processedBeds.add(
        bedId
      );

      /*
       * Room is only needed for display.
       */
      const room =
        rooms.find(
          (item: any) =>
            Number(item?.id) ===
            Number(
              booking?.room_id
            )
        );

      const roomName =
        room?.room_name ||
        `Room ${
          booking?.room_id ?? "-"
        }`;

      /*
       * Bed is only needed for display.
       */
      const bed =
        bedInfoList.find(
          (item: any) =>
            Number(item?.id) ===
            bedId
        );

      /*
       * Format:
       *
       * 14 Aug
       */
      const formattedDate =
        checkoutDate.toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
          }
        );

      result.push({
        roomName,
        date: formattedDate,
        bedNumber:
          bed?.bed_number,
        bedId,
      });
    }
  );

  /*
   * Dashboard only needs the first 15.
   */
  return result.slice(
    0,
    15
  );
};