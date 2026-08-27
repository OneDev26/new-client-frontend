import React,{useState}from"react";
import{Navigate,useNavigate}from"react-router-dom";
import{useDispatch,useSelector}from"react-redux";
import{ArrowRight,ChevronDown,Eye,EyeOff,Globe2,LockKeyhole,Mail,ShieldCheck}from"lucide-react";
import{frontendLogin}from"../features/auth/authSlice";
import loginDesktop from"../assets/Login_Desktop.png";
import loginMobile from"../assets/Login_Mobile.png";
import"../CSS/PortalLogin.css";

export default function PortalLogin(){
 const token=useSelector(s=>s.auth.token),dispatch=useDispatch(),navigate=useNavigate();
 const[show,setShow]=useState(false),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[remember,setRemember]=useState(true),[loginError,setLoginError]=useState("");
 if(token)return <Navigate to="/dashboard" replace/>;
 const submit=e=>{e.preventDefault();if(email.trim().toLowerCase()!=="client@test.com"||password!=="client123"){setLoginError("Invalid email or password");return}setLoginError("");dispatch(frontendLogin({remember}));navigate("/dashboard")};
 return <main className="portal-login">
  <section className="login-visual" aria-label="Survill smart surveillance"><picture><source media="(max-width: 768px)" srcSet={loginMobile}/><img src={loginDesktop} alt="Survill security camera protecting a retail store"/></picture></section>
  <section className="login-panel"><div className="login-card">
   <header><div><h1>Welcome Back!</h1><p>Please sign in to your account</p></div><button type="button" className="language"><Globe2/>EN<ChevronDown/></button></header>
   <form onSubmit={submit}>
    <label className="login-field"><Mail/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email or Phone Number" required/></label>
    <label className="login-field"><LockKeyhole/><input type={show?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required/><button type="button" onClick={()=>setShow(!show)} aria-label={show?"Hide password":"Show password"}>{show?<EyeOff/>:<Eye/>}</button></label>
    <div className="login-options"><label><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/><span>Remember me</span></label><button type="button">Forgot Password?</button></div>
    <button className="login-submit">Sign In <ArrowRight/></button>
    {loginError&&<p className="login-error">{loginError}</p>}
   </form>
   <p className="login-signup">Don’t have an account? <button>Sign Up</button></p>
   <p className="login-secure"><ShieldCheck/>Your data is secure with enterprise-grade encryption</p>
  </div></section>
 </main>
}
