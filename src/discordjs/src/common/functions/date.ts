export class DateWorking {
  date: Date;
  constructor(date: Date) {
    this.date = date;
  }

  public addSeconds(seconds: number): this {
    this.date.setSeconds(this.date.getSeconds() + seconds);
    return this;
  }

  public addMinutes(minutes: number): this {
    this.date.setMinutes(this.date.getMinutes() + minutes);
    return this;
  }

  public addHours(hours: number): this {
    this.date.setHours(this.date.getHours() + hours);
    return this;
  }

  public addDays(days: number): this {
    this.date.setDate(this.date.getDate() + days);
    return this;
  }

  public addWeeks(weeks: number): this {
    this.date.setDate(this.date.getDate() + weeks * 7);
    return this;
  }

  public addMonths(months: number): this {
    this.date.setMonth(this.date.getMonth() + months);
    return this;
  }

  public addYears(years: number): this {
    this.date.setFullYear(this.date.getFullYear() + years);
    return this;
  }
}


export function getHHMM(seconds: number): string {
  return `${Math.floor(seconds / 3600)}часов ${Math.floor((seconds % 3600) / 60)}минут`;
}