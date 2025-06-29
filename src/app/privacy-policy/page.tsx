import React from 'react';
import { Navbar } from '@/components/Navbar';
import { ComingSoon } from '@/components/ui/coming-soon';   

export default function PrivacyPolicy() {
    return (
        <div>
            <Navbar />
            <ComingSoon />
            {/* No need to put Footer here because it is in root */}
        </div>
    );
}