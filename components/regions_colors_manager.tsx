'use client'

import { useState } from 'react'
import { useActions, useUIState } from 'ai/rsc'
import { ColorLabelPickerSet } from './color-label-picker-set'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

interface RegionColorsManagerProps {
  regions: {
    name: string
    sides: {
      name: string
      label: string
      color: { name: string; value: string }
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
      regions: regionData.map(({ name, sides }) => ({
        [name]: sides.map(({ name, label, color }) => ({
          [name]: {
            [label]: {
              color: { color: color.value, colorName: color.name }
            }
          }
        }))
      }))
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
              className="flex-auto whitespace-nowrap data-[state=active]:bg-cyan-800 data-[state=active]:text-foreground data-[state=active]:shadow"
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
        className="py-2 px-4 mb-2 rounded-md dark:text-white flex-auto whitespace-nowrap disabled:cursor-not-allowed border border-neutral-400 bg-slate-400 text-white dark:bg-cyan-800 disabled:opacity-50 disabled:pointer-events-none"
        onClick={submitRegionData}
        disabled={messageId !== messages.at(-1)?.id}
      >
        Okay
      </button>
    </>
  )
}

export default RegionsColorsManager
