// @flow
/* eslint-disable no-unused-vars */
export class Maybe<T> {
	static of(value: T): Just<T> {
		if (value == null) {
			throw new TypeError('Value must not be empty');
		}

		return new Just(value);
	}

	static nothing(): Nothing<T> {
		return new Nothing();
	}

	static ofNullable(value: ?T): Maybe<T> {
		return value == null ? Maybe.nothing() : Maybe.of(value);
	}

	+isPresent: boolean;

	+ifPresent: (concumer: T => any) => void;

	+filter: (predicate: T => boolean) => Maybe<T>;

	+flatMap: <G>(mapper: T => ?G) => Maybe<G>;

	+get: () => T;

	+orElse: (value: T) => T;

	+orElseGet: (producer: () => T) => T;

	+orElseThrow: (producer: () => Error) => T;
}

export class Just<T> extends Maybe<T> {
	+value: T;

	constructor(value: T) {
		super();
		this.value = value;
	}

	get isPresent(): boolean {
		return true;
	}

	ifPresent(consumer: T => any): void {
		consumer(this.value);
	}

	filter(predicate: T => boolean): Maybe<T> {
		return Maybe.ofNullable(predicate(this.value) ? this.value : null);
	}

	get(): T {
		return this.value;
	}

	flatMap<G>(mapper: T => ?G): Maybe<G> {
		return Maybe.ofNullable(mapper(this.value));
	}

	orElse(value: T): T {
		return this.value;
	}

	orElseGet(producer: () => T): T {
		return this.value;
	}

	orElseThrow(producer: () => Error): T {
		return this.value;
	}
}

export class Nothing<T> extends Maybe<T> {
	get isPresent(): boolean {
		return false;
	}

	ifPresent(consumer: T => any): void {
	}

	filter(predicate: T => boolean): Maybe<T> {
		return this;
	}

	get() {
		throw new TypeError('Cannot extract value of a Nothing');
	}

	flatMap<G>(mapper: T => ?G): Maybe<any> {
		return this;
	}

	orElse(value: T): T {
		return value;
	}

	orElseGet(producer: () => T): T {
		return producer();
	}

	orElseThrow(producer: () => Error): T {
		throw producer();
	}
}
