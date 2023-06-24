import React from "react"
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Input,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Spacer,
  VStack,
} from "@chakra-ui/react"
import { TbPlus, TbTrash } from "react-icons/tb"
import { v4 as uuidv4 } from "uuid"
import { GradeItem as GradeItemType } from "../../types/types"
import { DndItem, DndDragHandle } from "../dnd/DndItem"
import { DndList } from "../dnd/DndList"

export type DndGradeItemType = {
  id: string
  name: string
  percentage: number
}

type CourseCreationFormProps = {
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  gradeItems: GradeItemType[]
  setGradeItems: React.Dispatch<React.SetStateAction<GradeItemType[]>>
}

export const CourseCreationForm = ({
  name,
  setName,
  gradeItems,
  setGradeItems,
}: CourseCreationFormProps) => {
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value)
  }

  const addEmptyGradeItem = () => {
    setGradeItems((gradeItems) => {
      const newGradeItem: GradeItemType = {
        id: uuidv4(),
        name: "",
        percentage: 50,
      }

      return [...gradeItems, newGradeItem]
    })
  }

  const deleteGradeItem = (id: string) => {
    setGradeItems((gradeItems) => {
      return gradeItems.filter((gradeItem) => gradeItem.id !== id)
    })
  }

  const updateGradeItem = (id: string, updatedGradeItem: GradeItemType) => {
    setGradeItems((gradeItems) => {
      return gradeItems.map((gradeItem) =>
        gradeItem.id === id ? updatedGradeItem : gradeItem
      )
    })
  }

  return (
    <VStack spacing={4} width="100%">
      <FormControl>
        <FormLabel>Nombre</FormLabel>
        <Input type="text" value={name} onChange={handleChangeName} />
      </FormControl>
      <FormControl>
        <Flex alignItems="center" mb={1}>
          <FormLabel mb={0}>Elementos de evaluación</FormLabel>
          <Spacer />
          <Button
            size="sm"
            leftIcon={<Icon as={TbPlus} />}
            onClick={addEmptyGradeItem}
          >
            Añadir
          </Button>
        </Flex>
        <DndList
          items={gradeItems}
          onChange={setGradeItems}
          renderItem={(item) => (
            <DndItem id={item.id}>
              <GradeItem
                key={item.id}
                gradeItem={item}
                onUpdate={updateGradeItem}
                deleteEnabled={gradeItems.length > 1}
                onDelete={deleteGradeItem}
              />
            </DndItem>
          )}
        />
      </FormControl>
    </VStack>
  )
}

type GradeItemProps = {
  gradeItem: DndGradeItemType
  deleteEnabled: boolean
  onUpdate: (id: string, updatedGradeItem: DndGradeItemType) => void
  onDelete: (id: string) => void
}

const GradeItem = ({
  gradeItem,
  onUpdate: handleUpdate,
  deleteEnabled,
  onDelete: handleDelete,
}: GradeItemProps) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    handleUpdate(gradeItem.id, { ...gradeItem, name: newName })
  }

  const handlePercentageChange = (newValue: number) => {
    handleUpdate(gradeItem.id, { ...gradeItem, percentage: newValue })
  }

  const handleDeleteClick = () => {
    handleDelete(gradeItem.id)
  }

  return (
    <Box width="100%">
      <Card position="relative">
        <Box
          position="absolute"
          top="0%"
          left="0%"
          transform="translate(-30%, -30%)"
          zIndex={1}
        >
          <DndDragHandle />
        </Box>
        <IconButton
          size="sm"
          colorScheme="red"
          isDisabled={!deleteEnabled}
          icon={<Icon as={TbTrash} />}
          aria-label="delete"
          position="absolute"
          top="0%"
          left="100%"
          transform="translate(-70%, -30%)"
          zIndex={1}
          onClick={handleDeleteClick}
        />
        <CardBody as={VStack} spacing={2}>
          <FormControl>
            <FormLabel>Nombre</FormLabel>
            <Input
              type="text"
              value={gradeItem.name}
              onChange={handleNameChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Porcentaje</FormLabel>
            <Slider mb={4} onChange={handlePercentageChange}>
              <SliderMark value={25} mt={2} ml={-2.5} fontSize="sm">
                25%
              </SliderMark>
              <SliderMark value={50} mt={2} ml={-2.5} fontSize="sm">
                50%
              </SliderMark>
              <SliderMark value={75} mt={2} ml={-2.5} fontSize="sm">
                75%
              </SliderMark>
              <SliderMark
                value={gradeItem.percentage}
                rounded="md"
                textAlign="center"
                bg="blue.500"
                color="white"
                mt="-10"
                ml="-5"
                w="12"
              >
                {gradeItem.percentage}%
              </SliderMark>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </FormControl>
        </CardBody>
      </Card>
    </Box>
  )
}
