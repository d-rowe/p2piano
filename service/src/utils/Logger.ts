enum Severity {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export default class Logger {
  static INFO(message: string) {
    Logger.log(Severity.INFO, message);
  }

  static WARN(message: string) {
    Logger.log(Severity.WARN, message);
  }

  static ERROR(message: string) {
    Logger.log(Severity.ERROR, message);
  }

  private static log(severity: Severity, message: string) {
    console.log(`[${severity}] ${message}`);
  }
}
