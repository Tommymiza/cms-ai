import useCountryList from '@/hooks/useCountryList'
import { HeadCell } from '@/types/types'
import dayjs from 'dayjs'
import { useTranslations } from 'next-intl'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'
type DataTableProps<T> = {
  data: T[]
  headCells: HeadCell[]
}

export default function DataTable<TData extends Record<string, any>>({ data, headCells }: DataTableProps<TData>) {
  const t = useTranslations('table')
  return (
    <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
      {/* Table Head */}
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableHeader key={headCell.id}>{headCell.label}</TableHeader>
          ))}
        </TableRow>
      </TableHead>

      {/* Table Body */}
      <TableBody>
        {data && data.length > 0 ? (
          data.map((item, index) => (
            <TableRow key={index}>
              {headCells.map((headCell) => (
                <TableCell className="relative max-w-[150px]" key={headCell.id}>
                  {renderCellContent(item, headCell)}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow slot="empty">
            <TableCell colSpan={headCells.length}>
              <div className="flex w-full items-center justify-center">
                <span>{t('no-data')}</span>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

// helper function to access nested values in an object
function getNestedValue(obj: any, key: string) {
  return key.split('.').reduce((o, i) => (o ? o[i] : null), obj)
}

function renderCellContent(item: any, headCell: HeadCell) {
  if (headCell.customButtons && headCell.customButtons.length > 0) {
    return (
      <div className="flex flex-nowrap gap-3">
        {headCell.customButtons.map((ButtonComponent, index) => (
          <ButtonComponent key={index} {...item} />
        ))}
      </div>
    )
  }
  // using dot notation to access nested values
  const value = getNestedValue(item, headCell.id)

  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value)
  }

  switch (headCell.type) {
    case 'date':
      return formatDate(value, headCell.format)
    case 'actions':
      return (
        <div className="flex gap-2">
          {headCell.showEdit && <button>Edit</button>}
          {headCell.showRemove && <button>Remove</button>}
        </div>
      )
    case 'country':
      return <CountryDisplay id={value} />
    case 'company':
      return <div>{!value ? 'No' : value}</div>
    default:
      return <div className="overflow-hidden text-ellipsis whitespace-nowrap">{value}</div>
  }
}

function formatDate(value: string, format?: string) {
  return format ? dayjs(value).format(format) : value
}

function CountryDisplay({ id }: { id: number }) {
  const countryList = useCountryList()
  const countryShow = countryList.find((c) => c.id === id)?.name
  return <div>{countryShow}</div>
}
