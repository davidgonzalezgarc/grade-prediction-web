import React from "react"
import { Center, Text } from "@chakra-ui/react"

export const Footer = () => {
  return (
    <Center py={4} height="4rem">
      <Text fontWeight="semibold">
        {new Date().getFullYear() + "."} Trabajo de fin de grado de David
        González García
      </Text>
    </Center>
  )
}
