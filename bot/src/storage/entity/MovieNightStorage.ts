import { DateTime, Duration } from 'luxon';
import { Column, Entity } from 'typeorm';
import DateTimeTransformer from '../transformer/DateTimeTransformer';
import DurationTransformer from '../transformer/DurationTransformer';
import AbstractStorageEntity from './AbstractStorageEntity';

@Entity('movie_night')
export default class MovieNightStorage extends AbstractStorageEntity {
	@Column({
		name: 'date',
		type: 'bigint',
		transformer: DateTimeTransformer,
	})
		date!: DateTime;

	@Column({
		name: 'suggest_until',
		type: 'bigint',
		transformer: DurationTransformer,
	})
		suggestUntil!: Duration;

	@Column({
		name: 'vote_until',
		type: 'bigint',
		transformer: DurationTransformer,
	})
		voteUntil!: Duration;

	@Column({
		name: 'max_suggestions',
		type: 'integer',
		nullable: true,
	})
		maxSuggestions!: number | null;
}
