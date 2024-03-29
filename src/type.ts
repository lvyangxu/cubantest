import dayjs from 'dayjs'

/** 合同信息 */
export interface ContractInfo {
    /** 合同开始日期 */
    startDate: dayjs.Dayjs
    /** 合同结束日期 */
    endDate: dayjs.Dayjs
    /** 每月租金 */
    monthlyRent: number
    /** 交租周期，月 */
    rentPaymentPeriod: number
}

/** 每月账单 */
export interface MonthlyBill extends Pick<ContractInfo, 'startDate' | 'endDate'> {
    /** 月数/天数，不足一月按天数计算 */
    monthOrDayCount: number
    /** 总价 */
    totalPrice: number
    /** 单价 */
    unitPrice: number
    /** 单位类型，1=月，2=日 */
    unitType: number
}

/** 每阶段账单 */
export interface PeriodBill extends Pick<ContractInfo, 'startDate' | 'endDate'> {
    /** 交租日期 */
    rentPaymentDate: dayjs.Dayjs
    /** 总价 */
    totalPrice: number
}
