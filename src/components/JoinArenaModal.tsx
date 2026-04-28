"use client";

import {
  Button,
  FieldError,
  Form,
  Input,
  Modal,
  TextField,
} from "@heroui/react";
import { useState } from "react";

const JoinArenaModal = ({
  handleJoinArena,
}: {
  handleJoinArena: (arenaId: string) => void;
}) => {
  const [arenaId, setArenaId] = useState("");

  return (
    <Modal>
      <Button variant="tertiary" className="w-full" size="lg">
        Join Arena
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading className="text-xl">Join Arena</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p>Enter the arena ID to join an existing arena.</p>
              <Form
                className="p-1 mt-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleJoinArena(arenaId);
                }}
              >
                <TextField
                  isRequired
                  name="arenaId"
                  type="arenaId"
                  variant="secondary"
                >
                  <Input
                    placeholder="Arena ID"
                    value={arenaId}
                    onChange={(e) => setArenaId(e.target.value)}
                  />
                  <FieldError>Arena ID is required</FieldError>
                </TextField>
                <Button type="submit" className="w-full mt-5">
                  Continue
                </Button>
              </Form>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default JoinArenaModal;
