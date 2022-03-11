import { DateTime } from 'luxon';
import { ValueTransformer } from 'typeorm';

class DateTimeTransformer implements ValueTransformer {
	from(value: any): any {
		if (value instanceof Date) {
			return DateTime.fromJSDate(value);
		}
		if (typeof value === 'number') {
			return DateTime.fromMillis(value);
		}
		return undefined;
	}

	to(value: any): any {
		if (value instanceof Date) {
			return value.getTime();
		}
		if (value instanceof DateTime) {
			return value.toMillis();
		}
		return undefined;
	}
}

const instance = new DateTimeTransformer();

export default instance;
