import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import EnquiriesListSideBar from "@/components/manage-users/communication/EnquiriesListSideBar";

export default async function ManageCommunicationsLayout({
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
      <div className=" ">
        <EnquiriesListSideBar/>
        <main className=" ml-64 ">{children}</main>
      </div>
    </div>
  );
}