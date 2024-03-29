import { Button, Card, DatePicker, Descriptions, Empty, Form, InputNumber, Table } from 'antd'
import dayjs from 'dayjs'
import * as React from 'react'
import { calcMonthlyBills, monthlyBills2PeriodBills } from '../../src'
import { MonthlyBill, PeriodBill } from '../../src/type'

interface TestForm {
    date: [dayjs.Dayjs, dayjs.Dayjs]
    monthlyRent: number
    rentPaymentPeriod: number
}

const initValues: TestForm = {
    date: [dayjs('2020-11-16'), dayjs('2021-03-16')],
    monthlyRent: 5000,
    rentPaymentPeriod: 2,
}

export function Bill() {
    const [form] = Form.useForm()
    const [hasBill, setHasBill] = React.useState(false)
    const [monthlyData, setMonthlyData] = React.useState<MonthlyBill[]>([])
    const [periodData, setPeriodData] = React.useState<PeriodBill[]>([])
    return (
        <Card title="页面测试">
            <Descriptions column={1} bordered labelStyle={{ width: 150 }}>
                <Descriptions.Item label="合同信息">
                    <Form
                        form={form}
                        initialValues={initValues}
                        layout="vertical"
                        onFinish={(values: TestForm) => {
                            const monthlyBills = calcMonthlyBills({
                                startDate: values.date[0]
                                    .hour(0)
                                    .minute(0)
                                    .second(0),
                                endDate: values.date[1]
                                    .hour(0)
                                    .minute(0)
                                    .second(0),
                                monthlyRent: values.monthlyRent,
                                rentPaymentPeriod: values.rentPaymentPeriod,
                            })
                            setMonthlyData(monthlyBills)
                            const periodBills = monthlyBills2PeriodBills({ monthlyBills, rentPaymentPeriod: values.rentPaymentPeriod })
                            setPeriodData(periodBills)
                            setHasBill(true)
                        }}
                    >
                        <Form.Item label="合同开始-结束日期" name="date" required rules={[{ required: true }]}>
                            <DatePicker.RangePicker />
                        </Form.Item>
                        <Form.Item label="月租金" name="monthlyRent" required rules={[{ required: true }]}>
                            <InputNumber min={1} max={9999999999} style={{ width: 300 }} />
                        </Form.Item>
                        <Form.Item label="交租周期(月)" name="rentPaymentPeriod" required rules={[{ required: true }]}>
                            <InputNumber min={1} max={100} style={{ width: 300 }} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                生成账单
                            </Button>
                        </Form.Item>
                    </Form>
                </Descriptions.Item>
                <Descriptions.Item label="账单对应账单明细">
                    {hasBill ? (
                        <Table<MonthlyBill>
                            size="small"
                            dataSource={monthlyData}
                            columns={[
                                { title: '开始日期', render: (v, r) => r.startDate.format('YYYY-MM-DD') },
                                { title: '结束日期', render: (v, r) => r.endDate.format('YYYY-MM-DD') },
                                { title: '月数/天数', render: (v, r) => (r.unitType === 1 ? `${r.monthOrDayCount}月` : `${r.monthOrDayCount}天`) },
                                { title: '单价(月租金/日租金)', render: (v, r) => (r.unitType === 1 ? `月租金:${r.unitPrice}` : `日租金:${r.unitPrice}`) },
                                { title: '总价', render: (v, r) => r.totalPrice },
                            ]}
                        />
                    ) : (
                        <Empty />
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="交租阶段账单">
                    {hasBill ? (
                        <Table<PeriodBill>
                            size="small"
                            dataSource={periodData}
                            columns={[
                                { title: '开始日期', render: (v, r) => r.startDate.format('YYYY-MM-DD') },
                                { title: '结束日期', render: (v, r) => r.endDate.format('YYYY-MM-DD') },
                                { title: '交租日期', render: (v, r) => r.rentPaymentDate.format('YYYY-MM-DD') },
                                { title: '总金额', render: (v, r) => r.totalPrice },
                            ]}
                        />
                    ) : (
                        <Empty />
                    )}
                </Descriptions.Item>
            </Descriptions>
        </Card>
    )
}
