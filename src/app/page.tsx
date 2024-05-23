"use client";
import { CreateUser } from "@/app/_components/create-user";
import { api } from "@/trpc/react";
import { useMemo } from "react";
import { UserTable } from "./_components/user-table";
import { LoadMore } from "./_components/load-more";

const limit = 4;

export default function Home() {
  const usersQuery = api.user.list.useInfiniteQuery(
    {
      limit,
    },
    {
      getNextPageParam(lastPage) {
        return lastPage.nextCursor;
      },
    },
  );

  // useMemo will not be needed when using the new react compiler!
  const users = useMemo(() => {
    return usersQuery.data?.pages.flatMap((page) => page.data) ?? [];
  }, [usersQuery.data]);

  const handleLoadMore = async () => {
    await usersQuery.fetchNextPage();
  };

  if (usersQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex size-full flex-col gap-10 p-12">
      <div className="flex flex-row items-center justify-between gap-10">
        <LoadMore
          onLoadMore={handleLoadMore}
          disabled={
            !usersQuery.hasNextPage ||
            usersQuery.isFetchingNextPage ||
            users.length < limit
          }
          fetching={usersQuery.isFetchingNextPage}
        />

        <CreateUser />
      </div>
      <UserTable users={users} />
    </div>
  );
}
