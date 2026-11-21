import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import '../css/shared.css'
import '../css/auth.css'

export default function AuthPage({ mode }) {
  const isSignup = mode === 'signup'
  const [message, setMessage] = useState('')

  function updatePasswordMatch(form) {
    const password = form.elements.namedItem('password')
    const confirmation = form.elements.namedItem('confirmPassword')
    confirmation.setCustomValidity(
      !confirmation.value || confirmation.value === password.value ? '' : 'Passwords do not match.',
    )
  }

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    if (isSignup && formData.get('password') !== formData.get('confirmPassword')) {
      setMessage('Those passwords do not match. Please check and try again.')
      return
    }

    setMessage(`${isSignup ? 'Account creation' : 'Account sign-in'} is not connected yet. Your information has not been saved.`)
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <aside className="auth-promo" aria-label="About My Hub">
          <div className="auth-promo-orb auth-promo-orb-one" />
          <div className="auth-promo-orb auth-promo-orb-two" />
          <div className="auth-promo-content">
            <span className="auth-promo-mark"><Icon name="grid" size={22} /></span>
            <p className="auth-promo-kicker">A little more organized</p>
            <h2>Make room for what matters.</h2>
            <p className="auth-promo-copy">Your tasks, notes, files, and everyday details, all together in one calm workspace.</p>
            <div className="auth-feature-list">
              <span><Icon name="checkSquare" size={17} />Tasks that stay on track</span>
              <span><Icon name="fileText" size={17} />Notes ready when you need them</span>
              <span><Icon name="folder" size={17} />Files in their place</span>
            </div>
          </div>
          <p className="auth-promo-footer">Your personal space, at your pace.</p>
        </aside>

        <div className="auth-form-panel">
          <Link className="auth-brand" to="/" aria-label="My Hub home">
            <span className="auth-brand-icon"><Icon name="grid" size={18} /></span>
            <span>My Hub</span>
          </Link>

          <div className="auth-heading">
            <p className="auth-eyebrow">{isSignup ? 'GET STARTED' : 'WELCOME BACK'}</p>
            <h1 id="auth-title">{isSignup ? 'Create your account' : 'Sign in to your account'}</h1>
            <p>{isSignup ? 'Set up your space and keep everything in one place.' : 'Pick up where you left off in your personal hub.'}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignup && (
              <label className="auth-field">
                <span>Your name</span>
                <input autoComplete="name" name="name" placeholder="Jordan Lee" required />
              </label>
            )}
            <label className="auth-field">
              <span>Email address</span>
              <input autoComplete="email" name="email" placeholder="you@example.com" required type="email" />
            </label>
            <label className="auth-field">
              <span>Password</span>
              <input
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                minLength={isSignup ? 8 : undefined}
                name="password"
                onChange={(event) => {
                  if (isSignup) updatePasswordMatch(event.currentTarget.form)
                }}
                placeholder={isSignup ? 'At least 8 characters' : 'Enter your password'}
                required
                type="password"
              />
            </label>
            {isSignup && (
              <label className="auth-field">
                <span>Confirm password</span>
                <input
                  autoComplete="new-password"
                  minLength={8}
                  name="confirmPassword"
                  onChange={(event) => updatePasswordMatch(event.currentTarget.form)}
                  placeholder="Re-enter your password"
                  required
                  type="password"
                />
              </label>
            )}

            {!isSignup && (
              <label className="auth-remember">
                <input name="remember" type="checkbox" />
                <span>Remember me</span>
              </label>
            )}

            <button className="auth-submit" type="submit">
              {isSignup ? 'Create account' : 'Sign in'}
              <span aria-hidden="true">→</span>
            </button>
            {message && <p className="auth-message" role="status">{message}</p>}
          </form>

          <p className="auth-switch">
            {isSignup ? 'Already have an account?' : 'New to My Hub?'}
            {' '}
            <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Sign in' : 'Create an account'}</Link>
          </p>
          <Link className="auth-home-link" to="/">Continue to dashboard</Link>
        </div>
      </section>
    </main>
  )
}
