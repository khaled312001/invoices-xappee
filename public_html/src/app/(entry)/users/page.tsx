
import ClientCard from "@/components/clients/client";
import UserCard from "@/components/users/user";
import { fetchUsers } from "@/lib/services/auth.service";

export default async function Users() {
  let usersData = []
  try {
     usersData = await fetchUsers();
  } catch (err: any) {}

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center justify-between">
        <h1 className="text-lg">
          Users
          <span className=" text-muted-foreground">
            {" "}
            {` (${usersData?.length ?? 0})`}
          </span>
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {usersData?.map((user: any, i: number) => (
          <UserCard key={i} userData={user} />
        ))}
      </div>
    </div>
  );
}
