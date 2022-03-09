import { Column, Entity } from 'typeorm';
import AbstractStorageEntity from './AbstractStorageEntity';

@Entity('movie_night')
export default class MovieNightStorage extends AbstractStorageEntity {
	@Column({ name: 'suggest_until' })
		suggestUntil!: Date;

	@Column({ name: 'vote_until' })
		voteUntil!: Date;

	@Column({ name: 'max_suggestions' })
		maxSuggestions?: number;
}
