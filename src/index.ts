import { MonthlyBill, PeriodBill, ContractInfo } from './type'

/** 计算每月账单 */
export function calcMonthlyBills(contractInfo: ContractInfo): MonthlyBill[] {
    const { startDate, endDate, monthlyRent } = contractInfo
    if (startDate > endDate) {
        throw new Error('合同开始日期不能大于结束日期')
    }

    const bills: MonthlyBill[] = []
    let tempStart = startDate.clone()
    let isFirstPeriod = true
    let isLastPeriod = false
    while (tempStart.unix() < endDate.unix()) {
        let tempEnd = tempStart.clone()
        tempEnd = tempEnd.set('date', tempEnd.daysInMonth())
        if (tempEnd.unix() > endDate.unix()) {
            // 最后一个阶段
            tempEnd = endDate.clone()
            isLastPeriod = true
        }
        let rentPaymentDate = tempStart
        if (!isFirstPeriod) {
            rentPaymentDate = rentPaymentDate.add(-1, 'months').set('date', 15)
        }
        let monthOrDayCount = 1
        let unitType = 1
        // 判断是否是整月
        const isStartAndNotFullMonth = isFirstPeriod && tempStart.date() !== 1
        const isEndAndNotFullMonth = isLastPeriod && tempEnd.date() !== tempEnd.daysInMonth()
        if (isStartAndNotFullMonth || isEndAndNotFullMonth) {
            // 如果开始或结束日期不是整月，则按天来计算
            monthOrDayCount = tempEnd.diff(tempStart, 'days') + 1
            unitType = 2
        }
        // 计算该阶段的总租金，不足月按年租金/365 * 天数
        let totalPrice = 0
        if (isStartAndNotFullMonth || isEndAndNotFullMonth) {
            totalPrice += Number(((monthlyRent * 12 * (tempEnd.diff(tempStart, 'days') + 1)) / 365).toFixed(2))
        } else {
            totalPrice += monthlyRent
        }

        bills.push({
            startDate: tempStart,
            endDate: tempEnd,
            // rentPaymentDate,
            monthOrDayCount,
            unitType,
            totalPrice,
            unitPrice: Number((totalPrice / monthOrDayCount).toFixed(2)),
        })
        isFirstPeriod = false
        tempStart = tempEnd.add(1, 'days')
    }
    return bills
}

/** 每月账单转为阶段账单 */
export function monthlyBills2PeriodBills(jsonParam: { monthlyBills: MonthlyBill[]; rentPaymentPeriod: ContractInfo['rentPaymentPeriod'] }): PeriodBill[] {
    const { monthlyBills, rentPaymentPeriod } = jsonParam
    const periodBills: PeriodBill[] = []
    let tempIndex = 0
    monthlyBills.forEach(d => {
        if (tempIndex === 0) {
            let endDate = d.endDate.add(rentPaymentPeriod - 1, 'months')
            endDate = endDate.set('date', endDate.daysInMonth())
            const totalEnddate = monthlyBills[monthlyBills.length - 1].endDate
            if (endDate.unix() > totalEnddate.unix()) {
                endDate = totalEnddate.clone()
            }

            let rentPaymentDate = d.startDate
            if (periodBills.length > 0) {
                rentPaymentDate = rentPaymentDate.add(-1, 'months').set('date', 15)
            }
            periodBills.push({
                startDate: d.startDate,
                endDate,
                rentPaymentDate,
                totalPrice: d.totalPrice,
            })
        } else {
            periodBills[periodBills.length - 1].totalPrice += d.totalPrice
            periodBills[periodBills.length - 1].totalPrice = Number(periodBills[periodBills.length - 1].totalPrice.toFixed(2))
        }

        if (tempIndex < rentPaymentPeriod - 1) {
            tempIndex += 1
        } else {
            tempIndex = 0
        }
    })

    return periodBills
}
