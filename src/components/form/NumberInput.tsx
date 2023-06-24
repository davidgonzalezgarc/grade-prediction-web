import React from "react"
import {
  FormControl,
  FormLabel,
  NumberInput as ChakraNumberInput,
  NumberInputField,
} from "@chakra-ui/react"
import { useField } from "formik"

interface NumberInputProps {
  name: string
  label: string
  min?: number
  max?: number
}

export const NumberInput = (props: NumberInputProps) => {
  const [field, _, { setValue }] = useField(props.name)

  const handleChange = (value: string) => {
    const nextValue = value.trim()
    if (nextValue == "") {
      setValue(0)
    } else {
      setValue(Number(nextValue))
    }
  }

  return (
    <FormControl>
      <FormLabel>{props.label}</FormLabel>
      <ChakraNumberInput
        {...field}
        max={props.max}
        min={props.min}
        onChange={(valueAsString, _) => handleChange(valueAsString)}
      >
        <NumberInputField />
      </ChakraNumberInput>
    </FormControl>
  )
}
