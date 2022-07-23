import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'modules/apis';
import styles from 'styles/join.module.css'
import { useDispatch, useSelector } from "react-redux";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
const MOBILE_REGEX = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/  //숫자만 입력하는 정규식
const REGISTER_URL = '/users';

const Join = () => {
    const dispatch = useDispatch();
    const userList = useSelector(state => state.users)
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [mobile, setMobile] = useState('');
    const [validMobile, setValidMobile] = useState(false);
    const [mobileFocus, setMobileFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])
    useEffect(() => {
        setValidMobile(MOBILE_REGEX.test(mobile));
    }, [mobile])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        const v3 = EMAIL_REGEX.test(email);
        const v4 = MOBILE_REGEX.test(mobile);
        if (!v1 || !v2 || !v3 || !v4) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ user, pwd,email,mobile }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response?.data);
            console.log(response?.accessToken);
            console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setUser('');
            setPwd('');
            setMatchPwd('');
            setEmail('');
            setMobile('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('서버가 응답하지 않습니다.');
            } else if (err.response?.status === 409) {
                setErrMsg('이미 등록되어 있습니다.');
            } else {
                setErrMsg('가입이 실패하였습니다.')
            }
            errRef.current.focus();
        }
    }

    return (
        <div className={styles.container}>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="#">Sign In</a>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1 style={{fontWeight:"bold"}}>회원가입</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">
                            UserID:
                            <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            placeholder="ID (4글자이상)"
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            영문 4자리 - 24자리까지 가능<br />
                            문자로 시작되어야 합니다.<br />
                            문자,숫자,_,- 사용가능합니다.
                        </p>

                        <label htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            영문 8자리 - 24자리까지 가능<br />
                            대문자,소문자,숫자, 특수문자가 한자리 이상 포함되어야 합니다.<br />
                            특수문자는 ~!@@#$% 만 사용 가능 합니다.
                        </p>


                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            password를 확인하세요.
                        </p>
                        <label htmlFor="email">
                                이메일:
                                <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                        </label>
                        <input type="email"
                            id="email"
                            onChange={(e) => { setEmail(e.target.value) }}
                            value={email}
                            // required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="emailNote"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />
                        <p id="emailNote" className={emailFocus && !validEmail ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            email을 입력하세요.
                        </p>
                        <label htmlFor="mobile">
                                휴대전화:
                                <FontAwesomeIcon icon={faCheck} className={validMobile ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validMobile || !mobile ? "hide" : "invalid"} />
                        </label>
                        <input type="text"
                            id="mobile"
                            onChange={(e) => { setMobile(e.target.value) }}
                            value={mobile}
                            // required
                            aria-invalid={validMobile ? "false" : "true"}
                            aria-describedby="mobileNote"
                            onFocus={() => setMobileFocus(true)}
                            onBlur={() => setMobileFocus(false)}
                        />
                        <p id="mobileNote" className={mobileFocus && !validMobile ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            휴대전화번호를 숫자만 입력하세요.(01011112222)
                        </p>    
                            
                        <button style={{border:'1px solid black', backgroundColor:'pink',marginTop:'2rem'}} disabled={!validName || !validPwd || !validMatch ? true : false}>등록</button>
                    </form>
                    <p>
                        이미 ID가 있으시면?<br />
                        <span className="line">
                            {/*put router link here*/}
                            <a href="#">Login</a>
                        </span>
                    </p>
                </section>
            )}
        </div>
    )
}

export default Join