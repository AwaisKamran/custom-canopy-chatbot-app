'use client'

import { IconOpenAI, IconUser } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { spinner } from './spinner'
import { CodeBlock } from '../ui/codeblock'
import { MemoizedReactMarkdown } from '../markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeRaw from 'rehype-raw'
import { StreamableValue } from 'ai/rsc'
import { useStreamableText } from '@/lib/hooks/use-streamable-text'
import { ImagePart, UserContent } from 'ai'
import { Separator } from '../ui/separator'

// Different types of message bubbles.

export function UserMessage({ content }: { content: UserContent }) {
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content)
    } catch (e) {}
  }

  return (
    <>
      <div className="group relative flex items-start md:-ml-12 my-4">
        <div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
          <IconUser />
        </div>
        <div className="flex flex-col flex-1">
          <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2">
            {typeof content === 'string' ? (
              content
            ) : (
              <div className="flex flex-wrap gap-4 mx-4 mb-2">
                {(content as Array<ImagePart>).map(
                  (file: ImagePart, index: any) => {
                    return (
                      <div key={index} className="flex items-start gap-4">
                        {file.mimeType?.startsWith('image') && (
                          <img
                            src={file.image as string}
                            alt="Logo"
                            className="w-32 h-32 sm:rounded-md sm:border sm:bg-background sm:shadow-md"
                          />
                        )}
                      </div>
                    )
                  }
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Separator />
    </>
  )
}

export function BotMessage({
  content,
  className,
  children
}: {
  content: string | StreamableValue<string>
  className?: string
  children?: React.ReactNode
}) {
  const text = useStreamableText(content)
  return (
    <>
      <div
        className={cn(
          'group relative flex items-start md:-ml-12 my-4',
          className
        )}
      >
        <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
          <IconOpenAI />
        </div>
        <div className="ml-4 flex flex-col gap-y-4 w-full">
          <div className="flex-1 space-y-2 overflow-hidden px-1">
            <MemoizedReactMarkdown
              className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeRaw as any]}
              components={{
                p({ children }) {
                  return <p className="mb-2 last:mb-0">{children}</p>
                },
                code({ node, inline, className, children, ...props }) {
                  if (children.length) {
                    if (children[0] == '▍') {
                      return (
                        <span className="mt-1 animate-pulse cursor-default">
                          ▍
                        </span>
                      )
                    }

                    children[0] = (children[0] as string).replace('`▍`', '▍')
                  }

                  const match = /language-(\w+)/.exec(className || '')

                  if (inline) {
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }

                  return (
                    <CodeBlock
                      key={Math.random()}
                      language={(match && match[1]) || ''}
                      value={String(children).replace(/\n$/, '')}
                      {...props}
                    />
                  )
                }
              }}
            >
              {text}
            </MemoizedReactMarkdown>
          </div>
          {children}
        </div>
      </div>
      {<Separator />}
    </>
  )
}

export function BotCard({
  children,
  showAvatar = true
}: {
  children: React.ReactNode
  showAvatar?: boolean
}) {
  return (
    <div className="group relative flex items-start md:-ml-12 my-4">
      <div
        className={cn(
          'flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm',
          !showAvatar && 'invisible'
        )}
      >
        <IconOpenAI />
      </div>
      <div className="ml-4 flex-1 pl-2">{children}</div>
    </div>
  )
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        'mt-2 flex items-center justify-center gap-2 text-xs text-gray-500'
      }
    >
      <div className={'max-w-[600px] flex-initial p-2'}>{children}</div>
    </div>
  )
}

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <IconOpenAI />
      </div>
      <div className="ml-4 h-[24px] flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
        {spinner}
      </div>
    </div>
  )
}
