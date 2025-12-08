import { cn } from '@/lib/cn'
import { UIMessage } from 'ai'
import ReactMarkdown from 'react-markdown'
import { Avatar } from '../avatar'

export function Message({ message }: { message: UIMessage }) {
  const allText = message.parts
    .map((part) => {
      if (part.type === 'text') {
        return part.text
      }
      return ''
    })
    .join('')
  const img: any = message.parts.find((part) => part.type === 'file' && part.mediaType?.startsWith('image/'))

  const sentences = allText.split('\n')

  return (
    <div
      className={cn(
        'flex max-w-[80%] items-start gap-2 text-wrap',
        message.role === 'user' ? 'flex-row-reverse self-end' : 'flex-row self-start'
      )}
    >
      {message.role === 'user' && <Avatar style={{ width: 40, height: 40, objectFit: 'cover' }} initials="U" />}
      {message.role !== 'user' && Boolean(allText) && (
        <Avatar style={{ width: 40, height: 40, objectFit: 'cover' }} src="/users/Tweeksy-logo-HD.png" />
      )}
      {/* {img && <img src={img?.url} alt={img.filename} className="mb-2 max-h-60 w-auto rounded-md" />} */}
      {Boolean(allText) && (
        <div
          className={cn(
            'relative max-w-[80%] rounded-md p-3 text-sm',
            message.role === 'user' ? 'bg-slate-700 text-white' : 'bg-[#fefefe] text-zinc-950 dark:bg-slate-300'
          )}
        >
          {sentences.map((sentence, index) => {
            const hexRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g
            const hex = sentence.match(hexRegex)
            if (hex) {
              return (
                <div className="prose flex items-center gap-1" key={index}>
                  <span>{sentence.replace(hex[0], '').trim()}</span>
                  <span
                    className="h-5 w-5 rounded-md border border-gray-950"
                    style={{
                      backgroundColor: hex[0],
                    }}
                  />
                </div>
              )
            }
            return (
              <ReactMarkdown key={index} className={cn(message.role === 'assistant' && 'prose')}>
                {sentence}
              </ReactMarkdown>
            )
          })}
        </div>
      )}
    </div>
  )
}
