/* blocks/nav/nav.css */

.nav {
  background: var(--color-background-primary);
  border-bottom: 1px solid var(--color-border-tertiary);
  height: 52px;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.nav-inner {
  max-width: 1280px;
  margin: 0 auto;
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.nav-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 15px;
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  white-space: nowrap;
}
.adobe-icon {
  width: 28px;
  height: 28px;
  background: var(--red);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Nav links */
.nav-left {
  display: flex;
  align-items: center;
  gap: 24px;
}
.nav-links {
  display: flex;
  gap: 4px;
  list-style: none;
}
.nav-links a {
  display: block;
  font-size: 13px;
  font-weight: 400;
  color: var(--color-text-secondary);
  padding: 5px 8px;
  border-radius: var(--border-radius-sm);
  transition: color .15s, background .15s;
}
.nav-links a:hover {
  color: var(--color-text-primary);
  background: var(--color-background-secondary);
}
.nav-links a.active {
  color: var(--red);
  font-weight: 500;
}

/* Right side */
.nav-right {
  display: flex;
  align-items: center;
  gap: 4px;
}
.nav-icon-btn {
  width: 34px;
  height: 34px;
  border: none;
  background: transparent;
  border-radius: var(--border-radius-md);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background .15s, color .15s;
}
.nav-icon-btn:hover {
  background: var(--color-background-secondary);
  color: var(--color-text-primary);
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--red);
  border: none;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 4px;
  transition: opacity .15s;
}
.avatar:hover { opacity: .85; }
