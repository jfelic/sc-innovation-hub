import React from "react";
import { ComingSoon } from "@/components/ui/coming-soon";
import { Navbar } from "@/components/Navbar";

export default function ProfileSettingsPage() {
    return (
        <div>
            <Navbar />
            <ComingSoon />
            {/* No need to put footer here because it is in root */}
        </div>
    );
}