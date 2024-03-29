import * as React from 'react'
import zhCN from 'antd/es/locale/zh_CN'
import { ConfigProvider } from 'antd'
import { ContextProvider } from '../context/context'
import { Bill } from '../components/bill'

export function App() {
    return (
        // 将dispatch方法和状态都作为context传递给子组件
        <ContextProvider>
            <ConfigProvider locale={zhCN}>
                <Bill />
            </ConfigProvider>
        </ContextProvider>
    )
}
