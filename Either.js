// @flow
/* eslint-disable no-unused-vars */
export class Either<R, L> {
	constructor(value: R | L) {
		this.value = value;
	}

	static right(value: R): Either<R, L> {
		return new Right(value);
	}

	static left(value: L): Either<R, L> {
		return new Left(value);
	}

	+value: R | L;

	+flatMap: <G>(mapper: R => G) => Either<G, L>;

	+orElse: (value: R) => R;

	+orElseGet: (producer: L => R) => R;

	+orElseThrow: (producer: L => Error) => R;

	+doOnRight: (consumer: R => void) => Either<R, L>;

	+doOnLeft: (consumer: L => void) => Either<R, L>;
}

export class Right<R, L> extends Either<R, L> {
	flatMap<G>(mapper: R => G): Either<G, L> {
		return Either.right(mapper(this.value));
	}

	orElse(value: R): R {
		return this.value;
	}

	orElseGet(producer: L => R): R {
		return this.value;
	}

	orElseThrow(producer: L => Error): R {
		return this.value;
	}

	doOnRight(consumer: R => void): Either<R, L> {
		consumer(this.value);
		return this;
	}

	doOnLeft(consumer: L => void): Either<R, L> {
		return this;
	}

	+value: R;
}

export class Left<R, L> extends Either<R, L> {
	// eslint-disable-next-line no-useless-constructor
	constructor(value: L) {
		super(value);
	}

	flatMap<G>(mapper: R => G): Either<any, L> {
		return this;
	}

	orElse(value: R): R {
		return value;
	}

	orElseGet(producer: L => R): R {
		return producer(this.value);
	}

	orElseThrow(producer: L => Error): R {
		throw producer(this.value);
	}

	doOnRight(consumer: R => void): Either<R, L> {
		return this;
	}

	doOnLeft(consumer: L => void): Either<R, L> {
		consumer(this.value);
		return this;
	}

	+value: L;
}
