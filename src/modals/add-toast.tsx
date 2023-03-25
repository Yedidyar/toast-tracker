import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useState } from "react";
import { Select } from "../components/select";
import { Modal } from "../components/modal";
import { api } from "../utils/api";

export const AddToastModal = NiceModal.create(() => {
  const modal = useModal();

  const { mutate } = api.toast.create.useMutation();
  const { data: occasions } = api.occasion.getAll.useQuery();

  const closeModal = () => void modal.hide();

  const [selectedOccasion, setSelectedOccasion] = useState({
    id: "",
    name: "יש לבחור",
  });

  return (
    <Modal niceModalHandler={modal} title="הוספת שתיה">
      <div>
        <div className="mt-2 h-96">
          {occasions && occasions[0] ? (
            <Select
              options={occasions}
              renderOption={(occasion) => occasion.name}
              selectedOption={selectedOccasion}
              onChange={setSelectedOccasion}
            />
          ) : null}
        </div>
        <div className="mt-4">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 enabled:hover:bg-blue-200 disabled:opacity-60"
            onClick={() => {
              mutate({
                dateToBeDone: new Date(),
                occasionId: selectedOccasion.id,
              });
              closeModal();
            }}
          >
            הוספה
          </button>
        </div>
      </div>
    </Modal>
  );
});
