import { useNavigate } from '@tanstack/react-router';
import React from 'react';

import { Button } from './ui/button';

export const BackToHome: React.FC = () => {
    const navigate = useNavigate();
    return (
        <Button
            onClick={() => navigate({ to: '/' })}
            className="mb-4"
        >
            ← Back to Tasks
        </Button>
    );
};
