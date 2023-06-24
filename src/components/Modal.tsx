import React, { ReactNode } from "react"
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Modal as ChakraModal,
  ModalFooter,
  Button,
  VStack,
} from "@chakra-ui/react"
import { FocusableElement } from "@chakra-ui/utils"

type ModalProps = {
  title: string
  isOpen: boolean
  initialFocusRef?: React.RefObject<FocusableElement>
  actionText: string
  onAction: () => void
  actionEnabled?: boolean
  onClose: () => void
  children: ReactNode | ReactNode[]
}

export const Modal = (props: ModalProps) => {
  return (
    <ChakraModal
      initialFocusRef={props.initialFocusRef}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{props.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{props.children}</ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            colorScheme="blue"
            mr={3}
            onClick={props.onAction}
            isDisabled={
              props.actionEnabled !== undefined ? !props.actionEnabled : false
            }
          >
            {props.actionText}
          </Button>
          <Button size="sm" variant="outline" onClick={props.onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  )
}
