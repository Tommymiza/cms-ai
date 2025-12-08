'use client'
import authStore from '@/store/auth'
import { ChangeEvent, ChangeEventHandler } from 'react'

interface ProfileFormProps {
  onChange?: ChangeEventHandler<HTMLInputElement>
  preview: string | null
}

export default function ProfileForm({ onChange, preview = null }: ProfileFormProps) {
  const { auth } = authStore()
  const onClick = () => {
    const input = document.getElementById('photo') as HTMLInputElement
    input.click()
  }
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e)
  }
  return (
    <div>
      <div
        className="dark:hover:border-gray-10 line-clamp-1 h-[100px] w-[100px] cursor-pointer overflow-hidden rounded-full border-[2px] border-zinc-400 bg-gray-50 text-center text-sm text-gray-600 hover:border-zinc-500 dark:border-gray-300"
        onClick={onClick}
      >
        {preview ? (
          <img src={preview} alt="Profile preview" className="h-full w-full object-cover" />
        ) : (
          <svg
            className="size-full select-none fill-current p-[5%] text-[48px] font-medium uppercase"
            viewBox="0 0 100 100"
            aria-hidden={'true'}
          >
            <text x="50%" y="50%" alignmentBaseline="middle" dominantBaseline="middle" textAnchor="middle" dy=".125em">
              {auth?.firstname?.charAt(0)}
            </text>
          </svg>
        )}
      </div>
      <input type="file" name="photo" id="photo" hidden onChange={handleChange} accept="image/*" />
    </div>
  )
}
