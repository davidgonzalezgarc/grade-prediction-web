import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import type { Active, UniqueIdentifier } from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"

import { DndOverlay } from "./DndOverlay"
import React, { ReactNode, useState, useMemo } from "react"
import { useColorModeValue, VStack } from "@chakra-ui/react"

interface BaseItem {
  id: UniqueIdentifier
}

interface Props<T extends BaseItem> {
  items: T[]
  onChange(items: T[]): void
  renderItem(item: T): ReactNode
}

export const DndList = <T extends BaseItem>({
  items,
  onChange,
  renderItem,
}: Props<T>) => {
  const [active, setActive] = useState<Active | null>(null)
  const activeItem = useMemo(
    () => items.find((item) => item.id === active?.id),
    [active, items]
  )
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active)
      }}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over?.id) {
          const activeIndex = items.findIndex(({ id }) => id === active.id)
          const overIndex = items.findIndex(({ id }) => id === over.id)

          onChange(arrayMove(items, activeIndex, overIndex))
        }
        setActive(null)
      }}
      onDragCancel={() => {
        setActive(null)
      }}
    >
      <SortableContext items={items}>
        <VStack
          h={{ base: 300, md: 600 }}
          p={4}
          mt={2}
          spacing={4}
          bgColor={useColorModeValue("gray.50", "gray.900")}
          rounded="lg"
          boxShadow="md"
          overflow="auto"
        >
          {items.map((item) => (
            <React.Fragment key={item.id}>{renderItem(item)}</React.Fragment>
          ))}
        </VStack>
      </SortableContext>
      <DndOverlay>{activeItem ? renderItem(activeItem) : null}</DndOverlay>
    </DndContext>
  )
}
