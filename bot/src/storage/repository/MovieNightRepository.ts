import { Clazz } from '../../@types/Clazz';
import { requestScoped } from '../../ioc';
import MovieNightStorage from '../entity/MovieNightStorage';
import AbstractRepository from './AbstractRepository';

@requestScoped()
export default class MovieNightRepository extends AbstractRepository<MovieNightStorage> {
	protected getEntityType(): Clazz<MovieNightStorage> {
		return MovieNightStorage;
	}
}
