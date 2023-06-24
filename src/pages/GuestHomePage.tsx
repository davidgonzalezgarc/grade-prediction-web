import React from "react"
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Highlight,
  HStack,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import { NavLink } from "react-router-dom"

export const GuestHomePage = () => {
  return (
    <Box bg={useColorModeValue("gray.50", "gray.900")}>
      <Flex minH={"calc(100vh - 8rem)"} align={"center"} justify={"center"}>
        <VStack spacing={8}>
          <Heading
            fontWeight={800}
            fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
            lineHeight="tall"
            textAlign="center"
          >
            <Highlight
              query={["gestión", "predicción"]}
              styles={{ px: "2", py: "1", rounded: "3xl", bg: "blue.100" }}
            >
              Plataforma de gestión y predicción de calificaciones
            </Highlight>
          </Heading>
          <Text color={"gray.500"} maxW={"2xl"} textAlign="center">
            Inicia sesión o regístrate para disfrutar de todas las
            funcionalidades de gestión de asignaturas, alumnos, calificaciones y
            sus predicciones.
          </Text>
          <HStack spacing={6}>
            <Button as={NavLink} variant="outline" to={"/login"}>
              Iniciar sesión
            </Button>
            <Button as={NavLink} to={"/signup"}>
              Registrarse
            </Button>
          </HStack>
        </VStack>
      </Flex>
    </Box>
  )
}
