import { randomUUID } from 'node:crypto'
import { test as base, expect } from '@playwright/test'

// Every browser scenario also checks runtime errors and console warnings/errors.
const test = base.extend({
  page: async ({ page }, runScenario) => {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => {
      if (['error', 'warning'].includes(message.type())) errors.push(message.text())
    })
    await runScenario(page)
    expect(errors, 'Browser console and runtime errors').toEqual([])
  },
})

const internalLinks = 'a[href^="/staff"], a[href^="/doctor"], a[href^="/receptionist"]'
const loginTitle = 'Đăng nhập hệ thống phòng khám'

async function checkLogin(page) {
  await expect(page.getByRole('heading', { name: loginTitle })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Điều hướng chính' })).toHaveCount(0)
  await expect(page.getByText('Dành cho nhân viên được cấp quyền.')).toBeVisible()
  await expect(page.getByText('Đăng nhập chưa khả dụng', { exact: true })).toBeVisible()
}

test('TC01/TC02: public navigation has patient links only', async ({ page, isMobile }) => {
  await page.goto('/')
  await expect(page.locator(internalLinks)).toHaveCount(0)
  await expect(page.getByRole('heading', { name: /Tìm hiểu trước khi đến khám/ })).toBeVisible()
  if (isMobile) await page.getByRole('button', { name: 'Mở menu điều hướng' }).click()
  const nav = page.getByRole('navigation', { name: isMobile ? 'Điều hướng trên điện thoại' : 'Điều hướng chính', exact: true })
  for (const label of ['Giới thiệu', 'Dịch vụ', 'Quy trình', 'Liên hệ']) {
    await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible()
  }
  await expect(page.locator(internalLinks)).toHaveCount(0)
  await expect(page.locator('footer')).not.toContainText(/nhân viên|Phân hệ|01234|3888|chuyên môn cao/)
})

test('TC03: staff login has an independent layout', async ({ page }) => {
  await page.goto('/staff/login')
  await checkLogin(page)
  await expect(page.getByText('Clinic Management', { exact: true })).toBeVisible()
  await expect(page.getByLabel('Tài khoản')).toHaveAttribute('autocomplete', 'username')
  await expect(page.getByLabel(/^Mật khẩu/)).toHaveAttribute('autocomplete', 'current-password')
})

test('TC04: required fields reject empty and whitespace-only values and focus the first error', async ({ page }) => {
  await page.goto('/staff/login')
  const username = page.getByLabel('Tài khoản')
  const password = page.getByLabel(/^Mật khẩu/)
  const submit = page.getByRole('button', { name: 'Đăng nhập', exact: true })
  await submit.click()
  await expect(username).toBeFocused()
  await expect(username).toHaveAttribute('aria-invalid', 'true')
  await expect(password).toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByText('Vui lòng nhập tên đăng nhập hoặc email.')).toBeVisible()
  await expect(page.getByText('Vui lòng nhập mật khẩu.', { exact: true })).toBeVisible()
  await username.fill('   ')
  await password.fill('   ')
  await submit.click()
  await expect(username).toHaveAttribute('aria-invalid', 'true')
  await expect(password).toHaveAttribute('aria-invalid', 'true')
  await username.fill('ui-check-' + randomUUID())
  await submit.click()
  await expect(password).toBeFocused()
  await expect(username).toHaveAttribute('aria-invalid', 'false')
})

