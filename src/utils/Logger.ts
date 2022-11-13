export enum LogLevel {
  INFO = "INFO",
  WARN = "WARNING",
  ERROR = "ERROR",
}

export class Logger {
  public static log(logLevel: LogLevel, message: string) {
    console.log(`[${logLevel}] ${message}`);
  }

  public static info(message: string) {
    console.log("\x1b[32m", `[${LogLevel.INFO}] ${message}`);
  }

  public static warning(message: string) {
    console.log("\x1b[33m", `[${LogLevel.WARN}] ${message}`);
  }

  public static error(message: string) {
    console.log("\x1b[31m", `[${LogLevel.ERROR}] ${message}`);
  }
}
