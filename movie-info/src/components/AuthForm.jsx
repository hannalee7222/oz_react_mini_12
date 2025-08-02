import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

export default function AuthForm({
  mode,
  fields,
  onSubmit,
  errorMessages = {},
}) {
  const isLogin = mode === 'login';

  return (
    <section className="max-w-md mx-auto mt-20 p-8 border border-gray-800 dark:border-gray-200 bg-white dark:bg-gray-400 text-black dark:text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isLogin ? '로그인' : '회원가입'}
      </h2>

      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        {fields.map((field) => {
          return (
            <div key={field.name} className="flex flex-col gap-1">
              <label htmlFor={field.name} className="font-semibold">
                {field.label}
              </label>
              <input
                id={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={field.value}
                onChange={field.onChange}
                required
                className={clsx(
                  'p-3 text-base bg-white dark:bg-gray-500 text-black dark:text-white border rounded-md focus:outline-none focus:ring-2',
                  errorMessages[field.name]
                    ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-400 focus:ring-purple-500'
                )}
              />
              {errorMessages[field.name] && (
                <p className="text-sm text-red-500">
                  {errorMessages[field.name]}
                </p>
              )}
            </div>
          );
        })}

        <button
          type="submit"
          className="p-3 bg-gray-600 text-white hover:bg-gray-700 transition rounded-md"
        >
          {isLogin ? '로그인' : '회원가입'}
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}{' '}
        <Link
          to={isLogin ? '/signup' : '/login'}
          className="text-purple-600 hover:underline"
        >
          {isLogin ? '회원가입' : '로그인'}
        </Link>
      </p>
    </section>
  );
}
