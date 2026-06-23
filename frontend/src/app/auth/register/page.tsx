import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-bg-page flex items-center justify-center py-12">
      <div className="mx-auto w-full max-w-120 px-4 sm:px-6">
        <RegisterForm />
      </div>
    </main>
  );
}
