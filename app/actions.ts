'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { kv } from '@vercel/kv'

import { auth } from '@/auth'
import { type Chat } from '@/lib/types'
import { del } from '@vercel/blob'
import { Error401Response } from './constants'

export async function getChats(userId?: string | null) {
  const session = await auth()

  if (!userId) {
    return []
  }

  if (userId !== session?.user?.id) {
    return {
      error: Error401Response.message
    }
  }

  try {
    const pipeline = kv.pipeline()
    const chats: string[] = await kv.zrange(`user:chat:${userId}`, 0, -1, {
      rev: true
    })

    for (const chat of chats) {
      pipeline.hgetall(chat)
    }

    const results = await pipeline.exec()

    return results as Chat[]
  } catch (error) {
    return []
  }
}

export async function getChat(id: string, userId: string) {
  const session = await auth()

  if (userId !== session?.user?.id) {
    return {
      error: Error401Response.message
    }
  }

  const chat: Chat | null = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat || (userId && chat.userId !== userId)) {
    return null
  }

  return chat
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const session = await auth()

  if (!session) {
    return {
      error: Error401Response.message
    }
  }

  // Convert uid to string for consistent comparison with session.user.id
  const uid = String(await kv.hget(`chat:${id}`, 'userId'))

  if (uid !== session?.user?.id) {
    return {
      error: Error401Response.message
    }
  }

  await deleteSavedFiles(id, uid, path)

  await kv.del(`chat:${id}`)
  await kv.zrem(`user:chat:${session.user.id}`, `chat:${id}`)

  revalidatePath('/')
  return revalidatePath(path)
}

export async function clearChats() {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: Error401Response.message
    }
  }

  const chats: string[] = await kv.zrange(`user:chat:${session.user.id}`, 0, -1)
  if (!chats.length) {
    return redirect('/')
  }
  const pipeline = kv.pipeline()

  for (const chat of chats) {
    const chatId = chat.split(":")[1];
    await deleteSavedFiles(chatId, session.user.id)
    pipeline.del(chat)
    pipeline.zrem(`user:chat:${session.user.id}`, chat)
  }

  await pipeline.exec()

  revalidatePath('/')
  return redirect('/')
}

export async function deleteSavedFiles(chatId: string, userId: string, path?: string) {
   const session = await auth()

   if (session?.user?.id !== userId) {
     return {
       error: Error401Response.message
     }
   }
   const chat = await getChat(chatId, userId) as Chat
   if (!chat || Error401Response.message in chat) {
     return redirect('/')
   }

   const deleteFileUrls = []
   for (const message of chat.messages) {
     if (message.files) {
       const files = JSON.parse(message.files)
       for (const file of files) {
         deleteFileUrls.push(file.previewUrl)
       }
     } else {
       const error = `No files to be deleted for message ${message.id}`
       console.log(error)
     }
   }

   if (deleteFileUrls && deleteFileUrls.length > 0) {
     await del(deleteFileUrls)
   }
 }

export async function getSharedChat(id: string) {
  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat || !chat.sharePath) {
    return null
  }

  return chat
}

export async function saveChat(chat: Chat) {
  const session = await auth()

  if (session && session.user) {
    const userId = session.user.id as string
    chat.userId = userId
    const pipeline = kv.pipeline()
    pipeline.hmset(`chat:${chat.id}`, chat)
    pipeline.zadd(`user:chat:${chat.userId}`, {
      score: Date.now(),
      member: `chat:${chat.id}`
    })
    await pipeline.exec()
  } else {
    return
  }
}

export async function refreshHistory(path: string) {
  redirect(path)
}

export async function getMissingKeys() {
  const keysRequired = ['OPENAI_API_KEY', 'NEXT_PUBLIC_ASSISTANT_ID', 'NEXT_PUBLIC_CUSTOM_CANOPY_SERVER_URL']
  return keysRequired
    .map(key => (process.env[key] ? '' : key))
    .filter(key => key !== '')
}
