import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  blue: "#2563EB", blueHover: "#1D4ED8", blueBg: "rgba(37,99,235,0.08)", blueLight: "rgba(37,99,235,0.12)",
  dark: "#0F172A", white: "#F1F5F9", pure: "#FFFFFF", grey: "#64748B", slate: "#CBD5E1",
  green: "#10B981", yellow: "#F59E0B", red: "#EF4444",
  glass: "rgba(255,255,255,0.72)", glassBorder: "rgba(255,255,255,0.3)", shadow: "0 8px 32px rgba(15,23,42,0.08)",
};

const REQUESTS = [
  { id: 1, need: "Need help with supply/demand curves for ECON 2105 midterm", subject: "ECON 2105", time: "Right Now", format: "chat", tags: ["Academic", "Study Buddy"], user: "Marcus T.", rating: 94, sessions: 12 },
  { id: 2, need: "Can someone review my resume before Terry career fair?", subject: "Career Prep", time: "Tomorrow 2PM", format: "call", tags: ["Career"], user: "Priya K.", rating: 97, sessions: 8 },
  { id: 3, need: "Struggling with Python loops in CSCI 1301", subject: "CSCI 1301", time: "Right Now", format: "in-person", tags: ["Academic"], user: "Jordan L.", rating: 88, sessions: 5 },
  { id: 4, need: "Looking for study group for BIOL 1107 final", subject: "BIOL 1107", time: "This Week", format: "in-person", tags: ["Academic", "Study Buddy"], user: "Aisha M.", rating: 91, sessions: 15 },
];

const HELPER = { name: "Alex Chen", major: "Computer Science", year: "Junior", subjects: ["ECON 2105", "MATH 2250", "Statistics"], rating: 96, sessions: 23 };

const RESPONSES = [
  "Hey! I just took that exam last semester, I can definitely help.",
  "The trick with supply/demand curves is to always start with equilibrium first.",
  "Do you have your notes from lecture? I can walk through the graphs with you.",
  "Yeah that part is tricky — think of it as price being the dependent variable.",
  "Want me to send you the practice problems I used? They're really similar to the exam.",
  "No problem! Let me know if you need help with elasticity too.",
];

const SKILLS = ["Accounting", "Biology", "Chemistry", "Computer Science", "Economics", "English", "Marketing", "Math", "Physics", "Psychology", "Resume Review", "Interview Prep", "Career Advice", "Study Skills"];

const font = "'SF Pro Display', 'SF Pro Text', -apple-system, system-ui, sans-serif";
const fontB = "'SF Pro Display', -apple-system, system-ui, sans-serif";

const Glass = ({ children, style, onClick, active }) => (
  <div onClick={onClick} style={{ background: active ? C.blueLight : C.glass, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: `1px solid ${active ? C.blue : C.glassBorder}`, borderRadius: 16, padding: 16, boxShadow: C.shadow, cursor: onClick ? "pointer" : "default", transition: "all 0.2s", ...style }}>{children}</div>
);

const Btn = ({ children, onClick, v = "primary", disabled, style }) => {
  const s = { primary: { background: C.blue, color: "#fff", border: "none" }, secondary: { background: "transparent", color: C.blue, border: `1.5px solid ${C.blue}` }, ghost: { background: "transparent", color: C.blue, border: "none", padding: "8px 0" } };
  return <button onClick={onClick} disabled={disabled} style={{ ...s[v], fontFamily: fontB, fontSize: 16, fontWeight: 600, borderRadius: 24, padding: "14px 24px", width: "100%", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, transition: "all 0.2s", ...style }}>{children}</button>;
};

const Tag = ({ label, on, onClick }) => (
  <span onClick={onClick} style={{ display: "inline-block", padding: "6px 14px", borderRadius: 100, fontSize: 13, fontFamily: font, fontWeight: 500, background: on ? C.blue : C.blueBg, color: on ? "#fff" : C.blue, cursor: onClick ? "pointer" : "default", transition: "all 0.15s", userSelect: "none" }}>{label}</span>
);

const Bdg = ({ text, color = C.green }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600, background: `${color}18`, color, fontFamily: font }}>● {text}</span>
);

const Inp = ({ label, value, onChange, placeholder, suffix, multi }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: font }}>{label}</label>}
    {multi ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ fontFamily: font, fontSize: 15, padding: 12, borderRadius: 12, border: `1.5px solid ${C.slate}`, background: C.pure, outline: "none", resize: "vertical", minHeight: 80 }} />
    ) : (
      <div style={{ display: "flex", alignItems: "center", border: `1.5px solid ${C.slate}`, borderRadius: 12, background: C.pure, overflow: "hidden" }}>
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ flex: 1, fontFamily: font, fontSize: 15, padding: 12, border: "none", outline: "none", background: "transparent" }} />
        {suffix && <span style={{ padding: "0 12px", color: C.grey, fontSize: 14, fontWeight: 500 }}>{suffix}</span>}
      </div>
    )}
  </div>
);

