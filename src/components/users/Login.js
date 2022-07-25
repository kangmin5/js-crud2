import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'modules/apis';
import styles from 'styles/login.module.css'
import Link from 'next/link';
import AuthContext from 'modules/context/AuthProvider';

const LOGIN_URL = '/auth';

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
      userRef.current.focus();
  }, [])

  useEffect(() => {
      setErrMsg('');
  }, [user, pwd])

  const handleSubmit = async (e) => {
      e.preventDefault();

      try {
          const response = await axios.post(LOGIN_URL,
              JSON.stringify({ user, pwd }),
              {
                  headers: { 'Content-Type': 'application/json' },
                  withCredentials: true
              }
          );
          console.log(JSON.stringify(response?.data));
          //console.log(JSON.stringify(response));
          const accessToken = response?.data?.accessToken;
          const roles = response?.data?.roles;
          setAuth({ user, pwd, roles, accessToken });
          setUser('');
          setPwd('');
          setSuccess(true);
      } catch (err) {
          if (!err?.response) {
              setErrMsg('No Server Response');
          } else if (err.response?.status === 400) {
              setErrMsg('Missing Username or Password');
          } else if (err.response?.status === 401) {
              setErrMsg('Unauthorized');
          } else {
              setErrMsg('Login Failed');
          }
          errRef.current.focus();
      }
  }


return (
  <div className={styles.container}>
      {success ? (
          <section>
              <h1>You are logged in!</h1>
              <br />
              <p>
                  <Link href="/">Go to Home</Link>
              </p>
          </section>
      ) : (
          <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive">{errMsg}</p>
              <h1 style={{fontWeight:"bold"}}>Login</h1>
              <form onSubmit={handleSubmit}>
                  <label htmlFor="username">Username:</label>
                  <input
                      type="text"
                      id="username"
                      ref={userRef}
                      autoComplete="off"
                      onChange={(e) => setUser(e.target.value)}
                      value={user}
                      required
                  />

                  <label htmlFor="password">Password:</label>
                  <input
                      type="password"
                      id="password"
                      onChange={(e) => setPwd(e.target.value)}
                      value={pwd}
                      required
                  />
                  <button style={{border:'1px solid black', backgroundColor:'pink',marginTop:'2rem'}}>Login</button>
              </form>
              <p>
                  계정이 없으시면?<br />
                  <span className="line">
                      <Link href="/users/join">회원가입</Link>
                  </span>
              </p>
          </section>
      )}
  </div>
)
}

export default Login