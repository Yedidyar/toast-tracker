import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useState } from "react";
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

  //  () => {
  //    mutate({
  //      dateToBeDone: new Date(),
  //      occasionId: selectedOccasion.id,
  //    });
  //    closeModal();
  //  };

  return null;
});
