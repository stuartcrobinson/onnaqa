// @ts-check
import { AquiferWait } from './AquiferWait';


const ONE_MIN_MILLIS = 60000;
const ONE_SEC_MILLIS = 1000;


export class AquiferTimer {
  constructor(timeoutMillis) {
    this.timeoutMillis = timeoutMillis;
    this.startTime = new Date().getTime();
  }

  elapsedTime() {
    return new Date().getTime() - this.startTime;
  }

  elapsedTimeString() {
    const elapsedTime = this.elapsedTime();

    if (elapsedTime >= ONE_MIN_MILLIS) {
      return `${elapsedTime / ONE_MIN_MILLIS} minutes`;
    } if (elapsedTime >= ONE_SEC_MILLIS) {
      return `${elapsedTime / ONE_SEC_MILLIS} seconds`;
    }
    return `${elapsedTime} milliseconds`;
  }


  static startTimer(timeoutMillis) {
    return new AquiferTimer(timeoutMillis);
  }

  isExpired() {
    return this.elapsedTime() > this.timeoutMillis;
  }

  threadSleep(sleepMillis) {
    AquiferWait.sleep(sleepMillis);
  }
}
