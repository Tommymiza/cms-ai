import EditPassword from '@/components/edit-password'
import { Heading } from '@/components/heading'

export default async function EditPasswordPage() {
  return (
    <div className="w-[70%]">
      <div className="flex items-end justify-between gap-4">
        <Heading>Edit password</Heading>
      </div>
      <EditPassword />
    </div>
  )
}
