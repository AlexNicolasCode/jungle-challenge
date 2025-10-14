import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuth, useLoading } from '../../hooks'

const registerSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string().min(6, { message: 'Confirm password must be at least 6 characters' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export const Route = createFileRoute('/register/')({
  component: RegisterPage,
})

function RegisterPage() {
  const { loading, renderLoading } = useLoading()
  const { registerUser } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (payload: RegisterFormValues) => {
    const { success, error } = await registerUser({
        email: payload.email,
        name: payload.name,
        password: payload.password,
    });
    if (success) {
      navigate({ to: '/' })
      return
    }
    alert(error)
  }

  const renderPage = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <div className="mb-4">
          <Input type="text" placeholder="Name" {...register('name')} aria-invalid={!!errors.name} />
          {errors.name && <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <Input type="email" placeholder="Email" {...register('email')} aria-invalid={!!errors.email} />
          {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <Input type="password" placeholder="Password" {...register('password')} aria-invalid={!!errors.password} />
          {errors.password && <p className="text-red-500 mt-1 text-sm">{errors.password.message}</p>}
        </div>

        <div className="mb-6">
          <Input type="password" placeholder="Confirm Password" {...register('confirmPassword')} aria-invalid={!!errors.confirmPassword} />
          {errors.confirmPassword && <p className="text-red-500 mt-1 text-sm">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
    </div>
  )

  return loading ? renderLoading('Creating user...') : renderPage()
}

export default RegisterPage