const Bar = () => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 20px 4px", fontSize: 14, fontWeight: 600, fontFamily: font, position: "relative" }}>
    <span>9:41</span>
    <div style={{ width: 126, height: 34, background: "#000", borderRadius: 20, position: "absolute", left: "50%", transform: "translateX(-50%)", top: 3 }} />
    <span style={{ fontSize: 13 }}>
      <span style={{ letterSpacing: -1 }}>●●●●</span> 📶 🔋
    </span>
  </div>
);

const Prog = ({ step, total }) => (
  <div style={{ display: "flex", gap: 4, padding: "0 20px" }}>
    {Array.from({ length: total }, (_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < step ? C.blue : C.slate, transition: "background 0.3s" }} />)}
  </div>
);

const Nav = ({ active, go }) => (
  <div style={{ display: "flex", justifyContent: "space-around", padding: "10px 0 28px", background: C.glass, backdropFilter: "blur(20px)", borderTop: `1px solid ${C.glassBorder}`, position: "absolute", bottom: 0, left: 0, right: 0 }}>
    {[["home", "🏠", "Home"], ["explore", "🧭", "Explore"], ["messages", "💬", "Messages"], ["profile", "👤", "Profile"]].map(([id, ic, lb]) => (
      <div key={id} onClick={() => go(id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer", opacity: active === id ? 1 : 0.45, transition: "opacity 0.2s" }}>
        <span style={{ fontSize: 20 }}>{ic}</span>
        <span style={{ fontSize: 10, fontWeight: 600, color: active === id ? C.blue : C.grey, fontFamily: font }}>{lb}</span>
      </div>
    ))}
  </div>
);

const Phone = ({ children }) => (
  <div style={{ width: 393, minHeight: 852, maxHeight: 852, background: C.white, borderRadius: 48, overflow: "hidden", position: "relative", boxShadow: "0 24px 80px rgba(15,23,42,0.18), 0 0 0 1px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" }}>
    <Bar />
    <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>{children}</div>
  </div>
);

// === SCREENS ===

const Welcome = ({ next }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24, justifyContent: "center", gap: 32 }}>
    <div>
      <div style={{ width: 48, height: 48, background: C.blue, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 20, fontFamily: fontB }}>N</div>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: C.dark, lineHeight: 1.15, margin: 0, fontFamily: fontB }}>Every user here is a <span style={{ color: C.blue }}>verified UGA student.</span></h1>
      <p style={{ fontSize: 16, color: C.grey, lineHeight: 1.5, marginTop: 12, fontFamily: font }}>Find the right person for the help you need — and know everyone here actually goes to your school.</p>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {[["✅", "Verified UGA enrollment"], ["🤝", "Real students helping students"], ["⚡", "Smart matching for what you need"]].map(([ic, t], i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 18 }}>{ic}</span><span style={{ fontSize: 15, color: C.dark, fontFamily: font }}>{t}</span></div>
      ))}
    </div>
    <Btn onClick={next}>Get Started</Btn>
  </div>
);

const Email = ({ email, set, next, back }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24, gap: 24 }}>
    <Prog step={1} total={6} />
    <span onClick={back} style={{ fontSize: 14, color: C.grey, cursor: "pointer", fontFamily: font }}>← Back</span>
    <div style={{ fontSize: 28 }}>📧</div>
    <h2 style={{ fontSize: 26, fontWeight: 700, color: C.dark, margin: 0, fontFamily: fontB }}>What's your UGA email?</h2>
    <p style={{ fontSize: 14, color: C.grey, margin: 0, fontFamily: font }}>We'll send a one-time code to verify your UGA email.</p>
    <Inp value={email} onChange={set} placeholder="your.name" suffix="@uga.edu" />
    <p style={{ fontSize: 12, color: C.grey, margin: 0, fontFamily: font }}>Only @uga.edu addresses are accepted</p>
    <Btn onClick={next} disabled={!email.trim()}>Send Code</Btn>
  </div>
);

