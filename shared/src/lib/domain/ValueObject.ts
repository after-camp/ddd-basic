interface ValueObjectProps {
  [index: string]: any;
}

/**
 * @desc ValueObjects are objects that we determine their
 * equality through their structrual property.
 */

export class ValueObject<T extends ValueObjectProps> {
  public props: T;

  constructor(props: T) {
    let baseProps: any = {
      ...props,
    };

    this.props = baseProps;
  }

  static unsafeCreate(value: any) {
    return new ValueObject({ value });
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.props === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
