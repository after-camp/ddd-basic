import {UniqueEntityID} from './UniqueEntityID';

const isEntity = (v: any): v is EntityClass<any> => {
  return v instanceof EntityClass;
};

export abstract class EntityClass<T> {
  readonly _id: UniqueEntityID;
  public readonly props: T;

  constructor(props: T, id?: UniqueEntityID) {
    this._id = id ? id : new UniqueEntityID();
    this.props = props;
  }

  public equals(object?: EntityClass<T>): boolean {

    if (object == null || object == undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!isEntity(object)) {
      return false;
    }

    return this._id.equals(object._id);
  }
}

export function Entity<T extends { new(...args: any[]): any }>(Klass: T) {
  return class extends Klass {
    constructor(...args: any[]) {
      super(...args);
    }
  }
}
