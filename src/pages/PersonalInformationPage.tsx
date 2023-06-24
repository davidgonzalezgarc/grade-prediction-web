import React, { useState, useEffect } from "react"
import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Heading,
  VStack,
} from "@chakra-ui/react"

import { useGet } from "../hooks/http/useGet"
import { StudentInformation } from "../types/types"
import { Page } from "./Page"
import { Form } from "../components/form/Form"
import { RadioGroup } from "../components/form/RadioGroup"
import { NumberInput } from "../components/form/NumberInput"
import { Slider } from "../components/form/Slider"
import { usePut } from "../hooks/http/usePut"

export type StudentInformationForm = {
  id: string
  sex: string
  age: number
  address: string
  familySize: string
  parentsStatus: string
  motherEducation: string
  fatherEducation: string
  motherJob: string
  fatherJob: string
  extraCurricularActivities: string
  romanticRelationship: string
  freeTime: number
  goOut: number
  workdayAlcohol: number
  weekendAlcohol: number
  healthStatus: number
}

export const PersonalInformationPage = () => {
  const getStudentInformation = useGet<StudentInformation>({
    key: ["getStudentInformation"],
    url: `/api/v1/users/info`,
    credentials: true,
  })
  const putStudentInformation = usePut<StudentInformation>({
    key: ["putStudentInformation"],
    url: `/api/v1/users/info`,
    credentials: true,
    successMessage: "Información actualizada correctamente.",
  })

  const studentInformationToForm = (
    studentInformation: StudentInformation
  ): StudentInformationForm => {
    return {
      ...studentInformation,
      motherEducation: String(studentInformation.motherEducation),
      fatherEducation: String(studentInformation.fatherEducation),
      extraCurricularActivities: studentInformation.extraCurricularActivities
        ? "true"
        : "false",
      romanticRelationship: studentInformation.romanticRelationship
        ? "true"
        : "false",
    }
  }

  const formToStudentInformation = (
    form: StudentInformationForm
  ): StudentInformation => {
    return {
      ...form,
      motherEducation: Number(form.motherEducation),
      fatherEducation: Number(form.fatherEducation),
      extraCurricularActivities: form.extraCurricularActivities === "true",
      romanticRelationship: form.romanticRelationship === "true",
    }
  }

  const handleSubmit = (values: StudentInformationForm) => {
    putStudentInformation.put(formToStudentInformation(values)) 
  }

  if (getStudentInformation.isLoading || !getStudentInformation.data) {
    return <>loading!!</>
  }

  return (
    <Page props={{ p: 4 }}>
      <VStack spacing={5}>
        <Container maxW="container.xl">
          <Heading>Información personal</Heading>
        </Container>
        <Container as={Card} maxW="container.xl">
          <Form
            initialValues={studentInformationToForm(getStudentInformation.data)}
            onSubmit={handleSubmit}
          >
            <CardBody as={VStack} spacing={5} alignItems="start">
              <RadioGroup
                name={"sex"}
                label={"Sexo"}
                radios={[
                  { name: "Hombre", value: "M" },
                  { name: "Mujer", value: "F" },
                ]}
              />
              <NumberInput name={"age"} label={"Edad"} min={5} max={99} />
              <RadioGroup
                name={"address"}
                label={"Medio en el que vive"}
                radios={[
                  { name: "Rural", value: "R" },
                  { name: "Urbano", value: "U" },
                ]}
              />
              <RadioGroup
                name={"familySize"}
                label={"Tamaño familiar"}
                radios={[
                  { name: "Igual o menor que 3", value: "LE3" },
                  { name: "Mayor que 3", value: "GT3" },
                ]}
              />
              <RadioGroup
                name={"parentsStatus"}
                label={"Sus padres viven..."}
                radios={[
                  { name: "Juntos", value: "T" },
                  { name: "Separados", value: "A" },
                ]}
              />
              <RadioGroup
                name={"motherEducation"}
                label={"Nivel de educación de la madre"}
                radios={[
                  { name: "Ninguna", value: "1" },
                  { name: "Primaria", value: "2" },
                  { name: "Secundaria", value: "3" },
                  { name: "Superior", value: "4" },
                ]}
              />
              <RadioGroup
                name={"fatherEducation"}
                label={"Nivel de educación del padre"}
                radios={[
                  { name: "Ninguna", value: "1" },
                  { name: "Primaria", value: "2" },
                  { name: "Secundaria", value: "3" },
                  { name: "Superior", value: "4" },
                ]}
              />
              <RadioGroup
                name={"motherJob"}
                label={"Trabajo de la madre"}
                radios={[
                  { name: "Profesora", value: "teacher" },
                  { name: "Sanitaria", value: "health" },
                  { name: "Servicios civiles", value: "services" },
                  { name: "Ama de casa", value: "at_home" },
                  { name: "Otro", value: "other" },
                ]}
              />
              <RadioGroup
                name={"fatherJob"}
                label={"Trabajo del padre"}
                radios={[
                  { name: "Profesor", value: "teacher" },
                  { name: "Sanitario", value: "health" },
                  { name: "Servicios civiles", value: "services" },
                  { name: "Amo de casa", value: "at_home" },
                  { name: "Otro", value: "other" },
                ]}
              />
              <RadioGroup
                name={"extraCurricularActivities"}
                label={"Realiza actividades extracurriculares"}
                radios={[
                  { name: "Si", value: "true" },
                  { name: "No", value: "false" },
                ]}
              />
              <RadioGroup
                name={"romanticRelationship"}
                label={"En una relación amorosa"}
                radios={[
                  { name: "Si", value: "true" },
                  { name: "No", value: "false" },
                ]}
              />
              <Slider
                name={"freeTime"}
                label={"Tiempo libre (1 muy poco, 5 mucho)"}
                min={1}
                max={5}
                step={1}
                marks={[
                  { value: 1 },
                  { value: 2 },
                  { value: 3 },
                  { value: 4 },
                  { value: 5 },
                ]}
              />
              <Slider
                name={"goOut"}
                label={"Salidas con amigos (1 muy pocas, 5 muchas)"}
                min={1}
                max={5}
                step={1}
                marks={[
                  { value: 1 },
                  { value: 2 },
                  { value: 3 },
                  { value: 4 },
                  { value: 5 },
                ]}
              />
              <Slider
                name={"workdayAlcohol"}
                label={
                  "Consumo de alcohol entre semana (1 muy bajo, 5 muy alto)"
                }
                min={1}
                max={5}
                step={1}
                marks={[
                  { value: 1 },
                  { value: 2 },
                  { value: 3 },
                  { value: 4 },
                  { value: 5 },
                ]}
              />
              <Slider
                name={"weekendAlcohol"}
                label={
                  "Consumo de alcohol fin de semana (1 muy bajo, 5 muy alto)"
                }
                min={1}
                max={5}
                step={1}
                marks={[
                  { value: 1 },
                  { value: 2 },
                  { value: 3 },
                  { value: 4 },
                  { value: 5 },
                ]}
              />
              <Slider
                name={"healthStatus"}
                label={"Salud (1 muy poca, 5 mucha)"}
                min={1}
                max={5}
                step={1}
                marks={[
                  { value: 1 },
                  { value: 2 },
                  { value: 3 },
                  { value: 4 },
                  { value: 5 },
                ]}
              />
              <Button type="submit" size="sm">
                Guardar
              </Button>
            </CardBody>
          </Form>
        </Container>
      </VStack>
    </Page>
  )
}
