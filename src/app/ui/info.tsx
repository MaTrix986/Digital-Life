'use client';

interface SystemInfo {
    hostname?: string;
    platform?: string;
    uptime?: string;
    systemUptime?: string;
    memory?: {
        free: string,
        total: string,
        usage: string,
    };
    cpu?: {
        load: string,
        cores: string
    };
}

export default function Info({ systemInfo }: { systemInfo: SystemInfo }) {
    return (
        <div >
            <div >
                <h2>系统信息</h2>
                <div >
                    <span >主机名:</span>
                    <span id="hostname" >{systemInfo.hostname}</span>
                </div>
                <div >
                    <span >平台:</span>
                    <span id="platform" >{systemInfo.platform || '-'}</span>
                </div>
                <div >
                    <span >系统运行时间:</span>
                    <span id="systemUptime" >{systemInfo.systemUptime || '-'} s</span>
                </div>
                <div >
                    <span >服务运行时间:</span>
                    <span id="serviceUptime" >{systemInfo.uptime || '-'} s</span>
                </div>
            </div>
            
            <div >
                <h2>内存使用情况</h2>
                <div >
                    <span >总内存:</span>
                    <span id="totalMemory" >{systemInfo.memory?.total || '-'} MB</span>
                </div>
                <div >
                    <span >可用内存:</span>
                    <span id="freeMemory" >{systemInfo.memory?.free || '-'} MB</span>
                </div>
                <div >
                    <span >使用率:</span>
                    <span id="memoryUsage" >{systemInfo.memory?.usage || '-'}%</span>
                </div>
                <div >
                    <div id="memoryProgress"></div>
                </div>
            </div>
            
            <div >
                <h2>CPU 信息</h2>
                <div >
                    <span >CPU 核心:</span>
                    <span id="cpuCores" >{systemInfo.cpu?.cores || '-'}</span>
                </div>
                <div >
                    <span >CPU 负载:</span>
                    <span id="load" >{systemInfo.cpu?.load || '-'}%</span>
                </div>
            </div>
        </div>
    );
}