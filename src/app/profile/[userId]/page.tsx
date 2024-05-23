import { api } from "@/trpc/server";

export default async function Page({ params }: { params: { userId: string } }) {
  const user = await api.user.byId({ id: parseInt(params.userId) });
  if (!user) {
    return <div>User not found</div>;
  }
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-3xl font-bold">User Profile</h2>
      <div className="flex flex-col gap-2">
        <div>
          <span className="font-bold">Name:</span> {user.name}
        </div>
        <div>
          <span className="font-bold">Created At:</span>{" "}
          {new Date(user.createdAt).toDateString()}
        </div>
        <div>
          <span className="font-bold">Updated At:</span>{" "}
          {new Date(user.updatedAt ?? user.createdAt).toDateString()}
        </div>
      </div>
    </div>
  );
}
