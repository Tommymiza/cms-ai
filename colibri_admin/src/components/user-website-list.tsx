'use client'
import { deleteDomain } from '@/lib/api-vercel'
import siteStore from '@/store/site'
import { HeadCell } from '@/types/types'
import { EyeIcon, TrashIcon } from '@heroicons/react/16/solid'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Button } from './button'
import { Dialog, DialogActions, DialogBody, DialogTitle } from './dialog'
import Loading from './loading/loading'
import DataTable from './table/data-table'
import Tooltip from './Tooltip'
import tenantStore from '@/store/tenant'

export default function WebsiteList() {
  const { siteList, loading, getSites, deleteSite } = siteStore()
  const {tenantId} = tenantStore()
  const [deleteId, setDeleteDocument] = useState<string | null>(null)
  const handleDelete = async (documentId: string | null) => {
    try {
      if (!documentId) return
      const site = siteList.find((s) => s.documentId === documentId)
      if (!site) return
      await deleteDomain(site.tweeksy_domain_name)
      await deleteDomain(site.tweeksy_preview_domain_name)
      await deleteSite(documentId)
      setDeleteDocument(null)
      getSites()
    } catch (error) {
      console.log(error)
    }
  }
  const t = useTranslations('website')
  const headCells: HeadCell[] = [
    {
      id: 'display_name',
      label: t('columns.0'),
      type: 'text',
    },
    {
      id: 'description',
      label: t('columns.3'),
      type: 'text',
    },
    {
      id: 'tweeksy_domain_name',
      label: t('columns.4'),
      type: 'text',
    },
    { id: 'default_visitor_culture.name', label: t('columns.6'), type: 'text' },
    { id: 'createdAt', label: t('columns.7'), type: 'date', format: 'DD MMM YYYY' },
    {
      id: 'document_id',
      label: t('columns.8'),
      type: 'action',
      customButtons: [
        ({ tweeksy_preview_domain_name }) => (
          <Tooltip
            title="Preview"
            onClick={() =>
              window.open(`https://${tweeksy_preview_domain_name}?token=${localStorage.getItem('auth')}&tenant=${tenantId?.tenant.id}`, '_blank')
            }
          >
            <EyeIcon className="h-4 w-4" />
          </Tooltip>
        ),
        ({ documentId }) => {
          return tenantId?.role != 'editor' ? (
            <Tooltip title="Supprimer" onClick={() => setDeleteDocument(documentId)}>
              <TrashIcon className="h-4 w-4" />
            </Tooltip>
          ) : <div></div>
        },
      ],
    },
  ]
  useEffect(() => {
    getSites()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[150px] flex-col items-center justify-center">
        <Loading width="30px" height="30px" />
      </div>
    )
  }
  return (
    <div>
      <DataTable data={siteList} headCells={headCells} />
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteDocument(null)} size="lg">
        <DialogTitle className="font-bold">{t('delete.title')}</DialogTitle>
        <DialogBody>
          <p>{t('delete.description')}</p>
        </DialogBody>
        <DialogActions>
          <button onClick={() => setDeleteDocument(null)}>{t('delete.cancel')}</button>
          <Button onClick={() => handleDelete(deleteId)}>{t('delete.confirm')}</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
