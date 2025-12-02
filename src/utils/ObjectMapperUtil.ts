import { plainToInstance } from 'class-transformer';

/**
 * 对象拷贝工具
 */
export class ObjectMapperUtil {
    /**
     * 对象属性拷贝
     */
    static copy<T>(source: any, targetClass: new () => T): T {
        return plainToInstance(targetClass, source);
    }

    /**
     * 批量对象拷贝
     */
    static copyList<T>(sources: any[], targetClass: new () => T): T[] {
        return plainToInstance(targetClass, sources);
    }
}

