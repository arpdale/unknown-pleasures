import React, { useState } from 'react';
import { GeneratorParams } from '../lib/generator';
import { RefreshCw, Download, X, Settings2, Grid, Activity, Palette } from 'lucide-react';

interface MobileControlsProps {
    params: GeneratorParams;
    setParams: React.Dispatch<React.SetStateAction<GeneratorParams>>;
    onGenerate: () => void;
    onDownload: () => void;
}

type Category = 'canvas' | 'density' | 'peaks' | 'style' | null;

export function MobileControls({
    params,
    setParams,
    onGenerate,
    onDownload,
}: MobileControlsProps) {
    const [activeCategory, setActiveCategory] = useState<Category>(null);

    const handleChange = (key: keyof GeneratorParams, value: number) => {
        setParams((prev) => ({ ...prev, [key]: value }));
    };

    const categories = [
        { id: 'canvas', label: 'Canvas', icon: Grid },
        { id: 'density', label: 'Density', icon: Settings2 },
        { id: 'peaks', label: 'Peaks', icon: Activity },
        { id: 'style', label: 'Style', icon: Palette },
    ] as const;

    return (
        <>
            {/* Floating Action Buttons - Top Right */}
            <div className="fixed top-4 right-4 flex flex-col gap-3 z-50">
                <button
                    onClick={onGenerate}
                    className="p-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 active:scale-95 transition-all"
                    title="Regenerate"
                >
                    <RefreshCw className="w-6 h-6" />
                </button>
                <button
                    onClick={onDownload}
                    className="p-3 bg-white text-black border border-gray-200 rounded-full shadow-lg hover:bg-gray-50 active:scale-95 transition-all"
                    title="Download"
                >
                    <Download className="w-6 h-6" />
                </button>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-4 py-2 pb-safe z-50">
                <div className="flex justify-between items-center max-w-md mx-auto">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeCategory === cat.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <cat.icon className="w-6 h-6" />
                            <span className="text-[10px] font-medium uppercase tracking-wide">{cat.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Slide-up Drawer */}
            <div
                className={`fixed bottom-0 left-0 right-0 bg-black text-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.3)] transform transition-transform duration-300 ease-out z-40 ${activeCategory ? 'translate-y-0' : 'translate-y-full'
                    }`}
                style={{ paddingBottom: '80px' }} // Space for bottom nav
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                    <h3 className="text-lg font-bold capitalize">
                        {activeCategory || 'Controls'}
                    </h3>
                    <button
                        onClick={() => setActiveCategory(null)}
                        className="p-1 hover:bg-gray-800 rounded-full"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[50vh] overflow-y-auto">
                    {activeCategory === 'canvas' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex justify-between">
                                    <span>Width</span>
                                    <span>{params.width}px</span>
                                </label>
                                <input
                                    type="range"
                                    min="400"
                                    max="1200"
                                    step="50"
                                    value={params.width}
                                    onChange={(e) => handleChange('width', Number(e.target.value))}
                                    className="w-full accent-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex justify-between">
                                    <span>Height</span>
                                    <span>{params.height}px</span>
                                </label>
                                <input
                                    type="range"
                                    min="600"
                                    max="1600"
                                    step="50"
                                    value={params.height}
                                    onChange={(e) => handleChange('height', Number(e.target.value))}
                                    className="w-full accent-white"
                                />
                            </div>
                        </div>
                    )}

                    {activeCategory === 'density' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex justify-between">
                                    <span>Lines</span>
                                    <span>{params.numLines}</span>
                                </label>
                                <input
                                    type="range"
                                    min="40"
                                    max="150"
                                    value={params.numLines}
                                    onChange={(e) => handleChange('numLines', Number(e.target.value))}
                                    className="w-full accent-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex justify-between">
                                    <span>Spacing</span>
                                    <span>{params.lineSpacing}px</span>
                                </label>
                                <input
                                    type="range"
                                    min="2"
                                    max="12"
                                    step="0.5"
                                    value={params.lineSpacing}
                                    onChange={(e) => handleChange('lineSpacing', Number(e.target.value))}
                                    className="w-full accent-white"
                                />
                            </div>
                        </div>
                    )}

                    {activeCategory === 'peaks' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex justify-between">
                                    <span>Amplitude</span>
                                    <span>{params.maxAmplitude}px</span>
                                </label>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={params.maxAmplitude}
                                    onChange={(e) => handleChange('maxAmplitude', Number(e.target.value))}
                                    className="w-full accent-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex justify-between">
                                    <span>Min Peaks</span>
                                    <span>{params.numPeaksMin}</span>
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={params.numPeaksMin}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        handleChange('numPeaksMin', Math.min(val, params.numPeaksMax));
                                    }}
                                    className="w-full accent-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex justify-between">
                                    <span>Max Peaks</span>
                                    <span>{params.numPeaksMax}</span>
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={params.numPeaksMax}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        handleChange('numPeaksMax', Math.max(val, params.numPeaksMin));
                                    }}
                                    className="w-full accent-white"
                                />
                            </div>
                        </div>
                    )}

                    {activeCategory === 'style' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex justify-between">
                                    <span>Wave Frequency</span>
                                    <span>{params.waveFreq.toFixed(1)}</span>
                                </label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="5"
                                    step="0.1"
                                    value={params.waveFreq}
                                    onChange={(e) => handleChange('waveFreq', Number(e.target.value))}
                                    className="w-full accent-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex justify-between">
                                    <span>Noise Level</span>
                                    <span>{params.noiseLevel.toFixed(2)}</span>
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="2"
                                    step="0.05"
                                    value={params.noiseLevel}
                                    onChange={(e) => handleChange('noiseLevel', Number(e.target.value))}
                                    className="w-full accent-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex justify-between">
                                    <span>Stroke Width</span>
                                    <span>{params.strokeWidth.toFixed(1)}px</span>
                                </label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="4"
                                    step="0.1"
                                    value={params.strokeWidth}
                                    onChange={(e) => handleChange('strokeWidth', Number(e.target.value))}
                                    className="w-full accent-white"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
