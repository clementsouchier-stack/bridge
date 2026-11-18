export enum FormatDurations {
  HHMMSS = "hhmmss",
  MMSS = "mmss",
  MINSEC = "minsec",
}

export const formatDuration = (duration: number, format: FormatDurations) => {
  if (!duration) {
    return null;
  }
  const hours: number = Math.floor(duration / 60 / 60);
  const minutes: number = Math.floor((duration / 60) % 60);
  const mm: string = minutes >= 10 ? `${minutes}` : `0${minutes}`;
  const ss: number = duration % 60;
  const seconds: string = ss >= 10 ? `${ss}` : `0${ss}`;
  if (format === FormatDurations.MINSEC) {
    if (minutes === 0 && ss > 0) {
      return `${ss} sec`;
    }
    if (minutes > 0 && ss === 0) {
      return `${minutes} min`;
    }
    return `${minutes} min ${seconds} sec`;
  }
  if (format === FormatDurations.HHMMSS) {
    if (hours > 0 && minutes === 0 && ss > 0) {
      return `${hours} hr ${ss} sec`;
    }
    if (hours > 0 && minutes > 0 && ss === 0) {
      return `${hours} hr ${minutes} min`;
    }
    if (hours === 0 && minutes === 0 && ss > 0) {
      return `${ss} sec`;
    }
    if (hours === 0 && minutes > 0 && ss === 0) {
      return `${minutes} min`;
    }
    return hours > 0 ? `${hours} hr ${minutes} min ${ss} sec` : `${minutes} min ${ss} sec`;
  }
  return hours > 0 ? `${hours}:${mm}:${seconds}` : `${minutes}:${seconds}`;
};

export const FORMAT_OPTIONS: any = {
  "DD/MM/YYYY": { day: "numeric", month: "numeric", year: "numeric" },
  "DD/MM/YY": { day: "numeric", month: "numeric", year: "2-digit" },
  "YYYY/MM/DD": { year: "numeric", month: "2-digit", day: "2-digit" },
  "MMM Do YY": {
    month: {
      month: "short",
    },
    year: {
      year: "2-digit",
    },
  },
};
const suffixes = {
  one: "st",
  two: "nd",
  few: "rd",
  other: "th",
};
export const timestampToDate = (formatLocale, timestamp, format = FORMAT_OPTIONS["DD/MM/YYYY"]) => {
  let locale = "en-GB";
  if (!timestamp) {
    return null;
  }
  if (formatLocale) {
    locale = formatLocale;
  }
  const formatedLocale = locale.includes("_") ? locale.replace("_", "-") : locale;
  const date = new Date(timestamp * 1000);
  if (format === FORMAT_OPTIONS["MMM Do YY"]) {
    const pr = new Intl.PluralRules(formatedLocale, {
      type: "ordinal",
    });
    const month = new Intl.DateTimeFormat(formatedLocale, FORMAT_OPTIONS["MMM Do YY"].month).format(
      date,
    );
    const year = new Intl.DateTimeFormat(formatedLocale, FORMAT_OPTIONS["MMM Do YY"].year).format(
      date,
    );
    const day = `${date.getDate()}${suffixes[pr.select(date.getDate())]}`;
    return `${month} ${day} ${year}`;
  }
  if (format === FORMAT_OPTIONS["YYYY/MM/DD"]) {
    let date = new Intl.DateTimeFormat("ko-KR", FORMAT_OPTIONS["YYYY/MM/DD"]).format(timestamp);
    date = date.replace(/\./g, "-");
    date = date.replace(/ /g, "").slice(0, -1);
    return date;
  }
  return new Intl.DateTimeFormat(formatedLocale, format).format(date);
};

export const secondsToHHMMSS = (duration: number): string => {
  const result: Array<string> = [];
  if (!duration || Number.isNaN(duration)) {
    return "0:00";
  }
  const hours = Math.floor(duration / 3600);
  if (hours > 0) {
    result.push(`${hours}`);
  }
  const minutes = Math.floor((duration / 60) % 60);
  if (minutes < 10 && hours > 0) {
    result.push(`0${minutes}`);
  } else {
    result.push(`${minutes}`);
  }
  const seconds = Math.floor(duration % 60);
  if (seconds < 10) {
    result.push(`0${seconds}`);
  } else {
    result.push(`${seconds}`);
  }
  return result.join(":");
};

export const formatDate = (date: Date) => {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString(navigator.language || "en");
};

export const formatCompleteDate = (date: Date): string => {
  if (!date) {
    return null;
  }
  if (isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}/${month}/${day}`;
};