const OTP = ({ email, otp, set, next, back }) => {
  const refs = useRef([]);
  const go = (i, v) => { if (v.length > 1) v = v.slice(-1); const n = [...otp]; n[i] = v; set(n); if (v && i < 5) refs.current[i + 1]?.focus(); };
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24, gap: 24 }}>
      <Prog step={2} total={6} />
      <span onClick={back} style={{ fontSize: 14, color: C.grey, cursor: "pointer", fontFamily: font }}>← Back</span>
      <div style={{ fontSize: 28 }}>🔑</div>
      <h2 style={{ fontSize: 26, fontWeight: 700, color: C.dark, margin: 0, fontFamily: fontB }}>Enter your code</h2>
      <p style={{ fontSize: 14, color: C.grey, margin: 0, fontFamily: font }}>Check {email}@uga.edu for a 6-digit code.</p>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        {otp.map((d, i) => <input key={i} ref={el => refs.current[i] = el} value={d} maxLength={1} onChange={e => go(i, e.target.value)} style={{ width: 48, height: 56, textAlign: "center", fontSize: 22, fontWeight: 600, borderRadius: 12, border: `1.5px solid ${d ? C.blue : C.slate}`, outline: "none", fontFamily: fontB }} />)}
      </div>
      <p style={{ fontSize: 13, color: C.grey, textAlign: "center", fontFamily: font }}>Didn't get it? <span style={{ color: C.blue, cursor: "pointer", fontWeight: 600 }}>Resend Code</span></p>
      <Btn onClick={next} disabled={otp.some(d => !d)}>Verify</Btn>
    </div>
  );
};

const Acct = ({ profile, set, next, back }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24, gap: 18, overflowY: "auto" }}>
    <Prog step={3} total={6} />
    <span onClick={back} style={{ fontSize: 14, color: C.grey, cursor: "pointer", fontFamily: font }}>← Back</span>
    <h2 style={{ fontSize: 26, fontWeight: 700, color: C.dark, margin: 0, fontFamily: fontB }}>Set up your profile</h2>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: 40, background: C.blueBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: C.blue, border: `2px dashed ${C.blue}`, fontFamily: fontB }}>{profile.name ? profile.name[0].toUpperCase() : "+"}</div>
    </div>
    <Inp label="Name" value={profile.name} onChange={v => set({ ...profile, name: v })} placeholder="Your full name" />
    <Inp label="Pronouns (optional)" value={profile.pronouns} onChange={v => set({ ...profile, pronouns: v })} placeholder="e.g., she/her, he/him" />
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: font }}>Major</label>
      <select value={profile.major} onChange={e => set({ ...profile, major: e.target.value })} style={{ fontFamily: font, fontSize: 15, padding: 12, borderRadius: 12, border: `1.5px solid ${C.slate}`, background: C.pure, outline: "none", color: profile.major ? C.dark : C.grey }}>
        <option value="">Select your major</option>
        {["Computer Science", "Business / Marketing", "Biology", "Psychology", "Engineering", "Communications", "Economics", "Graphic Design", "Political Science", "Other"].map(m => <option key={m} value={m}>{m}</option>)}
      </select>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: font }}>Year</label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{["Freshman", "Sophomore", "Junior", "Senior", "Graduate"].map(y => <Tag key={y} label={y} on={profile.year === y} onClick={() => set({ ...profile, year: y })} />)}</div>
    </div>
    <Btn onClick={next} disabled={!profile.name.trim() || !profile.major || !profile.year}>Continue</Btn>
  </div>
);

const Skills = ({ skills, set, next, back }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24, gap: 20 }}>
    <Prog step={4} total={6} />
    <span onClick={back} style={{ fontSize: 14, color: C.grey, cursor: "pointer", fontFamily: font }}>← Back</span>
    <h2 style={{ fontSize: 26, fontWeight: 700, color: C.dark, margin: 0, fontFamily: fontB }}>What are you into?</h2>
    <p style={{ fontSize: 14, color: C.grey, margin: 0, fontFamily: font }}>We use this to show you relevant requests and matches.</p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{SKILLS.map(s => <Tag key={s} label={s} on={skills.includes(s)} onClick={() => set(skills.includes(s) ? skills.filter(x => x !== s) : [...skills, s])} />)}</div>
    <div style={{ marginTop: "auto" }}><Btn onClick={next} disabled={!skills.length}>Continue</Btn></div>
  </div>
);

