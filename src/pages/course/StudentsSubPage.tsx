import React from "react"
import { useContext, useState } from "react"
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Input,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { TbPlus, TbTrash } from "react-icons/tb"
import { Pagination } from "../../components/Pagination"
import { UseGet, useGet } from "../../hooks/http/useGet"
import { StudentListPage } from "../../types/types"
import { AuthContext } from "../../context/AuthContext"
import { useDelete } from "../../hooks/http/useDelete"
import { useParams } from "react-router-dom"
import { Modal } from "../../components/Modal"
import { usePost } from "../../hooks/http/usePost"

export const StudentsSubPage = ({ courseId }: { courseId: string }) => {
  const { hasRole } = useContext(AuthContext)
  const [page, setPage] = useState(0)
  const getStudents = useGet<StudentListPage>({
    key: ["getCourseStudents"],
    url: `/api/v1/courses/${courseId}/users/students?page=${page}`,
    credentials: true,
  })
  const deleteStudents = useDelete({
    key: ["deleteStudents"],
    url: `/api/v1/courses/${courseId}/users`,
    credentials: true,
    successMessage: "Estudiante desmatriculado correctamente.",
    onSuccess: () => {
      getStudents.get()
    },
  })
  const addUserModal = useDisclosure()

  const handleChangePage = (nextPage: number) => {
    setPage(nextPage)
  }

  const handleDeleteStudent = (email: string) => {
    deleteStudents.delete(email)
  }

  return (
    <VStack spacing={5}>
      <Container maxW="container.xl">
        <Flex alignItems="center">
          <Heading size="md">Estudiantes</Heading>
          <Spacer />
          {hasRole("TEACHER") && (
            <Button
              size="sm"
              leftIcon={<Icon as={TbPlus} />}
              onClick={addUserModal.onOpen}
            >
              Añadir
            </Button>
          )}
        </Flex>
      </Container>
      <AddUserModal
        isOpen={addUserModal.isOpen}
        getStudents={getStudents}
        onClose={addUserModal.onClose}
      />
      <Card as={Container} maxW="container.xl">
        <CardBody>
          <VStack spacing={4}>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th>Nombre</Th>
                    <Th>Correo electrónico</Th>
                    {hasRole("TEACHER") && <Th>Acciones</Th>}
                  </Tr>
                </Thead>
                <Tbody>
                  {getStudents.data?.content.map((s) => (
                    <Tr key={s.id}>
                      <Td>
                        <Avatar size={"sm"} name={s.name} />
                      </Td>
                      <Td>{s.name}</Td>
                      <Td>{s.email}</Td>
                      {hasRole("TEACHER") && (
                        <Td>
                          <IconButton
                            size="sm"
                            colorScheme="red"
                            icon={<TbTrash />}
                            aria-label="delete"
                            onClick={() => handleDeleteStudent(s.email)}
                          />
                        </Td>
                      )}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Pagination
              currentPage={page}
              totalPages={getStudents.data?.totalPages || 0}
              onChange={handleChangePage}
              loading={getStudents.isRefetching}
            />
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )
}

const AddUserModal = ({
  isOpen,
  onClose,
  getStudents,
}: {
  isOpen: boolean
  onClose: () => void
  getStudents: UseGet<StudentListPage>
}) => {
  const initialRef = React.useRef(null)
  const { id } = useParams()
  const postStudent = usePost({
    key: ["postStudent"],
    url: `/api/v1/courses/${id}/users`,
    credentials: true,
    successMessage: "Estudiante matriculado correctamente.",
    onSuccess: () => {
      getStudents.get()
    },
  })
  const [email, setEmail] = useState("")

  const handleClickAddUser = () => {
    postStudent.post({ email })
    onClose()
  }

  return (
    <Modal
      title="Añadir usuario"
      isOpen={isOpen}
      initialFocusRef={initialRef}
      actionText="Añadir"
      onAction={handleClickAddUser}
      onClose={onClose}
    >
      <FormControl>
        <FormLabel>Correo</FormLabel>
        <Input
          ref={initialRef}
          type="text"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
      </FormControl>
    </Modal>
  )
}
