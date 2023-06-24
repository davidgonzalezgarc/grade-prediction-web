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
  Select,
  Stack,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import { AuthContext } from "../context/AuthContext"

export const SignUpPage = () => {
  const { register } = useContext(AuthContext)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")

  const roles = new Map<string, string>([
    ["Estudiante", "student"],
    ["Profesor", "teacher"],
  ])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    register({ name, email, password, role })
  }

  return (
    <Box bg={useColorModeValue("gray.50", "gray.900")}>
      <Flex minH={"calc(100vh - 8rem)"} align={"center"} justify={"center"}>
        <Stack spacing={8} mx={"auto"} maxW={"xxl"} py={12} px={6}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Registro
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
                  <FormControl id="name">
                    <FormLabel>Nombre</FormLabel>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.currentTarget.value)}
                    />
                  </FormControl>
                </Box>
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
                <Box width="100%">
                  <FormControl id="role">
                    <FormLabel>Rol</FormLabel>
                    <Select
                      placeholder="Selecciona un rol"
                      value={role}
                      onChange={(e) => setRole(e.currentTarget.value)}
                    >
                      {Array.from(roles).map(([key, value]) => (
                        <option value={value}>{key}</option>
                      ))}
                    </Select>
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
                  Registrar
                </Button>
              </VStack>
            </form>
          </Box>
        </Stack>
      </Flex>
    </Box>
  )
}
