export interface MerchantUser {
    /**
     * 主键ID
     */
    id?: bigint;

    /**
     * avatar URL
     */
    avatarUrl?: string;

    /**
     * 邮箱地址
     */
    email?: string;

    /**
     * 全名
     */
    fullName?: string;

    /**
     * 电话区号
     */
    phoneCode?: string;

    /**
     * 电话号码
     */
    phone?: string;

    /**
     * 完整电话号码（包含区号）
     */
    fullPhone?: string;

    /**
     * 更新时间
     */
    updateTime?: Date;

    /**
     * 创建时间
     */
    createTime?: Date;

    /**
     * 密码
     */
    password?: string;
}