const AllSet = ({ profile, next }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24, justifyContent: "center", alignItems: "center", textAlign: "center", gap: 20 }}>
    <div style={{ width: 80, height: 80, borderRadius: 40, background: `${C.green}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>✓</div>
    <h2 style={{ fontSize: 28, fontWeight: 700, color: C.dark, margin: 0, fontFamily: fontB }}>You're verified, {profile.name.split(" ")[0]}.</h2>
    <p style={{ fontSize: 15, color: C.grey, margin: 0, lineHeight: 1.5, fontFamily: font }}>Welcome to Nudge. Get help, give help, and explore campus knowledge from verified UGA students.</p>
    <Glass style={{ width: "100%", textAlign: "left" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 22, background: C.blue, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, fontFamily: fontB }}>{profile.name[0]}</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: C.dark, fontFamily: fontB }}>{profile.name}</div>
          <div style={{ fontSize: 12, color: C.grey, fontFamily: font }}>{profile.major} · {profile.year}{profile.pronouns ? ` · ${profile.pronouns}` : ""}</div>
        </div>
      </div>
      <Bdg text="Verified UGA Student" />
    </Glass>
    <Btn onClick={next}>Let's Go</Btn>
  </div>
);

const Home = ({ profile, nav, getHelp, viewReq }) => {
  const [avail, setAvail] = useState(false);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, paddingBottom: 80 }}>
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div><div style={{ fontSize: 14, color: C.grey, fontFamily: font }}>Hey {profile.name.split(" ")[0]} 👋</div><h2 style={{ fontSize: 22, fontWeight: 700, color: C.dark, margin: "4px 0 0", fontFamily: fontB }}>What do you need?</h2></div>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: C.blue, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, fontFamily: fontB }}>{profile.name[0]}</div>
        </div>
        <Btn onClick={getHelp}>Get Help</Btn>
        <Glass style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }} onClick={() => setAvail(!avail)}>
          <div><div style={{ fontSize: 15, fontWeight: 600, color: C.dark, fontFamily: fontB }}>I'm Available Now</div><div style={{ fontSize: 12, color: C.grey, fontFamily: font }}>{avail ? "Visible to students needing help" : "Toggle to start helping"}</div></div>
          <div style={{ width: 50, height: 28, borderRadius: 14, background: avail ? C.green : C.slate, padding: 2, cursor: "pointer", transition: "background 0.2s" }}><div style={{ width: 24, height: 24, borderRadius: 12, background: "#fff", transform: avail ? "translateX(22px)" : "translateX(0)", transition: "transform 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} /></div>
        </Glass>
      </div>
      <Glass style={{ margin: "0 20px", background: `linear-gradient(135deg, ${C.blueBg}, rgba(16,185,129,0.06))` }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.blue, marginBottom: 4, fontFamily: font }}>📅 Midterms approaching</div>
        <div style={{ fontSize: 13, color: C.grey, fontFamily: font }}>Students are looking for study partners — browse requests below</div>
      </Glass>
      <div style={{ padding: "0 20px" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 12, fontFamily: fontB }}>Students need help</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {REQUESTS.map(r => (
            <Glass key={r.id} onClick={() => viewReq(r)} style={{ padding: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.dark, marginBottom: 6, lineHeight: 1.4, fontFamily: fontB }}>{r.need}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}><Tag label={r.subject} on />{r.tags.map(t => <Tag key={t} label={t} />)}</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.grey, fontFamily: font }}><span>{r.format === "chat" ? "💬" : r.format === "call" ? "📞" : "📍"} {r.format} · {r.time}</span><span>{r.user}</span></div>
            </Glass>
          ))}
        </div>
      </div>
      <Nav active="home" go={nav} />
    </div>
  );
};

const ReqHelp = ({ back, submit }) => {
  const [need, setNeed] = useState("");
  const [subj, setSubj] = useState("");
  const [det, setDet] = useState("");
  const [urg, setUrg] = useState(true);
  const [fmt, setFmt] = useState("chat");
  const [tags, setTags] = useState([]);
  const [loc, setLoc] = useState("");
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24, gap: 16, overflowY: "auto", paddingBottom: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span onClick={back} style={{ fontSize: 14, color: C.grey, cursor: "pointer", fontFamily: font }}>← Back</span><span style={{ fontSize: 16, fontWeight: 700, color: C.dark, fontFamily: fontB }}>Get Help</span><span style={{ width: 40 }} /></div>
      <Inp label="What do you need help with?" value={need} onChange={setNeed} placeholder="e.g., Supply/demand curves for ECON 2105" />
      <Inp label="Subject / Course" value={subj} onChange={setSubj} placeholder="e.g., ECON 2105, Resume Review" />
      <Inp label="Tell us more (optional)" value={det} onChange={setDet} placeholder="Add context or details." multi />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: font }}>When works best?</label>
        <div style={{ display: "flex", borderRadius: 12, overflow: "hidden", border: `1.5px solid ${C.slate}` }}>
          {[[true, "Right Now"], [false, "Later This Week"]].map(([id, lb]) => (
            <div key={String(id)} onClick={() => setUrg(id)} style={{ flex: 1, padding: "10px 0", textAlign: "center", fontSize: 14, fontWeight: 600, cursor: "pointer", background: urg === id ? C.blue : "transparent", color: urg === id ? "#fff" : C.grey, transition: "all 0.2s", fontFamily: font }}>{lb}</div>
          ))}
        </div>
        {urg && <p style={{ fontSize: 12, color: C.green, margin: "4px 0 0", fontFamily: font }}>⚡ Notifies available helpers immediately</p>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: font }}>How should we connect?</label>
        <div style={{ display: "flex", gap: 8 }}>
          {[["chat", "💬", "Chat"], ["call", "📞", "Call"], ["in-person", "📍", "In Person"]].map(([id, ic, lb]) => (
            <Glass key={id} active={fmt === id} onClick={() => setFmt(id)} style={{ flex: 1, padding: 10, textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 2 }}>{ic}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: fmt === id ? C.blue : C.grey, fontFamily: font }}>{lb}</div>
            </Glass>
          ))}
        </div>
        {fmt === "in-person" && <Inp label="Where on campus?" value={loc} onChange={setLoc} placeholder="MLC, Tate Center, Main Library" />}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: font }}>Tag this request</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{["Academic", "Social", "Study Buddy", "Career", "Major"].map(t => <Tag key={t} label={t} on={tags.includes(t)} onClick={() => setTags(tags.includes(t) ? tags.filter(x => x !== t) : [...tags, t])} />)}</div>
      </div>
      <Btn onClick={() => submit({ need, subj })} disabled={!need.trim() || !subj.trim()}>Join the Conversation</Btn>
      <p style={{ fontSize: 11, color: C.grey, textAlign: "center", margin: 0, fontFamily: font }}>Visible to verified UGA students with matching skills</p>
    </div>
  );
};

const Matching = ({ onDone }) => {
  const [dots, setDots] = useState("");
  const [sec, setSec] = useState(0);
  useEffect(() => {
    const i1 = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 500);
    const i2 = setInterval(() => setSec(s => s + 1), 1000);
    const t = setTimeout(onDone, 4000);
    return () => { clearInterval(i1); clearInterval(i2); clearTimeout(t); };
  }, [onDone]);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 40, gap: 20, textAlign: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: 40, border: `3px solid ${C.slate}`, borderTopColor: C.blue, animation: "spin 1s linear infinite" }}><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: C.dark, margin: 0, fontFamily: fontB }}>Finding helpers{dots}</h2>
      <p style={{ fontSize: 14, color: C.grey, margin: 0, fontFamily: font }}>Matching you with verified UGA students</p>
      <div style={{ fontSize: 32, fontWeight: 700, color: C.blue, fontFamily: fontB }}>0:{String(sec).padStart(2, "0")}</div>
      <Glass style={{ width: "100%" }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.grey, fontFamily: font }}><span>Scanning {12 + sec * 3} students</span><span>{Math.min(sec, 3)} potential</span></div></Glass>
    </div>
  );
};

const Preview = ({ accept, decline }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24, gap: 20 }}>
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <div style={{ fontSize: 14, color: C.green, fontWeight: 600, marginBottom: 8, fontFamily: font }}>✓ Match found</div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: C.dark, margin: 0, fontFamily: fontB }}>A helper matched with your request</h2>
    </div>
    <Glass style={{ textAlign: "center", padding: 24 }}>
      <div style={{ width: 72, height: 72, borderRadius: 36, background: C.blue, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, margin: "0 auto 12px", fontFamily: fontB }}>A</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.dark, fontFamily: fontB }}>{HELPER.name}</div>
      <div style={{ fontSize: 13, color: C.grey, marginTop: 2, fontFamily: font }}>{HELPER.major} · {HELPER.year}</div>
      <div style={{ marginTop: 10 }}><Bdg text="Verified UGA Student" /></div>
    </Glass>
    <Glass>
      {[["Subjects", HELPER.subjects.join(", ")], ["Rating", `👍 ${HELPER.rating}%`], ["Sessions", `${HELPER.sessions} completed`], ["Format", "💬 Chat"]].map(([l, v], i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 3 ? `1px solid ${C.glassBorder}` : "none" }}>
          <span style={{ fontSize: 13, color: C.grey, fontFamily: font }}>{l}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: font }}>{v}</span>
        </div>
      ))}
    </Glass>
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: "auto" }}><Btn onClick={accept}>Accept</Btn><Btn v="ghost" onClick={decline}>Not Right Now</Btn></div>
  </div>
);

const Session = ({ profile, done }) => {
  const [tl, setTl] = useState(900);
  const [msgs, setMsgs] = useState([{ from: "h", text: RESPONSES[0] }]);
  const [inp, setInp] = useState("");
  const [ri, setRi] = useState(1);
  const ref = useRef(null);
  useEffect(() => { const t = setInterval(() => setTl(s => Math.max(0, s - 1)), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { ref.current?.scrollTo(0, ref.current.scrollHeight); }, [msgs]);
  const send = () => {
    if (!inp.trim()) return;
    setMsgs(p => [...p, { from: "u", text: inp }]);
    setInp("");
    if (ri < RESPONSES.length) { const idx = ri; setTimeout(() => { setMsgs(p => [...p, { from: "h", text: RESPONSES[idx] }]); setRi(i => i + 1); }, 1200 + Math.random() * 1500); }
  };
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.glassBorder}`, background: C.glass, backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: C.blue, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, fontFamily: fontB }}>A</div>
            <div><div style={{ fontSize: 15, fontWeight: 600, color: C.dark, fontFamily: fontB }}>{HELPER.name}</div><Bdg text="Active" /></div>
          </div>
          <span style={{ fontSize: 18, cursor: "pointer" }}>🛡️</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <span style={{ fontSize: 12, color: C.grey, fontFamily: font }}>⏱ {Math.floor(tl / 60)}:{String(tl % 60).padStart(2, "0")}</span>
          <div style={{ width: 120, height: 3, borderRadius: 2, background: C.slate }}><div style={{ width: `${(tl / 900) * 100}%`, height: "100%", borderRadius: 2, background: tl < 120 ? C.yellow : C.blue, transition: "width 1s linear" }} /></div>
        </div>
      </div>
      <div ref={ref} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "u" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "78%", padding: "10px 14px", borderRadius: 18, background: m.from === "u" ? C.blue : C.pure, color: m.from === "u" ? "#fff" : C.dark, fontSize: 14, lineHeight: 1.45, fontFamily: font, borderBottomRightRadius: m.from === "u" ? 4 : 18, borderBottomLeftRadius: m.from === "h" ? 4 : 18, boxShadow: m.from === "h" ? "0 1px 3px rgba(0,0,0,0.06)" : "none" }}>{m.text}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: "10px 16px 32px", borderTop: `1px solid ${C.glassBorder}`, display: "flex", gap: 8, background: C.glass }}>
        <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Type a message..." style={{ flex: 1, padding: "10px 14px", borderRadius: 20, border: `1.5px solid ${C.slate}`, outline: "none", fontSize: 14, fontFamily: font }} />
        <div onClick={send} style={{ width: 36, height: 36, borderRadius: 18, background: inp.trim() ? C.blue : C.slate, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, transition: "background 0.2s" }}>↑</div>
      </div>
      <div style={{ position: "absolute", bottom: 76, left: 16, right: 16 }}>
        <button onClick={done} style={{ width: "100%", padding: "10px 0", borderRadius: 12, background: C.green, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: font }}>✓ Mark Complete</button>
      </div>
    </div>
  );
};

