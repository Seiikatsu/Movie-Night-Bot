import { DateTime, Duration } from 'luxon';

export default interface Period {

	/**
	 * Inclusive.
	 */
	readonly start: DateTime;

	/**
	 * Exclusive.
	 */
	readonly end: DateTime;

	readonly duration: Duration;

	readonly text: string;
}
