import { useRef, useState } from 'react'
import { MedicalCrossIcon, ShieldIcon, EyeIcon, EyeOffIcon, AlertCircleIcon } from '../../components/Icons'

export default function StaffLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const usernameRef = useRef(null)
  const passwordRef = useRef(null)

  function updateField(field, value) {
    if (field === 'username') setUsername(value)
    else setPassword(value)
    setErrors(current => ({ ...current, [field]: undefined }))
    setStatus('idle')
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    if (!username.trim()) nextErrors.username = 'Vui lòng nhập tên đăng nhập hoặc email.'
    if (!password.trim()) nextErrors.password = 'Vui lòng nhập mật khẩu.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setStatus('invalid')
      if (nextErrors.username) usernameRef.current.focus()
      else passwordRef.current.focus()
      return
    }
    // UI only: no request, persistence, session or role assignment.
    setPassword('')
    setShowPassword(false)
    setStatus('unavailable')
  }

  const inputClass = 'min-h-12 w-full rounded-xl border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-sky-700'

  return (
    <div className="flex min-h-screen flex-col gap-8 bg-slate-50 px-4 py-6 text-slate-900 sm:gap-12 sm:px-6 sm:py-8">
      <a className="skip-link" href="#staff-login-main">Đến biểu mẫu đăng nhập</a>
      <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-700 text-white"><MedicalCrossIcon className="size-6" /></span>
          <div><span className="block text-lg font-bold tracking-tight">Clinic Management</span><span className="block text-xs text-slate-600 sm:text-sm">Hệ thống dành cho nhân viên</span></div>
        </div>
        <span className="hidden items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-900 sm:inline-flex"><ShieldIcon className="size-4" /> Khu vực nội bộ</span>
      </header>

      <main id="staff-login-main" tabIndex={-1} className="mx-auto my-auto grid w-full max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-16">
        <section aria-labelledby="staff-intro" className="space-y-5">
          <p className="text-xs font-bold tracking-[0.18em] text-sky-700">KHÔNG GIAN LÀM VIỆC</p>
          <h2 id="staff-intro" className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl">Một điểm truy cập.<br /><span className="text-sky-700">Đúng vai trò của bạn.</span></h2>
          <p className="hidden max-w-md text-base leading-8 text-slate-600 lg:block">Không gian làm việc dành riêng cho nhân viên phòng khám. Sử dụng tài khoản do đơn vị quản lý cấp để đăng nhập.</p>
          <div className="hidden space-y-2 rounded-2xl border border-teal-200 bg-teal-50 p-6 text-teal-900 lg:block">
            <p className="flex items-center gap-2 text-sm font-semibold"><ShieldIcon className="size-5" /> Tài khoản do phòng khám cấp</p>
            <p className="text-sm leading-7">Quyền truy cập sẽ được xác định từ tài khoản sau khi hệ thống xác thực được kết nối.</p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="login-title">
          <h1 id="login-title" className="text-2xl leading-snug font-bold tracking-tight">Đăng nhập hệ thống phòng khám</h1>
          <p className="mt-2 text-sm text-slate-600">Dành cho nhân viên được cấp quyền.</p>
          <div id="auth-notice" className="mt-6 flex gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm leading-6 text-sky-900">
            <AlertCircleIcon className="mt-0.5 size-5 shrink-0" />
            <div><p className="font-semibold">Đăng nhập chưa khả dụng</p><p className="mt-1">Backend xác thực chưa được triển khai. Biểu mẫu hiện chỉ kiểm tra thông tin trên thiết bị.</p></div>
          </div>

          <form noValidate onSubmit={handleSubmit} aria-describedby="auth-notice" className="mt-6 space-y-5">
            <div className="space-y-2">
              <label htmlFor="staff-username" className="block text-sm font-semibold">Tài khoản <span aria-hidden="true" className="text-rose-700">*</span></label>
              <input ref={usernameRef} id="staff-username" name="username" type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} required value={username} onChange={event => updateField('username', event.target.value)} placeholder="Tên đăng nhập hoặc email" aria-invalid={Boolean(errors.username)} aria-describedby={errors.username ? 'username-error' : undefined} className={`${inputClass} ${errors.username ? 'border-rose-700' : 'border-slate-400'}`} />
              {errors.username && <p id="username-error" className="text-sm text-rose-700">{errors.username}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="staff-password" className="block text-sm font-semibold">Mật khẩu <span aria-hidden="true" className="text-rose-700">*</span></label>
              <div className="relative">
                <input ref={passwordRef} id="staff-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={event => updateField('password', event.target.value)} placeholder="Nhập mật khẩu" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'password-error' : undefined} className={`${inputClass} pr-14 ${errors.password ? 'border-rose-700' : 'border-slate-400'}`} />
                <button type="button" onClick={() => setShowPassword(visible => !visible)} disabled={!password} aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} aria-pressed={showPassword} aria-controls="staff-password" className="absolute inset-y-0 right-0 flex min-w-12 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent">
                  {showPassword ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
                </button>
              </div>
              {errors.password && <p id="password-error" className="text-sm text-rose-700">{errors.password}</p>}
            </div>
            <button type="submit" className="flex min-h-12 w-full items-center justify-center rounded-xl bg-sky-700 px-4 text-sm font-bold text-white transition-colors hover:bg-sky-800 active:bg-sky-900">Đăng nhập</button>
            <div role="status" aria-live="polite" aria-atomic="true">
              {status === 'invalid' && <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-800">Vui lòng kiểm tra các trường bắt buộc được đánh dấu.</p>}
              {status === 'unavailable' && <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">Chưa thể đăng nhập vì Backend xác thực chưa được kết nối. Thông tin không được gửi đi hoặc lưu lại; mật khẩu đã được xóa khỏi biểu mẫu. Chưa có phiên đăng nhập nào được tạo.</p>}
            </div>
          </form>
          <p className="mt-5 text-sm leading-6 text-slate-600">Chưa có tài khoản hoặc cần hỗ trợ? Vui lòng liên hệ người quản lý phòng khám.</p>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-6xl flex-col justify-between gap-2 text-center text-xs leading-6 text-slate-600 sm:flex-row sm:text-left"><p>© 2026 Clinic Management</p><p>Thông tin không được gửi đi hoặc lưu lại khi gửi biểu mẫu.</p></footer>
    </div>
  )
}
