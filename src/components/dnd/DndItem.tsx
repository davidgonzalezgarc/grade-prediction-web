import React, { createContext, useContext, useMemo } from "react"
import type { CSSProperties, PropsWithChildren } from "react"
import type {
  DraggableSyntheticListeners,
  UniqueIdentifier,
} from "@dnd-kit/core"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Box, IconButton } from "@chakra-ui/react"
import { TbArrowsMove } from "react-icons/tb"

interface Props {
  id: UniqueIdentifier
}

interface Context {
  attributes: Record<string, any>
  listeners: DraggableSyntheticListeners
  ref(node: HTMLElement | null): void
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
})

export const DndItem = ({ children, id }: PropsWithChildren<Props>) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id })
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef]
  )
  const style: CSSProperties = {
    width: "100%",
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  }

  return (
    <SortableItemContext.Provider value={context}>
      <Box ref={setNodeRef} style={style}>
        {children}
      </Box>
    </SortableItemContext.Provider>
  )
}

export const DndDragHandle = () => {
  const { attributes, listeners, ref } = useContext(SortableItemContext)

  return (
    <IconButton
      size="sm"
      icon={<TbArrowsMove />}
      aria-label="dnd"
      {...attributes}
      {...listeners}
      ref={ref}
    />
  )
}
