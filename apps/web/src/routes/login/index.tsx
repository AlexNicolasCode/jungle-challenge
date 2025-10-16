import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '../../hooks'
import { LoginFormValues, loginSchema } from './-schemas'

export const Route = createFileRoute('/login/')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (form: LoginFormValues) => {
    const { success, error } = await login(form);
    if (success) {
      navigate({ to: '/' });
      return;
    }
    alert(error);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <div className="mb-4">
          <Input
            type="email"
            placeholder="Email"
            {...register('email')}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-6">
          <Input
            type="password"
            placeholder="Password"
            {...register('password')}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-red-500 mt-1 text-sm">{errors.password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  )
}
