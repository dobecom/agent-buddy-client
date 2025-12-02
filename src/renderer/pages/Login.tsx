import ThemeToggle from "../components/theme-toggle";
import LoginForm from "../components/login-form";

const Login = () => {
  // const navigate = useNavigate();
  // const location = useLocation();

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { isDirty, isValid, isSubmitting },
  // } = useForm();

  // useEffect(() => {
  //   if (window.history.state?.isAutoLogout || location.state?.isAutoLogout) {
  //     // autoLogoutModal.onOpen();
  //   }
  // }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4 dark:from-gray-800 dark:to-gray-900">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-800">
        <div className="flex flex-col md:flex-row">
          <div className="flex items-center justify-center bg-blue-600 px-8 py-12 md:w-1/2">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white">AgentBuddy</h1>
              {/* <p className="text-blue-200">Log in to access your account</p> */}
            </div>
          </div>

          <div className="p-8 md:w-1/2">
            <LoginForm />
          </div>
        </div>
      </div>
      <ThemeToggle className="fixed bottom-4 right-4" />
    </div>
  );
};

export default Login;
