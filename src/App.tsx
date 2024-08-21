import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import NavigationBar from "./components/navigation/NavigationBar";
import GypsumBoardShow2 from "./components/pages/GypsumBoardShow2";
import DelaysShow from "./components/pages/DelaysShow";
import DefectsShow from "./components/pages/DefectsShow";
import MainPage from "./components/pages/MainPage";
import Footer from "./components/navigation/Footer";
import RegistrationPage from "./components/pages/RegistrationPage";
import LoginPage from "./components/pages/LoginPage";
import { api } from "./service/Api";
import BoardProductionPage from './components/pages/boardProductionInput/productComponents/BoardProduction';
import 'bootstrap/dist/css/bootstrap.min.css';
import DashBoard from './components/pages/DashBoard';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import FindBoardReport from './components/pages/boardProductionInput/productComponents/findBoardReport';




// function App() {
//     const [validatingToken, setValidatingToken] = useState(true);
//     const [tokenValid, setTokenValid] = useState(false);
//
//     useEffect(() => {
//         async function validateToken() {
//             const authToken = localStorage.getItem('authToken');
//             if (authToken) {
//                 try {
//                     const response = await api.get(`${process.env.REACT_APP_AUTH_URL}/validate`, {
//                         params: { token: authToken }
//                     });
//                     if (!response.data.valid) {
//                         localStorage.removeItem('authToken'); // Удаление недействительного токена
//                         setTokenValid(false);
//                         setValidatingToken(true);
//                     } else {
//                         setTokenValid(true);
//                     }
//                 } catch (error) {
//                     console.error('Ошибка при валидации токена:', error);
//                 }
//             }
//             setValidatingToken(false);
//         }
//
//         validateToken();
//     }, []);
//
//     if (validatingToken) {
//         return null; // Пока происходит проверка токена, ничего не отображаем
//     }
//
//     return (
//         <div>
//             <NavigationBar/>
//             <Routes>
//                 <Route path="/" element={!tokenValid ? <LoginPage /> : <MainPage />} />
//                 <Route path="/board" element={<GypsumBoardShow2/>}/>
//                 <Route path="/boardDelays" element={<DelaysShow/>}/>
//                 <Route path="/boardDefects" element={<DefectsShow/>}/>
//                 <Route path="/boardReport" element={<BoardProductionInputForm/>}/>
//                 <Route path="/register" element={<RegistrationPage/>}/>
//             </Routes>
//             <Footer/>
//         </div>
//     );
// }
//
// export default App;
function App() {
    const navigate = useNavigate();
    const [validatingToken, setValidatingToken] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    useEffect(() => {
        async function validateToken() {
            // setValidatingToken(true);
            let authToken = localStorage.getItem('authToken');
            if (authToken) {
                try {
                    const response = await api.get(`${process.env.REACT_APP_AUTH_URL}/validate`, {
                        params: { token: authToken }
                    });
                    if (!response.data.valid) {
                        localStorage.removeItem('authToken'); // Удаление недействительного токена
                        setTokenValid(false);
                        setValidatingToken(true);
                        // navigate("/login");
                    } else {
                        setTokenValid(true);
                    }
                } catch (error) {
                    console.error('Ошибка при валидации токена:', error);
                }
            } else {
                setTokenValid(false);
            }
            setValidatingToken(false);
        }

        validateToken();
    }, []);

    const handleLoginSuccess = () => {

        setTokenValid(true);
        navigate("/"); // Перенаправление на "/" после успешного логина
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        alert('Вы успешно вышли');
        setTokenValid(false); // Обновляем состояние токена в App
    };


    if (validatingToken) {
        return null; // Пока происходит проверка токена, ничего не отображаем
    }
    return (
        // <Router>
        <div>
            <NavigationBar tokenValid={tokenValid} onLogout={handleLogout} />
            <Routes>                
                <Route path="/dashBoard" element={tokenValid ? <DashBoard /> : <Navigate to="/login" />} />
                <Route path="/board" element={tokenValid ? <GypsumBoardShow2 /> : <Navigate to="/login" />} />
                <Route path="/boardDelays" element={tokenValid ? <DelaysShow /> : <Navigate to="/login" />} />
                <Route path="/boardDefects" element={tokenValid ? <DefectsShow /> : <Navigate to="/login" />} />
                <Route path="/boardReport" element={tokenValid ? <BoardProductionPage /> : <Navigate to="/login" />} />
                <Route path="/findReport" element={tokenValid ? <FindBoardReport /> : <Navigate to="/login" />} />
                <Route path="/" element={tokenValid ? <MainPage /> : <Navigate to="/login" />} />
                {/*<Route path="/" element={<MainPage />} />*/}
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/*" element={<Navigate to="/login" />} />
            </Routes>
            <Footer />
        </div>
        // </Router>
    );
}

export default App;