const PostSesh = ({ done }) => {
  const [r, setR] = useState(null);
  const [sv, setSv] = useState(false);
  const [sh, setSh] = useState(false);
  const Tog = ({ on, flip }) => (
    <div onClick={flip} style={{ width: 44, height: 24, borderRadius: 12, background: on ? C.blue : C.slate, padding: 2, cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}><div style={{ width: 20, height: 20, borderRadius: 10, background: "#fff", transform: on ? "translateX(20px)" : "translateX(0)", transition: "transform 0.2s" }} /></div>
  );
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24, gap: 20 }}>
      <div style={{ textAlign: "center", marginTop: 20 }}><div style={{ fontSize: 48 }}>✓</div><h2 style={{ fontSize: 24, fontWeight: 700, color: C.dark, margin: 0, fontFamily: fontB }}>Session Complete</h2><p style={{ fontSize: 13, color: C.grey, marginTop: 4, fontFamily: font }}>with {HELPER.name}</p></div>
      <Glass>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.dark, marginBottom: 12, fontFamily: fontB }}>How helpful was this session?</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
          {[["up", "👍", C.green], ["down", "👎", C.red]].map(([id, ic, c]) => (
            <div key={id} onClick={() => setR(id)} style={{ width: 64, height: 64, borderRadius: 32, background: r === id ? `${c}20` : C.blueBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, cursor: "pointer", border: r === id ? `2px solid ${c}` : "2px solid transparent", transition: "all 0.2s" }}>{ic}</div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: C.grey, textAlign: "center", marginTop: 8, fontFamily: font }}>Private — only used to improve future matches</p>
      </Glass>
      <Glass>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div><div style={{ fontSize: 14, fontWeight: 600, color: C.dark, fontFamily: fontB }}>Save as connection?</div><div style={{ fontSize: 12, color: C.grey, fontFamily: font }}>Request them directly next time</div></div>
          <Tog on={sv} flip={() => setSv(!sv)} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ fontSize: 14, fontWeight: 600, color: C.dark, fontFamily: fontB }}>Share contact info?</div><div style={{ fontSize: 12, color: C.grey, fontFamily: font }}>Only shared if both agree</div></div>
          <Tog on={sh} flip={() => setSh(!sh)} />
        </div>
      </Glass>
      <Btn onClick={done} disabled={!r}>Done</Btn>
    </div>
  );
};

