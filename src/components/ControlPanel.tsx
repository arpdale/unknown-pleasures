import React from 'react';
import { GeneratorParams } from '../lib/generator';
import { RefreshCw, Download, Sliders } from 'lucide-react';

interface ControlPanelProps {
    params: GeneratorParams;
    setParams: React.Dispatch<React.SetStateAction<GeneratorParams>>;
    onGenerate: () => void;
    onDownload: () => void;
}

export function ControlPanel({
    params,
    setParams,
    onGenerate,
    onDownload,
}: ControlPanelProps) {
    const handleChange = (key: keyof GeneratorParams, value: number) => {
        setParams((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-6 space-y-8 h-fit overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Sliders className="w-6 h-6" />
                    Controls
                </h1>
                <div className="flex gap-2">
                    <button
                        onClick={onGenerate}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title="Regenerate with new seed"
                    >
                        <RefreshCw className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                        onClick={onDownload}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title="Download SVG"
                    >
                        <Download className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Canvas Size */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        Canvas
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-700">
                                Width: {params.width}px
                            </label>
                            <input
                                type="range"
                                min="400"
                                max="1200"
                                step="50"
                                value={params.width}
                                onChange={(e) => handleChange('width', Number(e.target.value))}
                                className="w-full accent-black"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-700">
                                Height: {params.height}px
                            </label>
                            <input
                                type="range"
                                min="600"
                                max="1600"
                                step="50"
                                value={params.height}
                                onChange={(e) => handleChange('height', Number(e.target.value))}
                                className="w-full accent-black"
                            />
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gray-200" />

                {/* Density */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        Density
                    </h3>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-700 flex justify-between">
                            <span>Lines</span>
                            <span>{params.numLines}</span>
                        </label>
                        <input
                            type="range"
                            min="40"
                            max="150"
                            value={params.numLines}
                            onChange={(e) => handleChange('numLines', Number(e.target.value))}
                            className="w-full accent-black"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-700 flex justify-between">
                            <span>Spacing</span>
                            <span>{params.lineSpacing}px</span>
                        </label>
                        <input
                            type="range"
                            min="2"
                            max="12"
                            step="0.5"
                            value={params.lineSpacing}
                            onChange={(e) =>
                                handleChange('lineSpacing', Number(e.target.value))
                            }
                            className="w-full accent-black"
                        />
                    </div>
                </div>

                <div className="h-px bg-gray-200" />

                {/* Peaks */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        Peaks
                    </h3>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-700 flex justify-between">
                            <span>Amplitude</span>
                            <span>{params.maxAmplitude}px</span>
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="100"
                            value={params.maxAmplitude}
                            onChange={(e) =>
                                handleChange('maxAmplitude', Number(e.target.value))
                            }
                            className="w-full accent-black"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-700">
                                Min Peaks: {params.numPeaksMin}
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
                                className="w-full accent-black"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-700">
                                Max Peaks: {params.numPeaksMax}
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
                                className="w-full accent-black"
                            />
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gray-200" />

                {/* Style */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        Style
                    </h3>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-700 flex justify-between">
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
                            className="w-full accent-black"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-700 flex justify-between">
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
                            className="w-full accent-black"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-700 flex justify-between">
                            <span>Stroke Width</span>
                            <span>{params.strokeWidth.toFixed(1)}px</span>
                        </label>
                        <input
                            type="range"
                            min="0.5"
                            max="4"
                            step="0.1"
                            value={params.strokeWidth}
                            onChange={(e) =>
                                handleChange('strokeWidth', Number(e.target.value))
                            }
                            className="w-full accent-black"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
