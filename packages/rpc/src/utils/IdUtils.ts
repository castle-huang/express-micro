import FlakeId from 'flake-idgen';
// @ts-ignore
import biguint from 'biguint-format';

export class SnowflakeUtil {
    private static instance: FlakeId;
    // Twitter雪花算法的时间起点 (2010-11-04 01:42:54.657 UTC)
    private static readonly TWITTER_EPOCH = 1288834974657;

    private constructor() {
    }

    public static getInstance(): FlakeId {
        if (!SnowflakeUtil.instance) {
            SnowflakeUtil.instance = new FlakeId({
                datacenter: 0,
                worker: 0,
                epoch: SnowflakeUtil.TWITTER_EPOCH  // 设置时间起点
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