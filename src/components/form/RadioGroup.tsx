import React from "react"
import {
  FormControl,
  FormLabel,
  HStack,
  Radio,
  RadioGroup as ChakraRadioGroup,
} from "@chakra-ui/react"
import { useField } from "formik"

interface RadioGroupProps {
  name: string
  label: string
  radios: RadioType[]
}

type RadioType = {
  name: string
  value: string
}

export const RadioGroup = (props: RadioGroupProps) => {
  const [field, , { setValue }] = useField(props.name)

  const handleChange = (value: string) => {
    setValue(value)
  }

  return (
    <FormControl>
      <FormLabel>{props.label}</FormLabel>
      <ChakraRadioGroup {...field} onChange={handleChange}>
        <HStack spacing={5}>
          {props.radios.map((r) => (
            <Radio key={`radio-${r.name}-${r.value}`} value={r.value}>
              {r.name}
            </Radio>
          ))}
        </HStack>
      </ChakraRadioGroup>
    </FormControl>
  )
}
