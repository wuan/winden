import { Anchor, createStyles, Modal, Space, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { FileRejection } from "react-dropzone";
import { Link } from "react-router-dom";
import { useCancelModal } from "../../../hooks/useCancelModal";
import { useCommonStyles } from "../../../hooks/useCommonStyles";
import { useWormhole } from "../../../hooks/useWormhole";
import Content from "../../Content";
import Dropzone from "../../Dropzone";

const useStyles = createStyles((_theme) => ({
  sendPageSection: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
}));

type ModalState =
  | "NONE"
  | "TRANSFER_CANCELLED"
  | "DIRECTORIES_NOT_SUPPORTED"
  | "FILE_TOO_LARGE"
  | "OTHER_ERROR";

type ContentProps = {
  modalState: ModalState;
  onDrop: (files: File[]) => void;
  onReject: (rejections: FileRejection[]) => void;
  onModalClose: () => void;
};

export function SendBeginScreenContent(props: ContentProps) {
  const { classes: commonClasses } = useCommonStyles();
  const { classes } = useStyles();

  return (
    <Content fullHeight>
      <div
        data-testid="send-page-upload-section"
        className={classes.sendPageSection}
      >
        <Modal
          centered
          opened={props.modalState === "DIRECTORIES_NOT_SUPPORTED"}
          onClose={props.onModalClose}
          title="One at a time please :)"
        >
          <Text component="p">
            As Winden is in development state, you can only send one file at a
            time.
          </Text>
          <Text component="p">Please select a single file. </Text>
        </Modal>
        <Modal
          centered
          opened={props.modalState === "FILE_TOO_LARGE"}
          onClose={props.onModalClose}
          title="Large file sizes: coming soon"
        >
          <Text component="p">
            In this development state, this product only supports file sizes of
            up to 200 MB.
          </Text>
          <Text component="p">Please select a smaller file.</Text>
        </Modal>
        <Modal
          centered
          opened={props.modalState === "OTHER_ERROR"}
          onClose={props.onModalClose}
          title="Oops..."
        >
          <Text component="p">
            An unexpected error occurred. Please refresh the page before trying
            again.
          </Text>
        </Modal>
        <Modal
          centered
          opened={props.modalState === "TRANSFER_CANCELLED"}
          onClose={props.onModalClose}
          title="Transfer failed"
        >
          <Text component="p">The transfer was cancelled or interrupted.</Text>
          <Text component="p">Please try again.</Text>
        </Modal>
        <Text className={commonClasses.headerText}>
          Send files in real-time
        </Text>
        <Text component="p" color="dark-grey" weight={400}>
          We don’t store and <i>can’t read</i> your files. We simply transfer
          them.{" "}
          <Anchor component={Link} to="/about" color="tertiary">
            Learn more.
          </Anchor>
        </Text>
        <Text component="p" color="dark-grey" weight={400}>
          No sign-ups. No snooping. No nonsense.
        </Text>
        <Space h="md" />
        <Dropzone onDrop={props.onDrop} onReject={props.onReject} />
      </div>
    </Content>
  );
}

type Props = {};

export default function SendBeginScreen(props: Props) {
  const wormhole = useWormhole();
  const [modalState, setModalState] = useState<ModalState>("NONE");
  const [cancelModal, _setCancelModal] = useCancelModal();

  useEffect(() => {
    if (cancelModal) {
      setModalState("TRANSFER_CANCELLED");
    }
  }, [cancelModal]);

  return (
    <SendBeginScreenContent
      modalState={modalState}
      onDrop={(files) => {
        wormhole?.sendFile(files[0]);
      }}
      onReject={(rejections) => {
        if (rejections.length > 1) {
          setModalState("DIRECTORIES_NOT_SUPPORTED");
        } else if (rejections.length == 1) {
          setModalState("FILE_TOO_LARGE");
        } else {
          setModalState("OTHER_ERROR");
        }
      }}
      onModalClose={() => setModalState("NONE")}
    />
  );
}
