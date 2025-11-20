import React from 'react';

interface PreviewProps {
    svgContent: string;
}

export function Preview({ svgContent }: PreviewProps) {
    return (
        <div className="flex-1 flex items-center justify-center p-8 min-h-[500px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div
                className="w-full h-full flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: svgContent }}
            />
        </div>
    );
}
