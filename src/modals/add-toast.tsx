import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useState } from "react";
import { Modal } from "../components/modal";
import { api } from "../utils/api";

export const AddToastModal = NiceModal.create(() => {
  const modal = useModal();

  const { mutate } = api.toast.create.useMutation();

  const closeModal = () => void modal.hide();

  const [allowClose, setAllowClose] = useState(false);

  return (
    <Modal niceModalHandler={modal} title="הוספת שתיה" allowClose={allowClose}>
      <div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">asas</p>
        </div>
        <input
          type="checkbox"
          name=""
          id=""
          checked={allowClose}
          onChange={() => {
            setAllowClose((is) => !is);
          }}
        />
        <div className="mt-4">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 enabled:hover:bg-blue-200 disabled:opacity-60"
            onClick={() => {
              mutate({
                dateToBeDone: new Date(),
                occasionId: "clfnulx4x00158ou0r2be0kiq",
              });
              allowClose && closeModal();
            }}
            disabled={!allowClose}
          >
            הוספה
          </button>
        </div>
      </div>
    </Modal>
  );
});
