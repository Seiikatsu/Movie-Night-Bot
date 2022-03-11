import { Duration } from 'luxon';
import { ValueTransformer } from 'typeorm';

class DurationTransformer implements ValueTransformer {
	from(value: any): any {
		if (typeof value === 'number') {
			return Duration.fromMillis(value);
		}
		return undefined;
	}

	to(value: any): any {
		if (value instanceof Duration) {
			return value.toMillis();
		}
		return undefined;
	}
}

const instance = new DurationTransformer();
export default instance;
