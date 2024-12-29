import { encodeParameters, getFunctionSelector } from './abiEncoder';

export interface AbiFunctionItem {
  type: 'function' | string;
  name: string;
  inputs: { name?: string; type: string }[];
  // outputs, stateMutability...
}

export class ContractEncoder {
  [key: string]: any;
  private methods: Map<string, AbiFunctionItem> = new Map();

  constructor(private abi: AbiFunctionItem[]) {
    for (const item of abi) {
      if (item.type === 'function') {
        this.methods.set(item.name, item);
      }
    }

    return new Proxy(this, {
      get: (target: ContractEncoder, propertyKey: string | symbol, receiver: any) => {
        if (typeof propertyKey === 'string' && target.methods.has(propertyKey)) {
          return (...args: unknown[]) => {
            const abiItem = target.methods.get(propertyKey)!;
            const inputTypes = abiItem.inputs.map((i) => i.type);

            const signature =
              abiItem.name + '(' + inputTypes.join(',') + ')';

            const selector = getFunctionSelector(signature);

            const encodedArgs = encodeParameters(inputTypes, args);

            return '0x' + selector + encodedArgs;
          };
        }

        return Reflect.get(target, propertyKey, receiver);
      },
    });
  }
}