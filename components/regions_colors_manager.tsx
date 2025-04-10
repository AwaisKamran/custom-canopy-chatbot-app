'use client'

import { useState } from 'react'
import { useActions, useUIState } from 'ai/rsc'
import { ColorLabelPickerSet } from './color-label-picker-set'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Color } from '@/lib/types'

interface RegionColorsManagerProps {
  regions: {
    name: string
    sides: {
      name: string
      label: string
      color: Color
    }[]
  }[]
  messageId?: string
}

const RegionsColorsManager = ({
  regions,
  messageId
}: RegionColorsManagerProps) => {
  const { submitUserMessage } = useActions()
  const [messages, setMessages] = useUIState()
  const [regionData, setRegionData] = useState(regions)

  const submitRegionData = async () => {
    const serializedRegions = JSON.stringify({
      regions: regionData
    })

    const newMessage = await submitUserMessage(serializedRegions)
    setMessages((currentMessages: any) => [...currentMessages, newMessage])
  }

  const updateRegionColors = (updatedSides: any, index: number) => {
    const updatedRegionData = [...regionData]
    updatedRegionData[index].sides = updatedSides
    setRegionData(updatedRegionData)
  }

  return (
    <>
      <Tabs defaultValue={regionData[0].name}>
        <TabsList className="flex grid-cols-auto mb-2">
          {regionData.map(region => (
            <TabsTrigger
              key={`${region.name}-${messageId}`}
              value={region.name}
              className="flex-auto mx-0.5"
            >
              {region.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {regionData.map((region, index) => (
          <TabsContent key={`${region.name}-${messageId}`} value={region.name}>
            <ColorLabelPickerSet
              fieldColors={region.sides}
              setFieldColors={updatedSides =>
                updateRegionColors(updatedSides, index)
              }
              messageId={messageId}
            />
          </TabsContent>
        ))}
      </Tabs>
      <button
        className="chat-button"
        onClick={submitRegionData}
        disabled={messageId !== messages.at(-1)?.id}
      >
        Okay
      </button>
    </>
  )
}

export default RegionsColorsManager
