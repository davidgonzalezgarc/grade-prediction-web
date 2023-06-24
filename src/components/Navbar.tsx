import {
  IconButton,
  Avatar,
  Box,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Text,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Button,
  MenuGroup,
  useDisclosure,
  Heading,
  useColorMode,
} from "@chakra-ui/react"
import { useContext } from "react"
import { FiHome } from "react-icons/fi"
import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import { NavLink } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

export const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isLoggedIn, currentUser, hasRole, logout } = useContext(AuthContext)
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box px={4}>
      <Flex h={"4rem"} alignItems={"center"} justifyContent={"space-between"}>
        <Heading size="md">TFG</Heading>
        <HStack spacing={4}>
          <IconButton
            size={"md"}
            colorScheme={"whiteAlpha"}
            bg={useColorModeValue("white", "gray.800")}
            color={useColorModeValue("black", "white")}
            _hover={{
              textDecoration: "none",
              bg: useColorModeValue("gray.100", "whiteAlpha.200"),
            }}
            icon={<FiHome size={20} />}
            aria-label={"Home"}
            as={NavLink}
            to={"/"}
          />
          <IconButton
            size={"md"}
            colorScheme={"whiteAlpha"}
            bg={useColorModeValue("white", "gray.800")}
            color={useColorModeValue("black", "white")}
            _hover={{
              textDecoration: "none",
              bg: useColorModeValue("gray.100", "whiteAlpha.200"),
            }}
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            aria-label={"ColorMode"}
            onClick={toggleColorMode}
          />

          {isLoggedIn() ? (
            <Box>
              <Menu>
                <MenuButton
                  py={2}
                  transition="all 0.3s"
                  _focus={{ boxShadow: "none" }}
                >
                  <Avatar size={"sm"} name={currentUser?.name} />
                </MenuButton>
                <MenuList
                  bg={useColorModeValue("white", "gray.900")}
                  borderColor={useColorModeValue("gray.200", "gray.700")}
                >
                  <MenuGroup title="Cuenta">
                    <HStack px={3} py={1}>
                      <Avatar size={"sm"} name={currentUser?.name} />
                      <VStack alignItems="flex-start" spacing={0.25} ml="2">
                        <Text fontSize="sm">{currentUser?.name}</Text>
                        <Text fontSize="sm">{currentUser?.email}</Text>
                        <Text fontSize="xs" color="gray.600">
                          {currentUser?.role}
                        </Text>
                      </VStack>
                    </HStack>
                    {hasRole("STUDENT") && (
                      <MenuItem as={NavLink} to="/data">
                        Mis datos
                      </MenuItem>
                    )}
                  </MenuGroup>
                  <MenuDivider />
                  <MenuItem onClick={() => logout()}>Salir</MenuItem>
                </MenuList>
              </Menu>
            </Box>
          ) : (
            <>
              <Button as={NavLink} size="sm" variant="outline" to={"/login"}>
                Iniciar sesión
              </Button>
              <Button as={NavLink} size="sm" to={"/signup"}>
                Registrarse
              </Button>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  )
}
