import React, { useState} from 'react';
import {Link} from 'react-router-dom';
import { Container, Row } from 'react-bootstrap';
import {api, setAuthToken} from "../../service/Api";

interface Credentials {
    email: string;
    password: string;
}

interface LoginPageProps {
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [credentials, setCredentials] = useState<Credentials>({ email: '', password: '' });
    const [loginMessage, setLoginMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setCredentials((prevCredentials) => ({ ...prevCredentials, [name]: value }));
    };

    // Принимаем событие формы React.FormEvent
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault(); // ПРЕДОТВРАЩАЕТ ПЕРЕЗАГРУЗКУ СТРАНИЦЫ И (canceled)

        setIsLoading(true);
        setLoginMessage('');

        try {
            const authUrl = process.env.REACT_APP_AUTH_URL || '/auth';
            const response = await api.post(`${authUrl}/authenticate`, credentials);
            
            const { token } = response.data;
            setAuthToken(token);
            setLoginMessage('Login successful!');
            
            onLoginSuccess();
        } catch (error) {
            console.error('Login failed:', error);
            setLoginMessage('Invalid username or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <Row>
                <div className="login-page d-flex align-items-center justify-content-center vh-100">
                    <div className="text-center">
                        <h1>Login</h1>
                        {/* Обработчик вешается на onSubmit формы */}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">
                                    Username / Email:
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="email"
                                    value={credentials.email}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    required
                                    autoComplete="username"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">
                                    Password:
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    required
                                    autoComplete="current-password"
                                />
                            </div>

                            {/* Кнопка отправляет форму штатным событием submit */}
                            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                        {loginMessage && <p className="mt-3">{loginMessage}</p>}
                        <p className="mt-2">
                            Don't have an account? <Link to="/register">Register here</Link>.
                        </p>
                    </div>
                </div>
            </Row>
        </Container>
    );
};

export default LoginPage;