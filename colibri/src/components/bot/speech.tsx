'use client'

import { useTranslationStore } from '@/stores/translation'

export default function Speech({ isListening }: { isListening: boolean }) {
  const { t } = useTranslationStore()
  const trad = t?.['bot']
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-center text-[0.8rem] italic text-slate-500 dark:text-white">
        {trad?.['vocal-instruction'] || ''}
      </p>
      <p className="text-center text-sm text-zinc-500 dark:text-white">
        {trad?.['vocal-statut'].record} :{' '}
        {isListening
          ? trad?.['vocal-statut'].start
          : trad?.['vocal-statut'].stop}
      </p>
    </div>
  )
}
