import { RegisterForm } from "@/components/auth/register-form";

interface RegisterPageProps {
  searchParams: Promise<{
    token?: string;
    labId?: string;
  }>;
}

const RegisterPage = async ({ searchParams }: RegisterPageProps) => {
  const resolvedSearchParams = await searchParams;

  return (
    <RegisterForm
      token={resolvedSearchParams.token}
      labId={resolvedSearchParams.labId}
      inviteEmail={null}
    />
  );
};

export default RegisterPage;