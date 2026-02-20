import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Signup Page - Create New User Account
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@components/common';
import { Input, Checkbox } from '@components/forms';
import toast from 'react-hot-toast';
import { isValidEmail, isStrongPassword } from '@utils';
import { authService, userService } from '@services/firebase';
export const SignupPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
    });
    const [errors, setErrors] = useState({});
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formData.displayName.trim()) {
            newErrors.displayName = 'Name is required';
        }
        if (!formData.email) {
            newErrors.email = 'Email is required';
        }
        else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        else if (!isStrongPassword(formData.password)) {
            newErrors.password =
                'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'You must accept the terms and conditions';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setLoading(true);
        try {
            // Create Firebase Auth User
            const userAuth = await authService.signup(formData.email, formData.password);
            // Create Firestore User Profile
            await userService.createUserProfile(userAuth.uid, formData.displayName, formData.email, 'user');
            toast.success('Account created successfully! Please login with your credentials.');
            // Redirect to login page
            navigate('/login', {
                state: { email: formData.email }
            });
        }
        catch (error) {
            const errorMessage = error.code === 'auth/email-already-in-use'
                ? 'Email already registered. Please login instead.'
                : error.message || 'Account creation failed';
            toast.error(errorMessage);
        }
        finally {
            setLoading(false);
        }
    };
    const passwordStrength = () => {
        if (!formData.password)
            return 0;
        let strength = 0;
        if (formData.password.length >= 8)
            strength++;
        if (/[a-z]/.test(formData.password))
            strength++;
        if (/[A-Z]/.test(formData.password))
            strength++;
        if (/[0-9]/.test(formData.password))
            strength++;
        if (/[!@#$%^&*]/.test(formData.password))
            strength++;
        return strength;
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center p-4 py-12", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md", children: [_jsxs("div", { className: "mb-8 text-center", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: "AQ-Immune" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Create your account to get started" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx(Input, { type: "text", name: "displayName", label: "Full Name", placeholder: "John Doe", value: formData.displayName, onChange: handleChange, error: errors.displayName, required: true }), _jsx(Input, { type: "email", name: "email", label: "Email Address", placeholder: "you@example.com", value: formData.email, onChange: handleChange, error: errors.email, required: true }), _jsxs("div", { children: [_jsx(Input, { type: "password", name: "password", label: "Password", placeholder: "Enter password", value: formData.password, onChange: handleChange, error: errors.password, required: true }), formData.password && (_jsxs("div", { className: "mt-2 space-y-1", children: [_jsx("div", { className: "flex gap-1", children: [...Array(5)].map((_, i) => (_jsx("div", { className: `h-1 flex-1 rounded ${i < passwordStrength()
                                                    ? 'bg-green-500'
                                                    : 'bg-gray-300 dark:bg-gray-600'}` }, i))) }), _jsxs("p", { className: "text-xs text-gray-600 dark:text-gray-400", children: ["Password strength: ", ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][passwordStrength()]] })] }))] }), _jsx(Input, { type: "password", name: "confirmPassword", label: "Confirm Password", placeholder: "Re-enter password", value: formData.confirmPassword, onChange: handleChange, error: errors.confirmPassword, required: true }), _jsx(Checkbox, { name: "acceptTerms", label: "I agree to Terms and Conditions", checked: formData.acceptTerms, onChange: handleChange }), errors.acceptTerms && (_jsx("p", { className: "text-sm text-red-500", children: errors.acceptTerms })), _jsx(Button, { type: "submit", variant: "primary", size: "md", fullWidth: true, isLoading: loading, children: loading ? 'Creating Account...' : 'Create Account' })] }), _jsx("div", { className: "mt-6 text-center", children: _jsxs("p", { className: "text-gray-600 dark:text-gray-400 text-sm", children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", className: "text-sky-500 hover:text-sky-600 font-semibold", children: "Login here" })] }) })] }) }));
};
