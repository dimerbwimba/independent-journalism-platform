import SignInForm from "@/components/auth/SignInForm"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="mt-2 text-gray-600">
            Sign up to start writing and sharing your stories
          </p>
        </div>
        <SignInForm isRegister />
      </div>
    </div>
  )
} 