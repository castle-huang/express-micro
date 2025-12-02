import FlakeId from 'flake-idgen';
// @ts-ignore
import biguint from 'biguint-format';

export class SnowflakeUtil {
    private static instance: FlakeId;

    private constructor() {
    }

    public static getInstance(): FlakeId {
        if (!SnowflakeUtil.instance) {
            SnowflakeUtil.instance = new FlakeId({
                datacenter: 1,
                worker: 1
            });
        }
        return SnowflakeUtil.instance;
    }

    public static generateId(): string {
        const idBuffer = this.getInstance().next();
        return biguint(idBuffer, 'dec');
    }

    public static generateBigInt(): bigint {
        const idBuffer = this.getInstance().next();
        return BigInt(biguint(idBuffer, 'dec'));
    }

    public static generateBigString(): string {
        return this.generateBigInt().toString();
    }
}