const Explore = ({ nav }) => {
  const [tab, setTab] = useState("Courses");
  const ins = [
    { u: "Maya P.", cat: "CHEM 2211", t: "Take Dr. Smith's section if you can — she curves heavily and the study guides match the exam almost exactly." },
    { u: "Devon W.", cat: "Dining", t: "Bolton's stir fry station on Wednesdays is seriously underrated. Get there before 6:30." },
    { u: "Kenji A.", cat: "CSCI 1302", t: "Start the projects early. The autograder queue gets brutal the night before." },
    { u: "Sophia R.", cat: "Career Fair", t: "Bring WAY more resume copies than you think. The NCR line was shortest around 2pm." },
  ];
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, paddingBottom: 80 }}>
      <div style={{ padding: "16px 20px 0" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.dark, margin: "0 0 12px", fontFamily: fontB }}>Explore</h2>
        <div style={{ display: "flex", alignItems: "center", border: `1.5px solid ${C.slate}`, borderRadius: 12, padding: "8px 12px", gap: 8, background: C.pure }}><span style={{ color: C.grey }}>🔍</span><input placeholder="Search courses, clubs, tips..." style={{ border: "none", outline: "none", flex: 1, fontSize: 14, fontFamily: font }} /></div>
      </div>
      <div style={{ display: "flex", gap: 6, padding: "0 20px", overflowX: "auto" }}>
        {["Courses", "Clubs", "Campus Life", "Career", "Registration"].map(t => (
          <div key={t} onClick={() => setTab(t)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", cursor: "pointer", background: tab === t ? C.blue : C.blueBg, color: tab === t ? "#fff" : C.blue, fontFamily: font, transition: "all 0.2s" }}>{t}</div>
        ))}
      </div>
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        {ins.map((x, i) => (
          <Glass key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 24, height: 24, borderRadius: 12, background: C.blueBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: C.blue }}>{x.u[0]}</div><span style={{ fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: font }}>{x.u}</span><Bdg text="Verified" /></div>
              <span style={{ fontSize: 16, cursor: "pointer" }}>🔖</span>
            </div>
            <Tag label={x.cat} on />
            <p style={{ fontSize: 14, color: C.dark, lineHeight: 1.5, margin: "8px 0 0", fontFamily: font }}>{x.t}</p>
          </Glass>
        ))}
      </div>
      <Nav active="explore" go={nav} />
    </div>
  );
};

