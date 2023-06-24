import { useContext } from "react"
import { Page } from "../Page"
import { useParams } from "react-router-dom"
import {
  Container,
  Heading,
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Flex,
  Spacer,
  Tag,
} from "@chakra-ui/react"
import { StudentsSubPage } from "./StudentsSubPage"
import { Course } from "../../types/types"
import { useGet } from "../../hooks/http/useGet"
import { AuthContext } from "../../context/AuthContext"
import { StudentCourseInformationSubPage } from "./StudentCourseInformationSubPage"
import { GradesSubPage } from "./GradesSubPage"
import { ManagementSubPage } from "./ManagementSubPage"
import { TeachersSubPage } from "./TeachersSubPage"
import { stringToColour } from "../../utils/color"

export const CoursePage = () => {
  const { id } = useParams()
  const getCourse = useGet<Course>({
    key: ["getCourse"],
    url: `/api/v1/courses/${id}`,
    credentials: true,
  })
  const { hasRole } = useContext(AuthContext)

  if (getCourse.isLoading) {
    return <></>
  }

  return (
    <Page>
      <Box
        p={4}
        minH="20vh"
        backgroundColor={stringToColour(getCourse.data?.id || "")}
      >
        <Container maxW="container.xl">
          <Flex alignItems="center">
            <Tag size="lg" colorScheme="gray">
              <Heading>{getCourse.data?.name}</Heading>
            </Tag>
            <Spacer />
            <Tag colorScheme="gray">
              Año escolar {Number(getCourse.data?.schoolYear) + 1}º
            </Tag>
          </Flex>
        </Container>
      </Box>
      <Tabs isLazy={true}>
        <Container maxW="container.xl">
          <TabList>
            <Tab>Calificaciones</Tab>
            <Tab>Estudiantes</Tab>
            <Tab>Profesores</Tab>
            {hasRole("STUDENT") && <Tab>Mis datos</Tab>}
            {hasRole("TEACHER") && <Tab>Gestión</Tab>}
          </TabList>
        </Container>
        <TabPanels>
          <TabPanel>
            <GradesSubPage course={getCourse.data || ({} as Course)} />
          </TabPanel>
          <TabPanel>
            <StudentsSubPage courseId={id || ""} />
          </TabPanel>
          <TabPanel>
            <TeachersSubPage courseId={id || ""} />
          </TabPanel>
          {hasRole("STUDENT") && (
            <TabPanel>
              <StudentCourseInformationSubPage courseId={id || ""} />
            </TabPanel>
          )}
          {hasRole("TEACHER") && (
            <TabPanel>
              <ManagementSubPage getCourse={getCourse} />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Page>
  )
}
