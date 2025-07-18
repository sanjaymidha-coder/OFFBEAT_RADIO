import { gql } from '@/__generated__'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import Error from '@/components/Error'
import Input from '@/components/Input/Input'
import Label from '@/components/Label/Label'
import LoginLayout from '@/container/login/LoginLayout'
import { NC_SITE_SETTINGS } from '@/contains/site-settings'
import { RootState } from '@/stores/store'
import getTrans from '@/utils/getTrans'
import { useMutation } from '@apollo/client'
import { decode } from 'html-entities'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

const T = getTrans()

export default function SignUp() {
	const [email, setEmail] = useState('')
	const [userName, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const { isReady, isAuthenticated } = useSelector(
		(state: RootState) => state.viewer.authorizedUser,
	)
	const router = useRouter()

	const [mutationRegisterUser, mutationRegisterUserResult] = useMutation(
		gql(/* GraphQL */ `
			mutation SignUpPageMutationRegisterUser(
				$username: String! = ""
				$email: String
				$password: String!
			) {
				registerUser(input: { username: $username, email: $email, password: $password }) {
					clientMutationId
					user {
						id
						uri
						userId
					}
				}
			}
		`),
		{
			onCompleted: data => {
				console.log('User created successfully!', { data })

				if (data?.registerUser?.user?.id) {
					toast.success('User created successfully!', {
						position: 'bottom-center',
					})
					// Optionally, redirect to login or home page
					router.replace('/login')
					return
				}

				toast.error(T['Something went wrong while creating user account!'], {
					position: 'bottom-center',
				})
			},
			onError: error => {
				if (typeof error.message !== 'string') {
					toast.error(T['Something went wrong'], {
						position: 'bottom-center',
					})
					return
				}
				// remove HTML tags from error message
				const messDecoded = decode(error.message).replace(/<[^>]*>?/gm, '')
				toast.error(messDecoded, {
					position: 'bottom-center',
				})
			},
		},
	)

	if (isReady && isAuthenticated) {
		router.replace('/')
		return null
	}

	const handleRegister = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!email || !userName || !password) {
			toast.error(T['Username and password are required!'], {
				position: 'bottom-center',
			})
			return
		}
		mutationRegisterUser({
			variables: {
				username: userName,
				email: email,
				password: password,
			},
		})
	}

	const loading = mutationRegisterUserResult.loading
	const error = mutationRegisterUserResult.error

	const renderForm = () => {
		return (
			<form onSubmit={handleRegister}>
				<div className="grid gap-4">
					<div className="grid gap-1.5">
						<Label htmlFor="username">{T.Username}</Label>
						<Input
							id="username"
							type="text"
							autoComplete="username"
							required
							onChange={e => setUsername(e.target.value)}
						/>
					</div>
					<div className="grid gap-1.5">
						<Label htmlFor="email">{T.Email}</Label>
						<Input
							id="email"
							autoCapitalize="none"
							autoComplete="email"
							autoCorrect="off"
							type="email"
							required
							onChange={e => setEmail(e.target.value)}
						/>
					</div>
					<div className="grid gap-1.5">
						<Label htmlFor="password">{T.Password}</Label>
						<Input
							id="password"
							type="password"
							autoComplete="new-password"
							required
							minLength={6}
							onChange={e => setPassword(e.target.value)}
						/>
					</div>
					<div className="grid pt-2">
						<ButtonPrimary loading={loading}>{T['Sign up']}</ButtonPrimary>
						{!!error?.message && (
							<Error className="mt-2 text-center" error={error.message} />
						)}
					</div>
				</div>
			</form>
		)
	}

	return (
		<LoginLayout
			isSignUpPage
			rightBtn={{
				text: T['Sign in'],
				href: '/login',
			}}
		>
			<>
				<div className="grid gap-6">
					{renderForm()}
				</div>
				<div>
					{NC_SITE_SETTINGS.privacy_policy_page ? (
						<p className="mb-3 text-center text-xs text-neutral-500">
							{T['By creating an account you agree with our']}{' '}
							<a
								className="font-medium underline"
								href={NC_SITE_SETTINGS.privacy_policy_page?.uri}
								target="_blank"
								rel="noopener noreferrer"
							>
								{T['Privacy Policy']}
							</a>
							.
						</p>
					) : null}

					<p className="text-center text-sm leading-6 text-neutral-600 dark:text-neutral-400">
						{T['Already have an account?']}{' '}
						<Link
							href="/login"
							className="text-primary-600 underline-offset-2 hover:text-primary-500 hover:underline dark:text-primary-500"
						>
							{T['Sign in']}!
						</Link>
					</p>
				</div>
			</>
		</LoginLayout>
	)
}