const Msgs = ({ nav }) => {
  const thrs = [{ n: "Alex Chen", top: "ECON 2105", last: "Want me to send the practice problems?", t: "2m", ur: true }, { n: "Priya K.", top: "Resume Review", last: "Thanks for the feedback!", t: "1h", ur: false }, { n: "Jordan L.", top: "CSCI 1301", last: "Session scheduled for Thursday 3PM", t: "3h", ur: false }];
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, paddingBottom: 80 }}>
      <div style={{ padding: "16px 20px 0" }}><h2 style={{ fontSize: 22, fontWeight: 700, color: C.dark, margin: 0, fontFamily: fontB }}>Messages</h2></div>
      <div style={{ display: "flex", padding: "0 20px", borderBottom: `1px solid ${C.glassBorder}` }}>
        {["Active", "Upcoming", "Past"].map((t, i) => <div key={t} style={{ flex: 1, textAlign: "center", padding: "8px 0", fontSize: 14, fontWeight: 600, color: i === 0 ? C.blue : C.grey, borderBottom: i === 0 ? `2px solid ${C.blue}` : "none", cursor: "pointer", fontFamily: font }}>{t}</div>)}
      </div>
      <div style={{ padding: "0 20px" }}>
        {thrs.map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i < 2 ? `1px solid ${C.glassBorder}` : "none", cursor: "pointer" }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: C.blueBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: C.blue, flexShrink: 0, fontFamily: fontB }}>{t.n[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 15, fontWeight: t.ur ? 700 : 500, color: C.dark, fontFamily: fontB }}>{t.n}</span><span style={{ fontSize: 12, color: C.grey, fontFamily: font }}>{t.t}</span></div>
              <div style={{ fontSize: 12, color: C.blue, fontWeight: 500, marginTop: 1, fontFamily: font }}>{t.top}</div>
              <div style={{ fontSize: 13, color: t.ur ? C.dark : C.grey, fontWeight: t.ur ? 600 : 400, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: font }}>{t.last}</div>
            </div>
            {t.ur && <div style={{ width: 8, height: 8, borderRadius: 4, background: C.blue, alignSelf: "center" }} />}
          </div>
        ))}
      </div>
      <Nav active="messages" go={nav} />
    </div>
  );
};

