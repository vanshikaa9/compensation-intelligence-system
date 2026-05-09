'use client'

import { useState, useMemo, useEffect } from 'react'
import { SalaryEntry, formatINR, formatCompany } from '@/lib/data'
// ─── Store ───────────────────────────────────────────────────────────────────

function useStore() {
  const [records, setRecords] = useState<SalaryEntry[]>([])

  useEffect(() => {
  async function loadSalaries() {
    try {
      const res = await fetch('/api/salaries')
      const data = await res.json()
      setRecords(data)
    } catch (error) {
      console.error('Failed to load salaries', error)
    }
  }

  loadSalaries()
}, [])

return { records }
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav({ page, setPage, count }: { page: string, setPage: (p: string) => void, count: number }) {
  const links = [['home', 'Home'], ['salaries', 'Salaries'], ['company', 'Companies'], ['compare', 'Compare'], ['submit', 'Submit']]
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => setPage('home')}>comp<span>intel</span>.in</div>
      <div style={{ display: 'flex', gap: 0 }}>
        {links.map(([id, label]) => (
          <a key={id} className={`nav-link${page === id ? ' active' : ''}`} onClick={() => setPage(id)}>{label}</a>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <div className="nav-badge">{count} entries</div>
    </nav>
  )
}

// ─── Home ─────────────────────────────────────────────────────────────────────

function HomePage({ records, setPage }: { records: SalaryEntry[], setPage: (p: string) => void }) {
  const companies = new Set(records.map(r => r.company)).size
  const sorted = [...records].sort((a, b) => a.total_compensation - b.total_compensation)
  const median = sorted[Math.floor(sorted.length / 2)]?.total_compensation

  return (
    <div>
      <div className="hero">
        <div className="hero-tag">India → Global · Level-standardized</div>
        <div className="hero-title">Compensation is tied to <em>levels</em>,<br />not titles</div>
        <div className="hero-sub">
          L5 at Google ≠ SDE2 at Amazon. CompIntel standardizes across companies so your decisions are actually comparable.
        </div>
        <div className="hero-stats">
          <div><div className="hero-stat-val">{records.length}</div><div className="hero-stat-label">Salary entries</div></div>
          <div><div className="hero-stat-val">{companies}</div><div className="hero-stat-label">Companies</div></div>
          <div><div className="hero-stat-val">{formatINR(median)}</div><div className="hero-stat-label">Median TC</div></div>
        </div>
      </div>
      <div className="page">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            ['▤', 'Browse Salaries', 'Filter by company, role, level, location', 'salaries'],
            ['⇔', 'Compare', 'Side-by-side TC breakdown with AI insight', 'compare'],
            ['◈', 'Company Insights', 'Median TC and level distribution', 'company'],
            ['+', 'Submit a Salary', 'Add your compensation anonymously', 'submit'],
          ].map(([icon, label, desc, action]) => (
            <div key={action} className="card" style={{ cursor: 'pointer', transition: 'border-color 0.15s' }}
              onClick={() => setPage(action)}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#2563eb'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(26,26,46,0.1)'}
            >
              <div style={{ fontFamily: 'var(--mono)', fontSize: '1.3rem', color: '#2563eb', marginBottom: '0.6rem' }}>{icon}</div>
              <div style={{ fontWeight: 600, marginBottom: '0.3rem', fontSize: '13px' }}>{label}</div>
              <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
        <div className="section-title">Why levels matter</div>
        <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.25rem' }}>
          {[
            ['Same title, different pay', '"Senior Engineer" can mean L5 at Google (₹60L+ TC) or SDE3 at Swiggy (₹28L TC). Titles without levels are meaningless.'],
            ['Level standardization', 'CompIntel maps each company\'s ladder so L5, SDE3, E5, and P5 are actually comparable across orgs.'],
            ['Decision-ready data', 'Every entry shows base + bonus + stock broken out. No more guessing what ₹X CTC means in hand.'],
          ].map(([title, body]) => (
            <div key={title}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#2563eb', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{title}</div>
              <div style={{ fontSize: '12px', color: '#374151', lineHeight: 1.6 }}>{body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Salary Table ─────────────────────────────────────────────────────────────

function SalaryTable({ records, compareIds, onSelect }: { records: SalaryEntry[], compareIds: number[], onSelect: (id: number) => void }) {
  const [q, setQ] = useState('')
  const [fc, setFc] = useState(''); const [fr, setFr] = useState(''); const [fl, setFl] = useState(''); const [floc, setFloc] = useState('')
  const [sk, setSk] = useState('total_compensation'); const [sd, setSd] = useState<'asc' | 'desc'>('desc')
const companies = useMemo(() => Array.from(new Set(records.map(r => r.company))).sort(), [records])

const roles = useMemo(() => Array.from(new Set(records.map(r => r.role))).sort(), [records])

const levels = useMemo(() => Array.from(new Set(records.map(r => r.level))).sort(), [records])

const locs = useMemo(() => Array.from(new Set(records.map(r => r.location))).sort(), [records])

  const filtered = useMemo(() => {
    let out = records
    if (fc) out = out.filter(r => r.company === fc)
    if (fr) out = out.filter(r => r.role === fr)
    if (fl) out = out.filter(r => r.level === fl)
    if (floc) out = out.filter(r => r.location === floc)
    if (q.trim()) { const qq = q.toLowerCase(); out = out.filter(r => r.company.includes(qq) || r.role.toLowerCase().includes(qq) || r.level.toLowerCase().includes(qq) || r.location.toLowerCase().includes(qq)) }
    return [...out].sort((a, b) => {
      const av = (a as any)[sk], bv = (b as any)[sk]
      return typeof av === 'number' ? (sd === 'asc' ? av - bv : bv - av) : (sd === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av)))
    })
  }, [records, fc, fr, fl, floc, q, sk, sd])

  const ts = (key: string) => { if (sk === key) setSd(d => d === 'asc' ? 'desc' : 'asc'); else { setSk(key); setSd('desc') } }
  const col = (label: string, key: string) => (
    <th onClick={() => ts(key)}>{label}{sk === key ? <span style={{ fontSize: 9, marginLeft: 3, color: '#2563eb' }}>{sd === 'asc' ? '↑' : '↓'}</span> : ''}</th>
  )

  return (
    <div className="page">
      <div className="section-title">Salary table</div>
      <div className="search-bar">
        <input className="search-input" placeholder="Search…" value={q} onChange={e => setQ(e.target.value)} />
        <select className="sel" value={fc} onChange={e => setFc(e.target.value)}>
          <option value="">All companies</option>
          {companies.map(c => <option key={c} value={c}>{formatCompany(c)}</option>)}
        </select>
        <select className="sel" value={fr} onChange={e => setFr(e.target.value)}>
          <option value="">All roles</option>
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select className="sel" value={fl} onChange={e => setFl(e.target.value)}>
          <option value="">All levels</option>
          {levels.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select className="sel" value={floc} onChange={e => setFloc(e.target.value)}>
          <option value="">All locations</option>
          {locs.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        {(fc || fr || fl || floc || q) && <button className="btn" onClick={() => { setFc(''); setFr(''); setFl(''); setFloc(''); setQ('') }}>Clear</button>}
      </div>
      <div style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'var(--mono)', marginBottom: '0.5rem' }}>
        {filtered.length} of {records.length} entries · Check 2 rows to compare
      </div>
      <div className="table-wrap">
        {filtered.length === 0
          ? <div className="empty-state"><div style={{ fontSize: '1.5rem', marginBottom: '0.5rem', opacity: 0.3 }}>◈</div>No results</div>
          : <table className="data-table">
            <thead><tr>
              <th style={{ width: 32 }}></th>
              {col('Company', 'company')}{col('Role', 'role')}{col('Level', 'level')}{col('Location', 'location')}
              {col('Exp', 'experience_years')}{col('Base', 'base_salary')}{col('Bonus', 'bonus')}{col('Stock', 'stock')}{col('Total TC', 'total_compensation')}
            </tr></thead>
            <tbody>
              {filtered.map(r => {
                const sel = compareIds.includes(r.id)
                const can = compareIds.length < 2 || sel
                return (
                  <tr key={r.id} className={sel ? 'sel-row' : ''}>
                    <td>
                      <div className={`chk${sel ? ' on' : ''}`} style={{ opacity: can ? 1 : 0.3, cursor: can ? 'pointer' : 'default' }} onClick={() => can && onSelect(r.id)}>
                        {sel ? '✓' : ''}
                      </div>
                    </td>
                    <td><span className="badge badge-co">{formatCompany(r.company)}</span></td>
                    <td style={{ color: '#374151' }}>{r.role}</td>
                    <td><span className="badge badge-level">{r.level}</span></td>
                    <td><span className="badge badge-loc">{r.location}</span></td>
                    <td style={{ fontFamily: 'var(--mono)', color: '#9ca3af' }}>{r.experience_years}y</td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '11px' }}>{formatINR(r.base_salary)}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#9ca3af' }}>{r.bonus ? formatINR(r.bonus) : '—'}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#9ca3af' }}>{r.stock ? formatINR(r.stock) : '—'}</td>
                    <td><span style={{ fontFamily: 'var(--mono)', fontWeight: 500, fontSize: '12px' }}>{formatINR(r.total_compensation)}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        }
      </div>
    </div>
  )
}

// ─── Company ──────────────────────────────────────────────────────────────────

function CompanyPage({ records }: { records: SalaryEntry[] }) {
 const companies = useMemo(() => Array.from(new Set(records.map(r => r.company))).sort(), [records])
  const [sel, setSel] = useState('')
  useEffect(() => { if (companies.length && !sel) setSel(companies[0]) }, [companies])

  const cr = useMemo(() => records.filter(r => r.company === sel), [records, sel])
  const tc = cr.map(r => r.total_compensation).sort((a, b) => a - b)
  const med = tc[Math.floor(tc.length / 2)] || 0
  const avg = tc.length ? Math.round(tc.reduce((a, b) => a + b, 0) / tc.length) : 0
  const mx = tc[tc.length - 1] || 0

  const lvls = useMemo(() => {
    const c = cr.reduce((a, r) => { a[r.level] = (a[r.level] || 0) + 1; return a }, {} as Record<string, number>)
    const t = cr.length
    return Object.entries(c).sort((a, b) => b[1] - a[1]).map(([l, n]) => ({ l, n, p: t ? Math.round(n / t * 100) : 0 }))
  }, [cr])

  const rolesDist = useMemo(() => {
    const c = cr.reduce((a, r) => { a[r.role] = (a[r.role] || 0) + 1; return a }, {} as Record<string, number>)
    return Object.entries(c).sort((a, b) => b[1] - a[1])
  }, [cr])

  return (
    <div className="page">
      <div className="section-title">Company insights</div>
      <div className="search-bar" style={{ marginBottom: '1.25rem' }}>
        <select className="sel" value={sel} onChange={e => setSel(e.target.value)} style={{ minWidth: 180 }}>
          {companies.map(c => <option key={c} value={c}>{formatCompany(c)}</option>)}
        </select>
        <span style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'var(--mono)', alignSelf: 'center' }}>{cr.length} entries</span>
      </div>
      {cr.length === 0
        ? <div className="empty-state">No data</div>
        : <>
          <div className="metric-grid">
            {[['Median TC', formatINR(med)], ['Average TC', formatINR(avg)], ['Max TC', formatINR(mx)], ['Entries', String(cr.length)]].map(([l, v]) => (
              <div key={l} className="metric-card"><div className="metric-val">{v}</div><div className="metric-label">{l}</div></div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div className="card">
              <div className="section-title">Level distribution</div>
              {lvls.map(({ l, n, p }) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <span style={{ width: 44, fontFamily: 'var(--mono)', fontSize: '11px', color: '#2563eb' }}>{l}</span>
                  <div className="dist-bg"><div className="dist-fill" style={{ width: `${p}%` }} /></div>
                  <span style={{ width: 24, fontFamily: 'var(--mono)', fontSize: '10px', color: '#9ca3af', textAlign: 'right' }}>{n}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="section-title">Roles</div>
              {rolesDist.map(([r, n]) => (
                <div key={r} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '12px' }}>
                  <span style={{ color: '#374151' }}>{r}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', background: 'rgba(26,26,46,0.05)', borderRadius: 3, padding: '2px 7px' }}>{n}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Role</th><th>Level</th><th>Location</th><th>Exp</th><th>Base</th><th>Bonus</th><th>Stock</th><th>Total TC</th></tr></thead>
              <tbody>
                {[...cr].sort((a, b) => b.total_compensation - a.total_compensation).map(r => (
                  <tr key={r.id}>
                    <td>{r.role}</td>
                    <td><span className="badge badge-level">{r.level}</span></td>
                    <td><span className="badge badge-loc">{r.location}</span></td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#9ca3af' }}>{r.experience_years}y</td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '11px' }}>{formatINR(r.base_salary)}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#9ca3af' }}>{r.bonus ? formatINR(r.bonus) : '—'}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#9ca3af' }}>{r.stock ? formatINR(r.stock) : '—'}</td>
                    <td><span style={{ fontFamily: 'var(--mono)', fontWeight: 500 }}>{formatINR(r.total_compensation)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      }
    </div>
  )
}

// ─── Compare ──────────────────────────────────────────────────────────────────

function ComparePage({ records, compareIds, setCompareIds, setPage }: { records: SalaryEntry[], compareIds: number[], setCompareIds: (ids: number[]) => void, setPage: (p: string) => void }) {
  const [ai, setAi] = useState(''); const [aiLoad, setAiLoad] = useState(false)
  const entries = compareIds.map(id => records.find(r => r.id === id)).filter(Boolean) as SalaryEntry[]

  const getAi = async () => {
    if (entries.length < 2) return
    setAiLoad(true); setAi('')
    try {
      const res = await fetch('/api/insight', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ entryA: entries[0], entryB: entries[1] }) })
      const data = await res.json()
      setAi(data.insight || data.error || 'Could not generate insight.')
    } catch { setAi('Could not load AI insight at this time.') }
    setAiLoad(false)
  }

  if (entries.length < 2) {
    return (
      <div className="page">
        <div className="section-title">Compare salaries</div>
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem', maxWidth: 480 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '1.8rem', color: 'rgba(26,26,46,0.12)', marginBottom: '0.75rem' }}>⇔</div>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '0.4rem' }}>Select 2 entries to compare</div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '1.25rem' }}>
            Go to the Salary Table, check 2 rows, then return here.
            {compareIds.length === 1 && <span style={{ color: '#2563eb', display: 'block', marginTop: '0.4rem' }}>1 selected — pick one more</span>}
          </div>
          <button className="btn btn-primary" onClick={() => setPage('salaries')}>Go to Salary Table</button>
        </div>
      </div>
    )
  }

  const [a, b] = entries
  const fields = [
    { label: 'Company', key: 'company', fmt: (v: any) => formatCompany(v) },
    { label: 'Role', key: 'role', fmt: (v: any) => v },
    { label: 'Level', key: 'level', fmt: (v: any) => v },
    { label: 'Location', key: 'location', fmt: (v: any) => v },
    { label: 'Experience', key: 'experience_years', fmt: (v: any) => `${v} years` },
    { label: 'Base salary', key: 'base_salary', fmt: formatINR, num: true },
    { label: 'Bonus', key: 'bonus', fmt: (v: any) => v ? formatINR(v) : '—', num: true },
    { label: 'Stock / RSU', key: 'stock', fmt: (v: any) => v ? formatINR(v) : '—', num: true },
    { label: 'Total TC', key: 'total_compensation', fmt: formatINR, num: true, hi: true },
  ]
  const diff = a.total_compensation - b.total_compensation
  const diffPct = b.total_compensation ? Math.abs(Math.round(diff / b.total_compensation * 100)) : 0

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div className="section-title" style={{ margin: 0 }}>Comparison</div>
        <button className="btn btn-sm" onClick={() => setCompareIds([])}>Clear</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.75rem', alignItems: 'start' }}>
        {[a, b].map((entry, idx) => (
          <div key={entry.id} className="compare-card">
            <div className="compare-header">
              <div style={{ fontSize: '10px', color: '#64748b' }}>Entry {idx === 0 ? 'A' : 'B'}</div>
              <div className="compare-company">{formatCompany(entry.company)}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: 2 }}>{entry.role} · {entry.level}</div>
            </div>
            {fields.map(f => {
              const val = f.fmt((entry as any)[f.key])
              let cls = 'compare-val'
              if (f.hi && f.num) {
                if (idx === 0 && a[f.key as keyof SalaryEntry] > b[f.key as keyof SalaryEntry]) cls += ' higher'
                if (idx === 0 && a[f.key as keyof SalaryEntry] < b[f.key as keyof SalaryEntry]) cls += ' lower'
                if (idx === 1 && b[f.key as keyof SalaryEntry] > a[f.key as keyof SalaryEntry]) cls += ' higher'
                if (idx === 1 && b[f.key as keyof SalaryEntry] < a[f.key as keyof SalaryEntry]) cls += ' lower'
              }
              return (
                <div key={f.key} className="compare-row">
                  <span className="compare-label">{f.label}</span>
                  <span className={cls}>{val}</span>
                </div>
              )
            })}
          </div>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '5rem' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'rgba(26,26,46,0.35)', marginBottom: 4 }}>TC diff</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '1rem', fontWeight: 500, color: diff > 0 ? '#059669' : diff < 0 ? '#dc2626' : '#6b7280' }}>
            {diff > 0 ? '+' : ''}{formatINR(Math.abs(diff))}
          </div>
          {diffPct > 0 && <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#9ca3af' }}>{diffPct}%</div>}
        </div>
      </div>
      <div style={{ marginTop: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#2563eb', letterSpacing: '1px', textTransform: 'uppercase' }}>AI Intelligence</div>
          <button className="btn btn-sm btn-primary" onClick={getAi} disabled={aiLoad}>{aiLoad ? 'Analyzing…' : 'Get AI insight'}</button>
        </div>
        {aiLoad && (
          <div className="ai-panel">
            <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="dot">●</span><span className="dot">●</span><span className="dot">●</span>
              <span style={{ marginLeft: 6 }}>Analyzing…</span>
            </span>
          </div>
        )}
        {ai && !aiLoad && <div className="ai-panel">{ai}</div>}
        {!ai && !aiLoad && <div style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'var(--mono)' }}>Click "Get AI insight" for a structured analysis.</div>}
      </div>
    </div>
  )
}

// ─── Submit ───────────────────────────────────────────────────────────────────

function SubmitPage() {
  const empty = { company: '', role: '', level: '', location: 'Bangalore', experience_years: '', base_salary: '', bonus: '', stock: '' }
  const [f, setF] = useState<Record<string, string>>(empty)
  const [errs, setErrs] = useState<string[]>([])
  const [ok, setOk] = useState<SalaryEntry | null>(null)

  const upd = (k: string, v: string) => { setF(p => ({ ...p, [k]: v })); setErrs([]); setOk(null) }
  const field = (key: string, label: string, ph: string, type = 'text') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className="form-input" type={type} placeholder={ph} value={f[key]} onChange={e => upd(key, e.target.value)} />
    </div>
  )

  const handle = async () => {
  setErrs([])
  setOk(null)

  try {
    const res = await fetch('/api/ingest-salary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(f),
    })

    const data = await res.json()

    if (!res.ok) {
      setErrs([data.error || 'Something went wrong'])
      return
    }

    setOk(data)

    setF(empty)

    window.location.reload()
  } catch (error) {
    setErrs(['Failed to submit salary'])
  }
}

  const previewTC = (Number(f.base_salary) || 0) + (Number(f.bonus) || 0) + (Number(f.stock) || 0)

  return (
    <div className="page">
      <div className="section-title">Submit a salary</div>
      <div className="card" style={{ maxWidth: 560 }}>
        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '1.25rem', lineHeight: 1.6 }}>
          Submissions are anonymous. Bonus and stock default to 0 if blank. Duplicates are auto-rejected.
        </div>
        <div className="form-grid">
          {field('company', 'Company *', 'e.g. Google')}
          {field('role', 'Role *', 'e.g. Software Engineer')}
          {field('level', 'Level *', 'e.g. L5, SDE3, E5')}
          {field('location', 'Location', 'e.g. Bangalore')}
          {field('experience_years', 'Years of experience', 'e.g. 5', 'number')}
          {field('base_salary', 'Base salary ₹/yr *', 'e.g. 4200000', 'number')}
          {field('bonus', 'Annual bonus ₹', 'e.g. 800000', 'number')}
          {field('stock', 'Stock / RSU ₹/yr', 'e.g. 2000000', 'number')}
        </div>
        {f.base_salary && (
          <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', background: 'rgba(37,99,235,0.05)', borderRadius: 4, borderLeft: '3px solid #2563eb' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#9ca3af', marginBottom: 3 }}>Computed Total TC</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '1rem', fontWeight: 500, color: '#2563eb' }}>{formatINR(previewTC)}</div>
          </div>
        )}
        {errs.length > 0 && <div className="error-msg">{errs.map((e, i) => <div key={i}>· {e}</div>)}</div>}
        {ok && <div className="success-msg">Added: {formatCompany(ok.company)} · {ok.role} · {ok.level} · {formatINR(ok.total_compensation)} TC</div>}
        <div style={{ marginTop: '1rem' }}>
          <button className="btn btn-primary" onClick={handle}>Submit salary</button>
        </div>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState('home')
  const [compareIds, setCompareIds] = useState<number[]>([])
 const { records } = useStore()

  const onSelect = (id: number) => setCompareIds(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : prev.length >= 2 ? prev : [...prev, id]
  )

  return (
    <>
      <Nav page={page} setPage={setPage} count={records.length} />
      {page === 'home' && <HomePage records={records} setPage={setPage} />}
      {page === 'salaries' && <SalaryTable records={records} compareIds={compareIds} onSelect={onSelect} />}
      {page === 'company' && <CompanyPage records={records} />}
      {page === 'compare' && <ComparePage records={records} compareIds={compareIds} setCompareIds={setCompareIds} setPage={setPage} />}
      {page === 'submit' && <SubmitPage/>}
    </>
  )
}
