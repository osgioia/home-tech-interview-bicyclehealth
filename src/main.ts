/*
   Bicycle Health Interview - Get Availabile Time Ranges:
   -------------------------------------------------------

   Implement `getAvailableTimeRanges`. This function returns the available appointment time ranges for a
   provider for a given a date range. The time ranges must be greater than or equal to the duration
   of the appointment type the provider is trying to book.

   Also, please add additional test cases as needed.

   Considerations:
        - Provider calendars are stored in google calendar. Use `getCalenderEvents` to fetch this data.
        - Provider appointments are stored in an external EMR service. Use `getBookedAppointments` to
          fetch this data.

   Example:

   Assume `getAvailableTimeRanges` is called with a provider for whom we are trying to book a FOLLOWUP_30
   appointment from July 1, 2020 @ 1pm to July 1, 2020 @ 5pm. And assume that the provider has a single
   non-appointment calendar event on July 1, 2020 @ 1:45pm until July 1, 2020 @ 2:15pm. Also assume that
   the provider has a single booked NEW_PATIENT_60 appointment from July 1, 2020 @ 3pm - 4pm. Given the above,
   `getAvailableTimeRanges` should return the following available time ranges:
   - range 1: start: July 1, 2020 @ 1pm, end: July 1, 2020 @ 1:45pm
   - range 2: start: July 1, 2020 @ 2:15pm, end: July 1, 2020 @ 3:00pm
   - range 3: start: July 1, 2020 @ 4pm, end: July 1, 2020 @ 5pm

  For an example test see main.test.ts.

   NOTE: You are allowed to look things up on the internet and install any npm modules that you need.
*/
import * as moment from 'moment';

type CalendarEvent = {
  calenderEventId: string;
  start: Date;
  end: Date;
};

type GetCalendarEvents = (
  providerId: string,
  start: Date,
  end: Date,
) => Promise<CalendarEvent[]>;

export enum AppointmentTypeId {
  FOLLOWUP_15 = 'FOLLOWUP_15',
  FOLLOWUP_30 = 'FOLLOWUP_30',
  NEW_PATIENT_60 = 'NEW_PATIENT_60',
}

type Appointment = {
  appointmentId: string;
  appointmentTypeId: AppointmentTypeId;
  start: Date;
};

type GetBookedAppointments = (
  providerId: string,
  start: Date,
  end: Date,
) => Promise<Appointment[]>;

type AppointmentType = {
  appointmentTypeId: AppointmentTypeId;
  name: string;
  durationMins: number;
};

export const appointmentTypes: AppointmentType[] = [
  {
    appointmentTypeId: AppointmentTypeId.FOLLOWUP_15,
    name: '15 min Follow Up',
    durationMins: 15,
  },
  {
    appointmentTypeId: AppointmentTypeId.FOLLOWUP_30,
    name: '30 min Follow Up',
    durationMins: 30,
  },
  {
    appointmentTypeId: AppointmentTypeId.NEW_PATIENT_60,
    name: '60 min New Patient',
    durationMins: 60,
  },
];

export type TimeRange = {
  start: Date;
  end: Date;
};

export interface AppointmentAvailabilityDeps {
  getCalendarEvents: GetCalendarEvents;
  getBookedAppointments: GetBookedAppointments;

}

export class AppointmentAvailability {
  private getCalendarEvents: GetCalendarEvents;
  private getBookedAppointments: GetBookedAppointments;

  constructor(deps: AppointmentAvailabilityDeps) {
    this.getCalendarEvents = deps.getCalendarEvents;
    this.getBookedAppointments = deps.getBookedAppointments;
  }

  


  async getAvailableTimeRanges(
    providerId: string,
    appointmentTypeId: AppointmentTypeId,
    start: Date,
    end: Date,
  ): Promise<TimeRange[]> {
    /* IMPLEMENT */



  const calendarEvents = await this.getCalendarEvents(providerId,start, end)
  const parsedCalendarEvents = calendarEvents.map((element) => {
    return {start: element.start, end: element.end}
  })

 console.log(calendarEvents);
 console.log(parsedCalendarEvents);
 
 
  
  const bookedAppointments = await this.getBookedAppointments(providerId, start, end)
  const parsedBookedAppointment = bookedAppointments.map((element) => {
    let endTime
    if (element.appointmentTypeId === AppointmentTypeId.NEW_PATIENT_60 ) {
      endTime = new Date(moment.utc(element.start).add().minutes(60).toDate() )
    }
    return { start: element.start, end: endTime }
  })



  const assumeTime = [parsedCalendarEvents.reduce((element) => {
    return element
  })
  , parsedBookedAppointment.reduce((element) => {
    return element
  })]

  console.log(assumeTime);
  

    const availableTimeArray = [];

    const startTimeMin : moment.Moment = moment.utc(start);
    const endTimeMax: moment.Moment = moment.utc(end);

    assumeTime.forEach((element, index) => {
      const currentStartTime: moment.Moment = moment.utc(element.start);
      const currentEndTime: moment.Moment = moment.utc(element.end);
    
      if (index === assumeTime.length - 1) {
        availableTimeArray.push({
          start: moment.utc(currentEndTime).toDate(),
          end: moment.utc(endTimeMax).toDate(),
        });
      } else {
        if (index === 0) {
          availableTimeArray.push({
            start: moment.utc(startTimeMin).toDate(),
            end: moment.utc(currentStartTime).toDate(),
          });
        }
        const nextBusyTime  = assumeTime[index + 1];
        const beforeBusyTime = assumeTime[index];
        const nextStartTime : moment.Moment = moment.utc(nextBusyTime.start);
    
        availableTimeArray.push({
          start: moment.utc(beforeBusyTime.end).toDate(),
          end: moment.utc(nextStartTime).toDate(),
        });
      }
    });

    return availableTimeArray;
 
  }
}
