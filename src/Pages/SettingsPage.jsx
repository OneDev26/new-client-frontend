import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ArrowLeft, Bell, Check, ChevronDown, ChevronRight, Clock3, Eye, Globe2, HelpCircle, LockKeyhole, LogOut, Mail, ShieldCheck, Store, UserRound } from "lucide-react";
import storeImage from "../assets/Dashboard_store.png";
import { logout } from "../features/auth/authSlice";
import "../CSS/SettingsPage.css";

const account = [
  ["Profile Information", "View your personal information", UserRound],
  ["Change Password", "Update your account password", LockKeyhole],
  ["Email Preferences", "Manage email notifications", Mail],
  ["Two-Factor Authentication", "Add extra security to your account", ShieldCheck, "Off"],
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [view, setView] = useState("menu");
  const [push, setPush] = useState(true);
  const [emailPrefs, setEmailPrefs] = useState({ account: true, store: true, security: true, system: false, reports: true, promotions: false });
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });
  const back = () => {
    if (view === "menu") navigate(-1);
    else if (view === "form") setView("security");
    else if (view === "email-config") setView("email");
    else setView("menu");
  };
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };
  const valid = password.current && password.next.length >= 8 && password.next === password.confirm;
  const title = view === "menu" ? "Settings" : view.startsWith("email") ? (view === "email-config" ? "Configure Preferences" : "Email Preferences") : "Change Password";
  const subtitle = view === "menu" ? "Manage your account and app preferences" : view === "security" ? "Keep your account secure" : view === "form" ? "Enter your new password" : view === "email" ? "Manage the emails you receive from us" : view === "email-config" ? "Customize your email notification settings" : view === "email-success" ? "Your preferences have been updated" : "Your password is now secure";

  return <main className="sp-page">
    <header className="sp-local-head"><button onClick={back} aria-label="Go back"><ArrowLeft size={19}/></button><div><h1>{title}</h1><p>{subtitle}</p></div></header>
    <div className={`sp-shell sp-${view}`}>
      <section className="sp-menu">
        <button className="sp-store"><img src={storeImage} alt="Downtown Market"/><span><b>Downtown Market</b><small>Store Owner</small></span><ChevronRight/></button>
        <Group title="Account">{account.map(([name, copy, Icon, value]) => <button key={name} className={(view !== "menu" && name === "Change Password") || (view.startsWith("email") && name === "Email Preferences") ? "active" : ""} onClick={() => name === "Change Password" ? setView("security") : name === "Email Preferences" ? setView("email") : null}><IconBox Icon={Icon}/><Text name={name} copy={copy}/>{value && <em>{value}</em>}<ChevronRight size={17}/></button>)}</Group>
        <Group title="App Preferences">
          <Row Icon={Bell} name="Push Notifications" copy="Manage push notification settings"><Toggle on={push} click={() => setPush(!push)}/></Row>
          <Row Icon={Globe2} name="Language" copy="Select your preferred language" value="English"/>
          <Row Icon={Clock3} name="Date & Time Format" copy="Set your preferred format" value="12-hour"/>
        </Group>
        <Group title="Support & Information"><Row Icon={HelpCircle} name="Help & Support" copy="Get help with your account"/><button type="button" className="sp-logout" onClick={handleLogout}><IconBox Icon={LogOut}/><Text name="Logout" copy="Sign out of your account"/><ChevronRight size={17}/></button></Group>
      </section>
      <section className="sp-detail">
        {(view === "menu" || view === "security") && <Security next={() => setView("form")}/>} 
        {view === "form" && <PasswordForm value={password} setValue={setPassword} valid={valid} done={() => setView("success")}/>} 
        {view === "success" && <Success done={() => setView("menu")}/>} 
        {view === "email" && <EmailPreferences next={() => setView("email-config")}/>} 
        {view === "email-config" && <ConfigurePreferences prefs={emailPrefs} setPrefs={setEmailPrefs} done={() => setView("email-success")} cancel={() => setView("email")}/>} 
        {view === "email-success" && <PreferencesSuccess done={() => setView("menu")}/>} 
      </section>
    </div>
  </main>;
}

function Group({title, children}) { return <div className="sp-group"><h2>{title}</h2><div>{children}</div></div>; }
function IconBox({Icon}) { return <span className="sp-icon"><Icon size={19}/></span>; }
function Text({name, copy}) { return <span className="sp-copy"><b>{name}</b><small>{copy}</small></span>; }
function Row({Icon,name,copy,value,children}) { return <div className="sp-row"><IconBox Icon={Icon}/><Text name={name} copy={copy}/>{children || <><em>{value}</em><ChevronRight size={17}/></>}</div>; }
function Toggle({on,click}) { return <button type="button" className={`sp-toggle ${on ? "on" : ""}`} onClick={click} aria-pressed={on} aria-label={on ? "Turn off" : "Turn on"}><span/></button>; }

const emailOptions = [
  ["account", "Account Alerts", "Important updates about your account and security.", Bell],
  ["store", "Store Updates", "Notifications about your store activity and status.", Store],
  ["security", "Security Alerts", "Important security and login notifications.", ShieldCheck],
  ["system", "System Updates", "Updates about new features and system improvements.", Globe2],
  ["reports", "Reports & Summaries", "Daily and weekly summaries and performance reports.", Mail],
  ["promotions", "Promotions & Offers", "Tips, offers and promotional emails.", UserRound],
];

