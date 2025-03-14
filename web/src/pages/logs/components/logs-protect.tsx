import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MoreHorizontal } from "lucide-react"
import * as React from "react"
import {
    ColumnDef,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    VisibilityState,
    SortingState,
    getSortedRowModel,
} from "@tanstack/react-table"




import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Checkbox } from "@/components/ui/checkbox"
// import { DataTableViewOptions } from "@/components/table/column-toggle"
// import { DataTableColumnHeader } from "@/components/table/column-header"
import { DataTable } from "@/components/table/data-table"
import { useTranslation } from "react-i18next"
import { AttackDetailDialog } from "@/pages/logs/components/attack-detail-dialog"

type LogItem = {
    id: number
    url: string
    status: string
    type: string
    ip: string
    location: string
    timestamp: string
}

const logItems = [
    {
        id: 1,
        url: "https://demo.waf-ce.chaitin.cn:10084/hello.html?payload",
        status: "已防护",
        type: "SQL注入",
        ip: "125.118.24.13",
        location: "浙江-杭州",
        timestamp: "1735135136000",
    },
    {
        id: 1,
        url: "https://demo.waf-ce.chaitin.cn:10084/hello.html?payload",
        status: "已防护",
        type: "SQL注入",
        ip: "125.118.24.13",
        location: "浙江-杭州",
        timestamp: "1735135136000",
    },
    {
        id: 1,
        url: "https://demo.waf-ce.chaitin.cn:10084/hello.html?payload",
        status: "已防护",
        type: "SQL注入",
        ip: "125.118.24.13",
        location: "浙江-杭州",
        timestamp: "1735135136000",
    }
]



export function LogsProtect() {
    const { t } = useTranslation()

    const columns: ColumnDef<LogItem>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "status",
            accessorKey: "status",
            header: t('protect.status'),
        },
        {
            id: "url",
            accessorKey: "url",
            header: t('attack.url'),
        },
        {
            id: "type",
            accessorKey: "type",
            header: t('attack.type'),
        },
        {
            id: "ip",
            header: t('attack.ip'),
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">{row.original.ip}</span>
                        <span className="text-xs text-muted-foreground">{row.original.location}</span>
                    </div>
                )
            }
        },
        {
            id: "time",
            header: t('time'),
            cell: ({ row }) => {
                const date = new Date(parseInt(row.original.timestamp))
                const dateStr = date.toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                })
                const timeStr = date.toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                })
                return (
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">{dateStr}</span>
                        <span className="text-xs text-muted-foreground">{timeStr}</span>
                    </div>
                )
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const [open, setOpen] = React.useState(false)
                const data = row.original

                return (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(data.ip)}>
                                    Copy IP
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setOpen(true)}>
                                    {t('view.detail')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <AttackDetailDialog
                            open={open}
                            onOpenChange={setOpen}
                            data={{
                                url: data.url,
                                ip: data.ip,
                                payload: "1 and 1=1", // 从 URL 中提取
                                type: data.type,
                                timestamp: data.timestamp,
                                id: data.id,
                                location: data.location
                            }}
                        />
                    </>
                )
            }
        },
    ]

    const [sorting, setSorting] = React.useState<SortingState>([])

    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})

    const table = useReactTable({
        data: logItems,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            columnVisibility,
            rowSelection,
            sorting,
        },
    })

    return (
        <Card className="flex flex-col border-none shadow-none gap-6 flex-1 h-full">

            <Card className="flex justify-between border rounded-md shadow-none p-4 border-black-550 bg-surface-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm">
                            全选导出
                        </Button>
                        <Button variant="outline" size="sm">
                            筛选
                        </Button>
                        <div className="h-6 border-l mx-2" />
                        <input
                            type="text"
                            placeholder="域名"
                            className="px-3 py-1 text-sm border rounded"
                        />
                    </div>
                    <Button variant="outline" size="sm">
                        刷新
                    </Button>
                </div>
            </Card>

            <Card className="flex flex-col justify-between border rounded-md shadow-none p-4 border-black-550 bg-surface-200 gap-4 flex-1 h-full">
                <Card className="border border-primary-300 rounded-sm shadow-none bg-inherit flex-1">
                    <DataTable table={table} columns={columns} style="border" />
                </Card>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                        0 of 5 row(s) selected.
                    </span>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-sm">列每页</span>
                            <Button variant="outline" size="sm">12</Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">上一页</Button>
                            <Button variant="outline" size="sm">下一页</Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm">跳至</span>
                            <input
                                type="text"
                                className="w-12 px-2 py-1 text-sm border rounded"
                            />
                            <span className="text-sm">/ 120 页</span>
                        </div>
                    </div>
                </div>
            </Card>


        </Card>
    )
} 