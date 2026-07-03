import { SignInForm, authLocalization } from "@neondatabase/auth-ui";
import Link from "next/link";

export const metadata = { title: "登入 - 手機比較王" };

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            📱 手機比較王
          </Link>
          <p className="text-gray-500 mt-2 text-sm">登入以使用完整功能</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <SignInForm localization={authLocalization} />
          <p className="text-center text-sm text-gray-500 mt-4">
            還沒有帳號？{" "}
            <Link href="/auth/sign-up" className="text-blue-600 hover:underline font-medium">
              立即註冊
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
