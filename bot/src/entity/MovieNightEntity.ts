import { DateTime, Duration } from 'luxon';
import Entity from '../interfaces/Entity';

export default class MovieNightEntity implements Entity {
	constructor( //
		public readonly id: number, //
		public readonly date: DateTime, //
		public readonly suggestDuration: Duration, //
		public readonly voteDuration: Duration, //
	) { //
	}
}
