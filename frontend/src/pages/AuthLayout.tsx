import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex items-center">
            <Outlet />
        </div>
    )
}

export default AuthLayout