import { useId, useState } from 'react'

const COPY = {
  login: { submit: 'Log in', busy: 'Logging in...' },
  register: { submit: 'Create account', busy: 'Creating account...' },
}

function AuthForm({ mode = 'login', onSubmit }) {
  const id = useId()
  const isRegister = mode === 'register'
  const copy = COPY[mode] ?? COPY.login

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setNotice('')

    const values = {
      displayName: displayName.trim(),
      email: email.trim(),
      password,
    }

    if (isRegister && values.displayName.length < 2) {
      setError('Display name must be at least 2 characters.')
      return
    }
    if (!values.email || !values.password) {
      setError('Email and password are required.')
      return
    }
    if (isRegister && values.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setSubmitting(true)
    try {
      const result = await onSubmit(values)
      if (result?.notice) {
        setNotice(result.notice)
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {isRegister && (
        <div className="auth-form__field">
          <label htmlFor={`${id}-name`}>Display name</label>
          <input
            id={`${id}-name`}
            type="text"
            autoComplete="nickname"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
        </div>
      )}

      <div className="auth-form__field">
        <label htmlFor={`${id}-email`}>Email</label>
        <input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="auth-form__field">
        <label htmlFor={`${id}-password`}>Password</label>
        <input
          id={`${id}-password`}
          type="password"
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

           {error && (
        <p className="auth-form__feedback auth-form__feedback--error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="auth-form__feedback auth-form__feedback--success" role="status">
          {notice}
        </p>
      )}

      <button className="auth-form__submit" type="submit" disabled={submitting}>
        {submitting ? copy.busy : copy.submit}
      </button>
    </form>
  )
}

export default AuthForm