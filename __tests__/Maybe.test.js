// @flow
import { Maybe, Nothing, Just } from './Maybe';

describe('Class Maybe', () => {
	const justValue: number = 42;
	const just: Just<number> = Maybe.of(justValue);
	const nothing: Nothing<number> = Maybe.nothing();

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('method of', () => {
		it('should create instance of Just', () => {
			expect(Maybe.of(justValue)).toBeInstanceOf(Just);
			expect(Maybe.of('')).toBeInstanceOf(Just);
			expect(Maybe.of(0)).toBeInstanceOf(Just);
			expect(Maybe.of(false)).toBeInstanceOf(Just);
		});

		it('should throw error when calling with undefined argument', () => {
			expect(() => {
				Maybe.of();
			}).toThrow(new TypeError('Value must not be empty'));
		});

		it('should throw error when calling with null argument', () => {
			expect(() => {
				Maybe.of(null);
			}).toThrow(new TypeError('Value must not be empty'));
		});
	});

	describe('method empty', () => {
		it('should return instance of Nothing', () => {
			expect(Maybe.nothing()).toBeInstanceOf(Nothing);
		});
	});

	describe('method ofNullable', () => {
		it('should return instance of Just', () => {
			expect(Maybe.ofNullable(justValue)).toBeInstanceOf(Just);
			expect(Maybe.ofNullable('')).toBeInstanceOf(Just);
			expect(Maybe.ofNullable(0)).toBeInstanceOf(Just);
			expect(Maybe.ofNullable(false)).toBeInstanceOf(Just);
		});

		it('should return instance of Nothing', () => {
			expect(Maybe.ofNullable()).toBeInstanceOf(Nothing);
			expect(Maybe.ofNullable(null)).toBeInstanceOf(Nothing);
		});
	});

	describe('property isPresent', () => {
		describe('of instance Just', () => {
			it('should be true', () => {
				expect(just.isPresent).toBe(true);
			});
		});

		describe('of instance Nothing', () => {
			it('should be false', () => {
				expect(nothing.isPresent).toBe(false);
			});
		});
	});


	describe('method ifPresent', () => {
		const consumer: number => any = jest.fn();
		describe('of instance Just', () => {
			it('should should call consumer with contained value', () => {
				just.ifPresent(consumer);
				expect(consumer).toBeCalledWith(justValue);
			});
		});

		describe('of instance Nothing', () => {
			it('should should not call consumer', () => {
				nothing.ifPresent(consumer);
				expect(consumer).not.toBeCalled();
			});
		});
	});

	describe('method filter', () => {
		describe('of instance Just', () => {
			const predicate: number => boolean = v => v === justValue;

			it('should return instance of Just', () => {
				expect(just.filter(predicate)).toBeInstanceOf(Just);
			});

			it('should return instance with same value', () => {
				expect(just.filter(predicate).get()).toBe(justValue);
			});

			it('should return instance of Nothing', () => {
				expect(just.filter(v => v !== justValue)).toBeInstanceOf(Nothing);
			});
		});

		describe('of instance Nothing', () => {
			it('should return own instance', () => {
				expect(nothing.filter(() => true)).toBe(nothing);
			});
		});
	});

	describe('method flatMap', () => {
		const mapper: number => number = (value: number): number => value + 3;

		describe('of instance Just', () => {
			const mockedMapper: Function = jest.fn((value: number) => mapper(value));

			it('should return instance of Just', () => {
				expect(just.flatMap(mapper)).toBeInstanceOf(Just);
			});

			it('should call functor with contained value', () => {
				just.flatMap(mockedMapper);
				expect(mockedMapper).toBeCalledWith(justValue);
			});

			it('should return instance with calculated value', () => {
				expect(just.flatMap(mapper).get()).toBe(mapper(justValue));
			});
		});

		describe('of instance Nothing', () => {
			it('should return own object', () => {
				expect(nothing.flatMap(mapper)).toBe(nothing);
			});
		});
	});

	describe('method get', () => {
		describe('of instance Just', () => {
			it('should return contained value', () => {
				expect(just.get()).toBe(justValue);
			});
		});

		describe('of instance Nothing', () => {
			it('should throw error', () => {
				expect(() => {
					nothing.get();
				}).toThrow(new TypeError('Cannot extract value of a Nothing'));
			});
		});
	});

	describe('method orElse', () => {
		describe('of instance Just', () => {
			it('should return contained value', () => {
				expect(just.orElse(123)).toBe(justValue);
			});
		});

		describe('of instance Nothing', () => {
			it('should return provided value', () => {
				expect(nothing.orElse(justValue)).toBe(justValue);
			});
		});
	});

	describe('method orElseGet', () => {
		const producedValue: number = justValue + 1;
		const producer: void => number = () => producedValue;

		describe('of instance Just', () => {
			it('should return contained value', () => {
				expect(just.orElseGet(producer)).toBe(justValue);
			});
		});

		describe('of instance Nothing', () => {
			const mockedProducer: Function = jest.fn(producer);

			it('should call provided producer', () => {
				nothing.orElseGet(mockedProducer);
				expect(mockedProducer).toHaveBeenCalled();
			});

			it('should return justValue', () => {
				expect(nothing.orElseGet(producer)).toBe(producedValue);
			});
		});
	});

	describe('method orElseThrow', () => {
		const error: Error = new Error('message');

		describe('of instance Just', () => {
			it('should should return contained value', () => {
				expect(just.orElseThrow(() => error)).toBe(justValue);
			});
		});

		describe('on instance Nothing', () => {
			it('should throw passed error', () => {
				expect(() => {
					nothing.orElseThrow(() => error);
				}).toThrow(error);
			});
		});
	});
});
