
export default function convertMinutesToHoursAndMinutes(minutes: number) {
  if (isNaN(minutes) || minutes < 0) {
    return "0";
  }

  var hours = Math.floor(minutes / 60);
  var remainingMinutes = minutes % 60;

  // Determine the hour and minute labels
  var hourLabel = "hr";
  var minuteLabel = "min"

  // Format the result
  if (hours > 0 && remainingMinutes > 0) {
    return `${hours} ${hourLabel} ${remainingMinutes} ${minuteLabel}`;
  } else if (hours > 0) {
    return `${hours} ${hourLabel}`;
  } else {
    return `${remainingMinutes} ${minuteLabel}`;
  }
}

