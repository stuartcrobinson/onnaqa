// @ts-check
import { AquiferTaskPersister } from './AquiferTaskPersister';

export class AquiferFunctionalPersister {
  constructor(timeoutInMillis = 60 * 1000) {
    this.timeoutInMillis = Math.round(timeoutInMillis);
    this.timeBetweenActionsInMillis = 200;
    this.goal = () => false;
    this.task = () => { };
    this.chore = () => { };
    this.consequence = () => { };
    this.failFast = false;
    this.exceptionMessage = null;
    this.precondition = () => true;
    this.exceptionMessageRunner = () => null;
  }

  setTimeout(timeoutInMillis) {
    this.timeoutInMillis = timeoutInMillis;
    return this;
  }

  setTimeBetweenActions(timeBetweenActionsInMillis) {
    this.timeBetweenActionsInMillis = Math.round(timeBetweenActionsInMillis);
    return this;
  }

  setGoal(goal) {
    this.goal = goal;
    return this;
  }

  setPrecondition(precondition) {
    this.precondition = precondition;
    return this;
  }

  /** Per loop, the task to perform before checking `goal`. */
  setTask(task) {
    this.task = task;
    return this;
  }

  /** Per loop, the task to perform after `goal` fails. */
  setChore(chore) {
    this.chore = chore;
    return this;
  }

  setConsequence(consequence) {
    this.consequence = consequence;
    return this;
  }

  failFastWithMessage(exceptionMessage) {
    this.failFast = true;
    this.exceptionMessage = exceptionMessage;
    return this;
  }

  failFastWithMessageRunner(exceptionMessageRunner) {
    this.failFast = true;
    this.exceptionMessageRunner = exceptionMessageRunner;
    return this;
  }


  /**
   * Execute the wait task using the timeouts and condition supplied by setters. Fails quietly by default; override with
   * {@link #failfastWithMessage}.
   */
  start() {
    if (this.precondition()) {
      const p = AquiferTaskPersister
        .initialize(this.timeoutInMillis)
        .setImplicitWait(this.timeBetweenActionsInMillis);

      while (!p.isFinished()) {
        try {
          this.task();
          p.setSuccess(this.goal());
          if (!p.didSucceed()) {
            this.chore();
          }
        } catch (error) {
          p.setException(error);
        }
        p.printThrowableIfCaught();
      }

      if (!p.didSucceed()) {
        this.consequence();

        if (this.failFast) {
          try {
            this.exceptionMessage = this.exceptionMessage || this.exceptionMessageRunner();
          } catch (error) {
            console.log('Throwable', error);
          }

          throw Error(`${this.exceptionMessage}. ${p.getNumTries()} attempts over ${p.timer.elapsedTimeString()}`);
        }
      }
      return p.didSucceed();
    }
    return null;
  }
}
