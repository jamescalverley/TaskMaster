import React, { useState, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import { useGlobalStore } from '../GlobalStore/GlobalStore';
import { secureStorage } from '../../utils';
import { Link } from 'react-router-dom';
import Message from '../Message/Message';

function LoginPage(props) {
    // const isLoggedIn = localStorage.getItem('email') ? true : false;
    const [globalData, dispatch] = useGlobalStore();
    const [userData, setUserData] = useState({ email: '', password: '' });

    const inputEmail = useRef();
    const inputPassword = useRef();
    

    function handleInputChange(e) {
        const { id, value } = e.target; //
        setUserData({ ...userData, [id]: value });
    }

    async function loginUser(e) {
        e.preventDefault();

        if (userData.email === '') {
            inputEmail.current.focus();
            dispatch({
                do: 'setMessage',
                type: 'danger',
                message: 'Please enter your email!',
            });
            //alert('Please enter your email!');
            return;
        }

        if (userData.password === '' || userData.password.length < 1) {
            inputPassword.current.focus();
            dispatch({
                do: 'setMessage',
                type: 'danger',
                message: 'Please enter your password!',
            });
            //alert('Please enter your password!');
            return;
        }

        console.log(userData);
        const url = '/api/login';
        const result = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json());
        console.log(result);
        // console.log(result[0].email);
        //let email = result.email;
        if (result.email) {
            //secureStorage.setItem('email', result.email);
            //localStorage.setItem('email', result.email);
            secureStorage.setItem('email', result.email);
            console.log(secureStorage.getItem('email'));
            dispatch({
                do: 'setMessage',
                type: 'success',
                message: 'Logging in...',
            });
            setTimeout(function () {
                dispatch({ do: 'clearMessage' });
                dispatch({ do: 'loginState', loggedIn: true });
            }, 1000);
        } else {
            dispatch({
                do: 'setMessage',
                type: 'danger',
                message: result.message
            });
        }
    }

    return (
        <div className="loginPage">
            {globalData.loggedIn ? <Redirect to="/projectdashboard" /> : ''}

            <div className="card login-card">
                <div className="card-header title-header">
                    <h1>TaskMaster</h1>
                    <h4 style={{ color: 'grey' }}>
                        Keep your projects organized.
                    </h4>
                </div>
                <div className="card-header">Login</div>
                <Message />
                <div className="card-body">
                    <input type="hidden" id="db_id" value="" />
                    <div className="form-group">
                        <label for="email">Email</label>
                        <input
                            value={userData.email}
                            onChange={handleInputChange}
                            ref={inputEmail}
                            id="email"
                            type="email"
                            className="form-control login-input"
                        />
                    </div>
                    <div className="form-group">
                        <label for="userPassword">Password</label>
                        <input
                            value={userData.password}
                            onChange={handleInputChange}
                            ref={inputPassword}
                            id="password"
                            type="password"
                            className="form-control login-input "
                        />
                    </div>
                    <button
                        onClick={loginUser}
                        type="button"
                        className="btn btn-outline-light submit"
                    >
                        Login
                    </button>
                    <footer className="footer-card">
                        Don't have an account?
                        <Link to="/register" className="loginBtn">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-light"
                            >
                                Register
                            </button>
                        </Link>
                    </footer>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
