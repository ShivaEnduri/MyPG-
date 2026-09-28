import {
  getStartOfToday,
  getEndOf15thDay,
} from "./dashboardCalculations";

export interface VacancyItem {
  roomName: string;
  date: string;
  bedNumber?: string | number;
  bedId: number;
}

export const BOOKING_STATUS = {
  OCCUPIED: 1,
};

export function getUpcomingVacancies(
  bookings: any[] = [],
  rooms: any[] = [],
  bedInfoList: any[] = []
): VacancyItem[] {
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
   * Prevent the same bed from
   * appearing multiple times.
   */
  const processedBeds =
    new Set<number>();

  /*
   * Earliest checkout first.
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

  for (
    const booking of sortedBookings
  ) {
    /*
     * Only occupied bookings
     * can become vacancies.
     */
    if (
      Number(
        booking?.bkg_status
      ) !==
      BOOKING_STATUS.OCCUPIED
    ) {
      continue;
    }

    const bedId =
      Number(booking?.bed_id);

    if (
      !bedId ||
      processedBeds.has(bedId)
    ) {
      continue;
    }

    const checkoutValue =
      booking?.planned_check_out_date;

    if (!checkoutValue) {
      continue;
    }

    const checkoutDate =
      new Date(checkoutValue);

    if (
      Number.isNaN(
        checkoutDate.getTime()
      )
    ) {
      continue;
    }

    /*
     * Only vacancies between:
     *
     * Today
     * +
     * 15 days
     */
    if (
      checkoutDate <
        startDate ||
      checkoutDate >
        endDate
    ) {
      continue;
    }

    processedBeds.add(
      bedId
    );

    /*
     * Room is only needed
     * for display.
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
     * Bed is only needed
     * for display.
     */
    const bed =
      bedInfoList.find(
        (item: any) =>
          Number(item?.id) ===
          bedId
      );

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

    /*
     * We only need 15 vacancies
     * for the dashboard.
     */
    if (
      result.length >= 15
    ) {
      break;
    }
  }

  return result;
}