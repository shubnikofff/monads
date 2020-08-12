// @flow
import { Either, Left, Right } from './Either';

describe('Class Either', () => {
	const rightValue: number = 42;
	const right: Either<number, number> = Either.right(rightValue);
	const leftValue: number = NaN;
	const left: Either<number, number> = Either.left(leftValue);

	const addThree = (value: number): number => value + 3;
	const mockAddThree = jest.fn((value: number) => addThree(value));
	const mockConsumer = jest.fn();

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('method left', () => {
		it('should return new instance of Left', () => {
			expect(Either.left(42)).toBeInstanceOf(Left);
		});
	});

	describe('method right', () => {
		it('should return new instance of Right', () => {
			expect(Either.right(42)).toBeInstanceOf(Right);
		});
	});

	describe('method flatMap', () => {
		describe('of instance Right', () => {
			it('should return new instance of Right', () => {
				expect(right.flatMap(addThree)).toBeInstanceOf(Right);
				expect(right.flatMap(addThree)).not.toBe(right);
			});

			it('should return instance with calculated value', () => {
				expect(right.flatMap(addThree).orElse(leftValue)).toBe(addThree(rightValue));
			});

			it('should call provided function with contained value', () => {
				right.flatMap(mockAddThree);
				expect(mockAddThree).toBeCalledWith(rightValue);
			});
		});

		describe('of instance Left', () => {
			it('should return own instance', () => {
				expect(left.flatMap(addThree)).toBe(left);
			});
		});
	});

	describe('method orElse', () => {
		describe('of instance Right', () => {
			it('should return contained value', () => {
				expect(right.orElse(leftValue)).toBe(rightValue);
			});
		});

		describe('of instance Left', () => {
			it('should return provided value', () => {
				expect(left.orElse(rightValue)).toBe(rightValue);
			});
		});
	});

	describe('method orElseGet', () => {
		describe('of instance Right', () => {
			it('should not call provided function', () => {
				right.orElseGet(mockAddThree);
				expect(mockAddThree).not.toHaveBeenCalled();
			});

			it('should return contained value', () => {
				expect(right.orElseGet(addThree)).toBe(rightValue);
			});
		});

		describe('of instance Left', () => {
			it('should call provided function with contained value', () => {
				left.orElseGet(mockAddThree);
				expect(mockAddThree).toBeCalledWith(leftValue);
			});

			it('should return calculated value', () => {
				expect(left.orElseGet(addThree)).toEqual(addThree(leftValue));
			});
		});
	});

	describe('method orElseThrow', () => {
		const error: Error = new Error('message');

		describe('of instance Right', () => {
			it('should return contained value', () => {
				expect(right.orElseThrow(() => error)).toBe(rightValue);
			});
		});

		describe('of instance Left', () => {
			it('should throw provided error', () => {
				expect(() => {
					left.orElseThrow(() => error);
				}).toThrow(error);
			});

			it('should map left value to error', () => {
				try {
					left.orElseThrow((l) => new Error(String(l)));
					expect(true).toBe(false);
				} catch (e) {
					expect(e.message).toBe(String(leftValue));
				}

				expect(() => {
					left.orElseThrow(() => error);
				}).toThrow(error);
			});
		});
	});

	describe('method doOnRight', () => {
		describe('of instance Right', () => {
			it('should call provided function with contained value', () => {
				right.doOnRight(mockConsumer);
				expect(mockConsumer).toBeCalledWith(rightValue);
			});

			it('should return own instance', () => {
				expect(right.doOnRight(mockConsumer)).toBe(right);
			});
		});

		describe('of instance Left', () => {
			it('should not call provided function', () => {
				left.doOnRight(mockConsumer);
				expect(mockConsumer).not.toHaveBeenCalled();
			});

			it('should return own instance', () => {
				expect(left.doOnRight(mockConsumer)).toBe(left);
			});
		});
	});

	describe('method doOnLeft', () => {
		describe('of instance Right', () => {
			it('should not call provided function', () => {
				right.doOnLeft(mockConsumer);
				expect(mockConsumer).not.toHaveBeenCalled();
			});

			it('should return own instance', () => {
				expect(right.doOnLeft(mockConsumer)).toBe(right);
			});
		});

		describe('of instance Left', () => {
			it('should call provided function with contained value', () => {
				left.doOnLeft(mockConsumer);
				expect(mockConsumer).toBeCalledWith(NaN);
			});

			it('should return own instance', () => {
				expect(left.doOnLeft(mockConsumer)).toBe(left);
			});
		});
	});
});
