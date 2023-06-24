import React from "react"
import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react"

export const Page = ({
  props,
  children,
}: {
  props?: BoxProps
  children?: JSX.Element | JSX.Element[]
}) => {
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      minH={"calc(100vh - 8rem)"}
      {...props}
    >
      {children}
    </Box>
  )
}