test('TC05: password visibility toggle does not submit the form', async ({ page }) => {
  await page.goto('/staff/login')
  const password = page.getByLabel(/^Mật khẩu/)
  await expect(page.getByRole('button', { name: 'Hiện mật khẩu' })).toBeDisabled()
  await password.fill(randomUUID())
  await page.getByRole('button', { name: 'Hiện mật khẩu' }).click()
  await expect(password).toHaveAttribute('type', 'text')
  await expect(page.getByRole('button', { name: 'Ẩn mật khẩu' })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Ẩn mật khẩu' }).click()
  await expect(password).toHaveAttribute('type', 'password')
  await expect(page.getByRole('status')).toBeEmpty()
})

test('TC06/TC07: submit creates no request, storage, cookie, session or role navigation', async ({ page, context }) => {
  await page.goto('/staff/login?role=doctor&redirect=/doctor')
  const storageBefore = await context.storageState()
  const sessionBefore = await page.evaluate(() => ({ ...sessionStorage }))
  const requests = []
  page.on('request', request => {
    if (['fetch', 'xhr'].includes(request.resourceType()) || request.method() !== 'GET') requests.push(request.url())
  })
  await page.getByLabel('Tài khoản').fill('ui-check-' + randomUUID())
  await page.getByLabel(/^Mật khẩu/).fill(randomUUID())
  await page.getByRole('button', { name: 'Hiện mật khẩu' }).click()
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Chưa có phiên đăng nhập nào được tạo.')
  await expect(page).toHaveURL(/\/staff\/login\?role=doctor&redirect=\/doctor$/)
  await expect(page.getByLabel(/^Mật khẩu/)).toHaveValue('')
  await expect(page.getByLabel(/^Mật khẩu/)).toHaveAttribute('type', 'password')
  expect(await context.storageState()).toEqual(storageBefore)
  expect(await page.evaluate(() => ({ ...sessionStorage }))).toEqual(sessionBefore)
  expect(requests).toEqual([])
  await expect(page.getByRole('combobox')).toHaveCount(0)
  await expect(page.getByRole('radio')).toHaveCount(0)
  await expect(page.getByRole('button', { name: /Bác sĩ|Lễ tân|Đăng ký/ })).toHaveCount(0)
  await expect(page.locator(internalLinks)).toHaveCount(0)
})

for (const [role, label, ownMenu, otherMenu] of [
  ['receptionist', 'Lễ tân', 'Tiếp nhận & Cấp số', 'Buồng khám lâm sàng'],
  ['doctor', 'Bác sĩ', 'Buồng khám lâm sàng', 'Tiếp nhận & Cấp số'],
]) {
  test('TC08/TC09: ' + role + ' preview is isolated and unavailable in production', async ({ page, isMobile }, testInfo) => {
    await page.goto('/' + role)
    if (testInfo.project.name.startsWith('production')) {
      await expect(page).toHaveURL(/\/staff\/login$/)
      await checkLogin(page)
      await expect(page.locator('#staff-navigation')).toHaveCount(0)
      return
    }
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Phân hệ ' + label)
    await expect(page.getByText('PREVIEW ONLY · Chỉ xem trước trong development')).toBeVisible()
    await expect(page.getByText('Chưa đăng nhập', { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Đăng xuất', exact: true })).toBeDisabled()
    await expect(page.getByRole('navigation', { name: 'Điều hướng chính' })).toHaveCount(0)
    await expect(page.locator('a[href="/doctor"], a[href="/receptionist"]')).toHaveCount(0)
    if (isMobile) await page.getByRole('button', { name: 'Mở danh mục thanh bên' }).click()
    const nav = page.getByRole('navigation', { name: 'Danh mục chức năng' })
    await expect(nav.getByRole('button', { name: ownMenu, exact: true })).toBeVisible()
    await expect(nav.getByRole('button', { name: otherMenu, exact: true })).toHaveCount(0)
    await nav.getByRole('button', { name: ownMenu, exact: true }).click()
    await expect(page.getByRole('heading', { level: 1 })).toContainText(ownMenu)
    if (isMobile) {
      const opener = page.getByRole('button', { name: 'Mở danh mục thanh bên' })
      await expect(opener).toBeFocused()
      await expect(opener).toHaveAttribute('aria-expanded', 'false')
      await opener.click()
      await page.keyboard.press('Shift+Tab')
      await expect(page.getByRole('link', { name: 'Về trang đăng nhập nhân viên' })).toBeFocused()
      await page.keyboard.press('Tab')
      await expect(page.getByRole('button', { name: 'Đóng thanh điều hướng', exact: true })).toBeFocused()
      await page.keyboard.press('Escape')
      await expect(opener).toBeFocused()
      await opener.click()
    }
    await page.getByRole('link', { name: 'Về trang đăng nhập nhân viên' }).click()
    await checkLogin(page)
  })
}

test('TC10: all routes fit 320, 390, 768 and 1440 pixel viewports', async ({ page }, testInfo) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const path of ['/', '/booking-notice', '/staff/login', '/receptionist', '/doctor', '/not-a-route']) {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), width + 'px ' + path).toBe(true)
      const table = page.locator('table').first()
      if (width < 768 && await table.count()) {
        expect(await table.evaluate(element => {
          const container = element.parentElement
          container.scrollLeft = container.scrollWidth
          return container.scrollLeft > 0
        }), 'The table scrolls inside its container').toBe(true)
      }
    }
  }
  await page.setViewportSize(testInfo.project.use.viewport)
  for (const [name, path] of [['public', '/'], ['login', '/staff/login'], ['receptionist', '/receptionist'], ['doctor', '/doctor']]) {
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.screenshot({ path: testInfo.outputPath(name + '.png'), fullPage: true })
  }
})

test('TC13: React Router booking, cross-page anchors, history and 404 work', async ({ page, isMobile }) => {
  await page.goto('/')
  await page.evaluate(() => { window.__t2NavigationMarker = true })
  await page.getByRole('link', { name: 'Đặt lịch khám', exact: true }).first().click()
  await expect(page).toHaveURL(/\/booking-notice$/)
  await expect(page.getByText('Tính năng đặt lịch đang được phát triển.')).toBeVisible()
  if (isMobile) await page.getByRole('button', { name: 'Mở menu điều hướng' }).click()
  const nav = page.getByRole('navigation', { name: isMobile ? 'Điều hướng trên điện thoại' : 'Điều hướng chính', exact: true })
  await nav.getByRole('link', { name: 'Dịch vụ', exact: true }).click()
  await expect(page).toHaveURL(/\/#services$/)
  await expect(page.getByRole('heading', { name: 'Danh mục chuyên khoa dự kiến' })).toBeInViewport()
  expect(await page.evaluate(() => window.__t2NavigationMarker)).toBe(true)
  await page.goBack()
  await expect(page.getByRole('heading', { name: 'Đặt lịch khám trực tuyến', exact: true })).toBeVisible()
  await page.goto('/unknown')
  await expect(page.getByRole('heading', { name: 'Đường dẫn không tồn tại' })).toBeVisible()
  await page.getByRole('link', { name: 'Trở về Trang chủ Clinic Management' }).click()
  await expect(page).toHaveURL(/\/$/)
})
