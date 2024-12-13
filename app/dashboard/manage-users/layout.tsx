import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/options"
import ManageUsersNav from "@/components/manage-users/ManageUsersSideBar";

export default async function ManageUsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className=" bg-gray-100">
      <div className="flex flex-1">
        <ManageUsersNav />
        <main className="flex-1 ml-64">{children}</main>
      </div>
    </div>
  );
}
