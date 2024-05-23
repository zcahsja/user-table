"use client";

import { type FormEventHandler, useState } from "react";

import { api } from "@/trpc/react";

export function CreateUser() {
  const utils = api.useUtils();
  const [name, setName] = useState("");

  const createUser = api.user.create.useMutation({
    onSuccess: async () => {
      await utils.user.list.invalidate();
      setName("");
    },
  });

  const handleSubmitUser: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    createUser.mutate({ name });
  };

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-center text-xl font-bold">New User</h2>
      <form onSubmit={handleSubmitUser} className="mx-auto flex flex-row gap-2">
        <input
          type="text"
          placeholder="Insert user name here"
          value={name}
          onChange={handleUserNameChange}
          className="rounded-lg border border-gray-400 px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="w-fit rounded-lg bg-black px-10 py-2 font-semibold text-white transition hover:bg-green-700"
          disabled={createUser.isPending}
        >
          {createUser.isPending ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}
