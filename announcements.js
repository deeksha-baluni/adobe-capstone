/* blocks/merch-strip/merch-strip.css */

.merch-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  list-style: none;
}

.merch-card {
  background: var(--color-background-primary);
  border: 1px solid var(--color-border-tertiary);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  transition: box-shadow .2s, transform .2s;
  cursor: pointer;
}
.merch-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.merch-img {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.merch-body {
  padding: 10px 14px 14px;
}
.merch-name {
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 2px;
}
.merch-sub {
  font-size: 11px;
  color: var(--color-text-secondary);
}
.merch-price {
  font-size: 14px;
  font-weight: 500;
  color: var(--red);
  margin-top: 6px;
  font-family: var(--font-mono);
}

@media (max-width: 900px) {
  .merch-strip { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 520px) {
  .merch-strip { grid-template-columns: repeat(2, 1fr); }
}
