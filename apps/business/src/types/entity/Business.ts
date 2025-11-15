export interface Business {
    /**
     * 主键ID
     */
    id?: string;

    /**
     * 商户拥有者ID
     */
    owner_id?: string;

    /**
     * 名称
     */
    name?: string;

    /**
     * logo url
     */
    logoUrl?: string;

    /**
     * website
     */
    website?: string;

    /**
     * location
     */
    location?: string;

    /**
     * room number
     */
    rooms?: number;

    /**
     * chair number
     */
    chairs?: number;

    /**
     * 描述
     */
    description?: string;

    /**
     * 业务时间
     */
    businessHours?: string;

    /**
     * 更新时间
     */
    updateTime?: Date;

    /**
     * 创建时间
     */
    createTime?: Date;
}