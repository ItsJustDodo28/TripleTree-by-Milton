import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/protected', {
                    credentials: 'include',
                });

                if (!response.ok) {
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                setRole(data.role);
            } catch (error) {
                console.error('Error verifying token:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;