const Prof = ({ profile, nav }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, paddingBottom: 80 }}>
    <div style={{ padding: "16px 20px", textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: 36, background: C.blue, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, margin: "0 auto 10px", fontFamily: fontB }}>{profile.name ? profile.name[0] : "?"}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.dark, fontFamily: fontB }}>{profile.name}</div>
      <div style={{ fontSize: 13, color: C.grey, marginTop: 2, fontFamily: font }}>{profile.major} · {profile.year}{profile.pronouns ? ` · ${profile.pronouns}` : ""}</div>
      <div style={{ marginTop: 8 }}><Bdg text="Verified UGA Student" /></div>
    </div>
    <div style={{ padding: "0 20px" }}>
      {[{ s: "Account", items: ["Edit Profile", "Availability", "Connection Preferences"] }, { s: "Notifications", items: ["Notification Preferences"] }, { s: "Privacy & Safety", items: ["Privacy Controls", "Blocked Users"] }, { s: "History", items: ["Past Requests", "Past Sessions", "Saved Connections"] }, { s: "Account", items: ["Change Password", "Export My Data"] }].map((g, gi) => (
        <div key={gi} style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.grey, textTransform: "uppercase", letterSpacing: 0.5, padding: "8px 0", fontFamily: font }}>{g.s}</div>
          {g.items.map((item, ii) => <div key={ii} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.glassBorder}`, cursor: "pointer" }}><span style={{ fontSize: 15, color: C.dark, fontFamily: font }}>{item}</span><span style={{ color: C.grey }}>›</span></div>)}
        </div>
      ))}
      <div style={{ padding: "12px 0" }}><span style={{ fontSize: 15, color: C.red, fontWeight: 600, fontFamily: font, cursor: "pointer" }}>Delete Account</span></div>
    </div>
    <Nav active="profile" go={nav} />
  </div>
);

export default function App() {
  const [s, setS] = useState("welcome");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [profile, setProfile] = useState({ name: "", pronouns: "", major: "", year: "" });
  const [skills, setSkills] = useState([]);
  const found = useCallback(() => setS("preview"), []);
  const nav = (id) => { const map = { home: "home", explore: "explore", messages: "messages", profile: "profile" }; setS(map[id] || "home"); };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: `linear-gradient(135deg, #E8ECF4 0%, #D5DAE6 100%)`, padding: 20 }}>
      <Phone>
        {s === "welcome" && <Welcome next={() => setS("email")} />}
        {s === "email" && <Email email={email} set={setEmail} next={() => setS("otp")} back={() => setS("welcome")} />}
        {s === "otp" && <OTP email={email} otp={otp} set={setOtp} next={() => setS("acct")} back={() => setS("email")} />}
        {s === "acct" && <Acct profile={profile} set={setProfile} next={() => setS("skills")} back={() => setS("otp")} />}
        {s === "skills" && <Skills skills={skills} set={setSkills} next={() => setS("allset")} back={() => setS("acct")} />}
        {s === "allset" && <AllSet profile={profile} next={() => setS("home")} />}
        {s === "home" && <Home profile={profile} nav={nav} getHelp={() => setS("req")} viewReq={() => setS("preview")} />}
        {s === "req" && <ReqHelp back={() => setS("home")} submit={() => setS("matching")} />}
        {s === "matching" && <Matching onDone={found} />}
        {s === "preview" && <Preview accept={() => setS("session")} decline={() => setS("home")} />}
        {s === "session" && <Session profile={profile} done={() => setS("post")} />}
        {s === "post" && <PostSesh done={() => setS("home")} />}
        {s === "explore" && <Explore nav={nav} />}
        {s === "messages" && <Msgs nav={nav} />}
        {s === "profile" && <Prof profile={profile} nav={nav} />}
      </Phone>
    </div>
  );
}
