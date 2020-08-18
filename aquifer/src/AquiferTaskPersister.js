// @ts-check
import { AquiferTimer } from './AquiferTimer';

export class AquiferTaskPersister {
  constructor(timeoutMillis) {
    this.timeoutMillis = timeoutMillis;
    this.timer = AquiferTimer.startTimer(timeoutMillis);

    this.error = null;
    this.hasSucceeded = false;
    this.implicitWaitInMillis = 0;
    this.numTries = 0;
    this.isTerminated = false;
  }

  static initialize(timeoutMillis) {
    return new AquiferTaskPersister(timeoutMillis);
  }

  getNumTries() {
    return this.numTries;
  }

  /** Sleeps for the given milliseconds only if task has not yet succeeded. */
  sleep(milliseconds) {
    if (!this.hasSucceeded) {
      this.timer.threadSleep(milliseconds);
    }
  }

  /** Resets the persister's timer and sets success flag to false, for new task. */
  restart() {
    this.timer = AquiferTimer.startTimer(this.timeoutMillis);
    this.hasSucceeded = false;
  }

  isFinished() {
    if (this.isTerminated) return true;

    if (this.numTries > 0) {
      this.sleep(this.implicitWaitInMillis);
    }

    this.numTries += 1;

    return this.hasSucceeded || this.timer.isExpired();
  }

  static persistUntil(timeoutMillis) {
    return new AquiferTaskPersister(timeoutMillis);
  }

  didSucceed() {
    return this.hasSucceeded;
  }

  printThrowableIfCaught() {
    if (this.error != null) {
      console.log('Throwable', this.error);
    }
  }

  setSuccess(didSucceed) {
    this.hasSucceeded = didSucceed;
  }

  setException(e) {
    console.log('Throwable', e);
    this.throwable = e;
  }

  /** Set the amount of time in milliseconds to wait between retrying the task. Defaults to 0 ms. */
  setImplicitWait(milliseconds) {
    this.implicitWaitInMillis = milliseconds;
    return this;
  }

  /** Terminates the task persister. */
  terminate() {
    this.isTerminated = true;
  }

  /** Get the elapsed time on the timer */
  getElapsedTime() {
    return this.timer.elapsedTime();
  }
}
