import { PropTypes } from "prop-types";
import { Modal, RevertActionButton, AffirmActionButton } from "../ui";

/**
 * Dialog Modal to confirm user wants to cancel uploading Dustrak and GPS File
 * Lives in the 'UploadConfirm' component
 * @property {boolean} shouldShowCancelModal whether the cancel modal should be open
 * @property {function} closeCancelModal overrides 'setShouldShowCancelModal' with true
 * @property {function} cancelUpload executes process on 'ConfirmUpload' component to cancel upload process
 */
export const UploadCancelModal = ({
  shouldShowCancelModal,
  closeCancelModal,
  cancelUpload,
}) => {
  return (
    <Modal size="small" open={shouldShowCancelModal} onClose={closeCancelModal}>
      <Modal.Header>Cancel data upload?</Modal.Header>
      <Modal.Content>Canceling now will delete your data.</Modal.Content>
      <Modal.Actions>
        <RevertActionButton onClick={closeCancelModal}>
          Go Back
        </RevertActionButton>
        <AffirmActionButton onClick={cancelUpload}>
          Cancel Upload
        </AffirmActionButton>
      </Modal.Actions>
    </Modal>
  );
};

UploadCancelModal.propTypes = {
  shouldShowCancelModal: PropTypes.bool.isRequired,
  closeCancelModal: PropTypes.func.isRequired,
  cancelUpload: PropTypes.func.isRequired,
};