function EmailPreferences({next}) {
  return <div className="sp-email"><div className="sp-email-note"><span className="sp-email-note-icon"><Mail size={18}/></span><div><b>Stay informed your way</b><span>Choose which emails you want to receive and how often.</span></div></div><h2>Email Notifications</h2><div className="sp-email-list">{emailOptions.map(([key,name,copy,Icon])=><button key={key} onClick={next}><IconBox Icon={Icon}/><Text name={name} copy={copy}/><em>{key === "system" || key === "promotions" ? "Off" : "On"}</em><ChevronRight size={16}/></button>)}</div><button className="sp-frequency-row" onClick={next}><Clock3/><Text name="Email Frequency" copy="Choose how often you want to receive non-critical emails."/><em>Daily</em><ChevronRight size={16}/></button></div>;
}

function ConfigurePreferences({prefs,setPrefs,done,cancel}) {
  const [frequencyFor,setFrequencyFor]=useState(null);
  const [frequencies,setFrequencies]=useState({account:"Instant",store:"Daily",security:"Instant",system:"Daily",reports:"Weekly",promotions:"Weekly"});
  const setToggle=key=>setPrefs({...prefs,[key]:!prefs[key]});
  return <div className="sp-email sp-email-config"><div className="sp-email-note"><span className="sp-email-note-icon"><Mail size={18}/></span><div><b>Customize your email notifications</b><span>Control which updates reach your inbox and how often.</span></div></div><div className="sp-config-list">{emailOptions.map(([key,name,copy])=><article key={key}><div><b>{name}</b><span>{copy}</span></div><Toggle on={prefs[key]} click={()=>setToggle(key)}/><button type="button" className="sp-frequency" onClick={()=>setFrequencyFor(key)} disabled={!prefs[key]}><small>Email Frequency</small><strong>{frequencies[key]} <ChevronDown size={14}/></strong></button></article>)}</div><div className="sp-email-actions"><button className="sp-primary" onClick={done}>Save Preferences</button><button className="sp-cancel" type="button" onClick={cancel}>Cancel</button></div>{frequencyFor&&<FrequencySheet value={frequencies[frequencyFor]} choose={value=>{setFrequencies({...frequencies,[frequencyFor]:value});setFrequencyFor(null)}} close={()=>setFrequencyFor(null)}/>}</div>;
}

function FrequencySheet({value,choose,close}) {
  return <div className="sp-frequency-overlay" onClick={close}><section onClick={event=>event.stopPropagation()}><button className="sp-sheet-close" onClick={close}>×</button><h2>Email Frequency</h2><p>Choose how often you want to receive this type of email.</p>{[["Instant","Receive emails immediately"],["Daily","Receive a summary once a day"],["Weekly","Receive a summary once a week"],["Monthly","Receive a summary once a month"],["Never","Don't receive these emails"]].map(([name,copy])=><label key={name}><input type="radio" checked={value===name} onChange={()=>choose(name)}/><span><b>{name}</b><small>{copy}</small></span></label>)}<button className="sp-primary" onClick={close}>Done</button></section></div>;
}

function PreferencesSuccess({done}) {
  return <div className="sp-success sp-email-success"><div className="sp-mail-success"><Mail size={82}/><Check size={28}/></div><h2>Preferences Updated!</h2><p>Your email preferences have been saved successfully.</p><article><Bell/><div><b>What's Next?</b><span>You'll only receive emails based on your updated preferences.</span></div></article><button className="sp-primary" onClick={done}>Back to Settings</button></div>;
}
function Security({next}) { return <div className="sp-security"><div className="sp-lock"><LockKeyhole size={92}/><ShieldCheck size={32}/></div><article><h2>Security First</h2><p>A strong password helps keep your account and store data safe.</p><ul><li><ShieldCheck/>Use at least 8 characters</li><li><ShieldCheck/>Include a mix of letters, numbers and symbols</li><li><LockKeyhole/>Avoid using personal information</li></ul></article><button className="sp-primary" onClick={next}>Continue</button></div>; }

function PasswordForm({value,setValue,valid,done}) {
  const field = (key,label) => <label className="sp-field"><span>{label}</span><div><input type="password" value={value[key]} onChange={e=>setValue({...value,[key]:e.target.value})}/><Eye size={18}/></div></label>;
  return <div className="sp-form"><div className="sp-note"><LockKeyhole/><b>For your security, you'll need to enter your current password and create a new one.</b></div>{field("current","Current Password")}<button className="sp-forgot">Forgot Password?</button>{field("next","New Password")}<div className="sp-strength"><i/><i/><i/></div><div className="sp-rules"><b>Strong password</b>{["At least 8 characters","One uppercase letter","One number","One special character"].map(x=><span key={x}><Check/>{x}</span>)}</div>{field("confirm","Confirm New Password")}<button className="sp-primary" disabled={!valid} onClick={done}>Update Password</button></div>;
}

function Success({done}) { return <div className="sp-success"><div className="sp-success-mark"><ShieldCheck size={82}/></div><h2>Password Updated!</h2><p>Your password has been changed successfully.</p><article><LockKeyhole/><div><b>What's Next?</b><span>You can now login with your new password.</span></div></article><button className="sp-primary" onClick={done}>Back to Settings</button></div>; }
