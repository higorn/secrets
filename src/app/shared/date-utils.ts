export class DateUtils {
  static getUtcTime() {
    const d = new Date();
    return Date.parse(d.toUTCString());
  }
}