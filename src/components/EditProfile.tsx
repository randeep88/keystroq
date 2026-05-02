import { Avatar, Button, Form, Modal, Spinner } from "@heroui/react";
import { Edit } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDbUser } from "../hooks/useDbUser";

const EditProfile = ({ user }: { user: any }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit } = useForm<any>();
  const { ref: registerRef, ...registerRest } = register("photo");

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { updatePhoto, isUpdating } = useDbUser({
    userId: user?.id,
    email: user?.email,
  });

  const handleEditProfile = async (data: any) => {
    const formData = new FormData();
    formData.append("photo", data.photo[0]);

    updatePhoto(
      { userId: user.id, formData },
      { onSuccess: () => setIsModalOpen(false) },
    );
  };

  return (
    <Modal onOpenChange={setIsModalOpen} isOpen={isModalOpen}>
      <Modal.Trigger>
        <div className="rounded-full relative overflow-hidden group">
          <Avatar className="size-18" size="lg">
            <Avatar.Image src={user?.imageUrl} />
            <Avatar.Fallback>
              {user?.firstName?.charAt(0).toUpperCase()}
            </Avatar.Fallback>
          </Avatar>
          <div className="bg-black/50 absolute group-hover:opacity-100 opacity-0 transition-opacity inset-0 flex items-center justify-center">
            <Edit size={20} />
          </div>
        </div>
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container size="xs">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Update Photo</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <Form
                className="flex p-2 flex-col gap-4"
                onSubmit={handleSubmit(handleEditProfile)}
              >
                <div className="flex items-center gap-10 justify-center">
                  <Avatar className="size-52" size="lg">
                    <Avatar.Image src={previewUrl || user?.imageUrl} />
                    <Avatar.Fallback>
                      {user?.firstName?.charAt(0).toUpperCase()}
                    </Avatar.Fallback>
                  </Avatar>
                </div>
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload new Photo
                  </Button>

                  <input
                    hidden
                    type="file"
                    {...registerRest}
                    ref={(e) => {
                      registerRef(e);
                      fileInputRef.current = e;
                    }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setPreviewUrl(url);
                      }
                      registerRest.onChange(e);
                    }}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {isUpdating && <Spinner color="current" />}
                  {isUpdating ? "Submitting..." : "Submit"}
                </Button>
              </Form>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default EditProfile;
