import React from "react"
import {
  FormControl,
  FormLabel,
  Slider as ChakraSlider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react"
import { useField } from "formik"

interface SliderProps {
  name: string
  label: string
  min: number
  max: number
  step: number
  marks: MarkType[]
}

type MarkType = {
  name?: string
  value: number
}

export const Slider = (props: SliderProps) => {
  const [field, , { setValue }] = useField(props.name)

  const handleChange = (value: number) => {
    setValue(value)
  }

  return (
    <FormControl>
      <FormLabel>{props.label}</FormLabel>
      <ChakraSlider
        {...field}
        min={props.min}
        max={props.max}
        step={props.step}
        onChange={handleChange}
        mb={3}
      >
        {props.marks.map((m) => (
          <SliderMark value={m.value} mt={2} ml={-0.5} fontSize="sm">
            {m.name ? m.name : m.value}
          </SliderMark>
        ))}
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </ChakraSlider>
    </FormControl>
  )
}
