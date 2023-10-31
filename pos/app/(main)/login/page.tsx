import Logo from "@/modules/auth/components/logo"
import LoginContainer from "@/modules/auth/login"

const Login = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-neutral-100 p-10">
      <div className="flex h-full w-full items-center justify-center rounded-3xl bg-white shadow-xl">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-5 flex w-full justify-center rounded-lg border py-3">
            <Logo />
          </div>

          <LoginContainer />
        </div>
      </div>
    </div>
  )
}

export default Login
