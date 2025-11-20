'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MobileControls } from '@/components/MobileControls';
import { ControlPanel } from '@/components/ControlPanel';
import { Preview } from '@/components/Preview';
import { generateJoyDivision, GeneratorParams } from '@/lib/generator';

export default function Home() {
    const [params, setParams] = useState<GeneratorParams>({
        width: 600,
        height: 800,
        numLines: 80,
        lineSpacing: 6,
        maxAmplitude: 40,
        numPeaksMin: 4,
        numPeaksMax: 7,
        waveFreq: 2.0,
        noiseLevel: 0.3,
        strokeWidth: 1.5,
        seed: 42,
    });

    const [svgContent, setSvgContent] = useState<string>('');

    const generate = useCallback(() => {
        const svg = generateJoyDivision(params);
        setSvgContent(svg);
    }, [params]);

    // Regenerate when params change
    useEffect(() => {
        generate();
    }, [generate]);

    const handleNewSeed = () => {
        setParams((prev) => ({
            ...prev,
            seed: Math.floor(Math.random() * 1000000),
        }));
    };

    const handleDownload = () => {
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `joy_division_${params.seed}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <main className="min-h-screen bg-gray-50 font-[family-name:var(--font-geist-sans)]">
            {/* Mobile Layout */}
            <div className="lg:hidden h-screen flex flex-col">
                <div className="flex-1 p-4 pb-32 flex items-center justify-center">
                    <Preview svgContent={svgContent} />
                </div>
                <MobileControls
                    params={params}
                    setParams={setParams}
                    onGenerate={handleNewSeed}
                    onDownload={handleDownload}
                />
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex max-w-7xl mx-auto p-8 gap-8 min-h-screen">
                <div className="w-1/3 flex-shrink-0">
                    <ControlPanel
                        params={params}
                        setParams={setParams}
                        onGenerate={handleNewSeed}
                        onDownload={handleDownload}
                    />
                </div>
                <div className="w-2/3 flex-grow">
                    <Preview svgContent={svgContent} />
                </div>
            </div>
        </main>
    );
}
