import { SignUpForm, authLocalization } from "@neondatabase/auth-ui";
import Link from "next/link";

export const metadata = { title: "註冊 - 手機比較王" };

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            📱 手機比較王
          </Link>
          <p className="text-gray-500 mt-2 text-sm">建立帳號，開始比較手機</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <SignUpForm localization={authLocalization} />
          <p className="text-center text-sm text-gray-500 mt-4">
            已有帳號？{" "}
            <Link href="/auth/sign-in" className="text-blue-600 hover:underline font-medium">
              直接登入
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
