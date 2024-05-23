"use client";
import { type UserRouterOutput } from "@/server/api/routers/user";
import { api } from "@/trpc/react";
import Link from "next/link";

type User = UserRouterOutput["list"]["data"][0];

export function UserTable({ users }: { users: User[] }) {
  const utils = api.useUtils();

  const deleteUser = api.user.delete.useMutation({
    onSuccess: async () => {
      await utils.user.list.invalidate();
    },
  });

  const handleDeleteUser = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    const id = Number(event.currentTarget.dataset.id);
    if (isNaN(id)) {
      return;
    }
    deleteUser.mutate({ id });
  };

  return (
    <table className="min-w-full divide-y divide-gray-200 rounded-sm border border-black">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            Created At
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            Updated At
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {users.length > 0 ? (
          users.map((user) => (
            <Link legacyBehavior key={user.id} href={`/profile/${user.id}`}>
              <tr className="group cursor-pointer hover:bg-gray-200">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {user.id}
                  <button
                    data-id={user.id}
                    onClick={handleDeleteUser}
                    className="invisible ml-4 rounded-lg bg-red-500 p-2 text-white group-hover:visible"
                  >
                    Delete user
                  </button>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {user.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {user.createdAt.toISOString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {user.updatedAt?.toISOString() ??
                    user.createdAt.toISOString()}
                </td>
              </tr>
            </Link>
          ))
        ) : (
          <tr>
            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
              There are currently no users - create some above!
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
