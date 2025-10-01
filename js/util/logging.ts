
export enum LogLevel {
    DEBUG,
    INFORMATION,
    WARNING,
    CRITICAL
}

class Logger {
    private readonly logThreshold : LogLevel;
    private readonly browser : boolean;

    constructor(logThreshold : LogLevel = LogLevel.INFORMATION,browser : boolean = false) {
        this.logThreshold = logThreshold;
        this.browser = browser;
    }

    public log(level: LogLevel, ...message: any[]) {
      if (level<this.logThreshold || !this.browser) { return; }
      switch(level) {
        case LogLevel.CRITICAL:
          console.error(message);
          break;
        case LogLevel.WARNING:
          console.warn(message);
          break;
        case LogLevel.INFORMATION:
          console.info(message);
          break;
        case LogLevel.DEBUG:
          console.debug(message);
          break;
        default:
          console.log(message);
      }
    }


    }

    export const syslog = new Logger();