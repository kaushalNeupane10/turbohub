import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-bg-page">
      <div className="mx-auto flex min-h-screen max-w-[480px] items-center px-4 sm:px-6">
        <RegisterForm />
      </div>
    </main>
  );
}
