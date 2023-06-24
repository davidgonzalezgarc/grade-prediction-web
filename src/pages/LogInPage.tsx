import React, { FormEvent, useContext, useState } from "react"
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import { AuthContext } from "../context/AuthContext"

export const LogInPage = () => {
  const { authenticate } = useContext(AuthContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    authenticate({ email, password })
  }

  return (
    <Box bg={useColorModeValue("gray.50", "gray.900")}>
      <Flex minH={"calc(100vh - 8rem)"} align={"center"} justify={"center"}>
        <Stack spacing={8} mx={"auto"} maxW={"xxl"} py={12} px={6}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Inicio de sesión
          </Heading>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.800")}
            boxShadow={"base"}
            p={8}
          >
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <Box>
                  <FormControl id="email">
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.currentTarget.value)}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="password">
                    <FormLabel>Contraseña</FormLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.currentTarget.value)}
                    />
                  </FormControl>
                </Box>
                <Button
                  size="md"
                  width="100%"
                  _hover={{
                    bg: useColorModeValue("blue.600", "blue.300"),
                  }}
                  type="submit"
                >
                  Iniciar sesión
                </Button>
              </VStack>
            </form>
          </Box>
        </Stack>
      </Flex>
    </Box>
  )
}
