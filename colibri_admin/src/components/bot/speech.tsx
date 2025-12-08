'use client'

import { useTranslations } from 'next-intl'

export default function Speech({ isListening }: { isListening: boolean }) {
  const t = useTranslations('bot')
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="italic text-slate-500">{t('vocal-instruction')}</p>
      <p>
        {t('vocal-statut.record')} : {isListening ? `🛑 ${t('vocal-statut.start')}` : `⚪ ${t('vocal-statut.stop')}`}
      </p>
    </div>
  )
}
