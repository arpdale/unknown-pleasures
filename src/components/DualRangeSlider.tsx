import React, { useRef, useEffect, useState } from 'react';

interface DualRangeSliderProps {
    min: number;
    max: number;
    minValue: number;
    maxValue: number;
    onChange: (min: number, max: number) => void;
    theme?: 'light' | 'dark';
}

export function DualRangeSlider({
    min,
    max,
    minValue,
    maxValue,
    onChange,
    theme = 'light',
}: DualRangeSliderProps) {
    const [isDraggingMin, setIsDraggingMin] = useState(false);
    const [isDraggingMax, setIsDraggingMax] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);

    const getPercent = (value: number) => ((value - min) / (max - min)) * 100;

    const handleMouseDown = (type: 'min' | 'max') => (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        if (type === 'min') setIsDraggingMin(true);
        else setIsDraggingMax(true);
    };

    useEffect(() => {
        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!isDraggingMin && !isDraggingMax) return;
            if (!trackRef.current) return;

            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const rect = trackRef.current.getBoundingClientRect();
            const percent = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
            const value = Math.round(min + percent * (max - min));

            if (isDraggingMin) {
                const newMin = Math.min(value, maxValue - 1);
                onChange(newMin, maxValue);
            } else {
                const newMax = Math.max(value, minValue + 1);
                onChange(minValue, newMax);
            }
        };

        const handleUp = () => {
            setIsDraggingMin(false);
            setIsDraggingMax(false);
        };

        if (isDraggingMin || isDraggingMax) {
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('touchmove', handleMove);
            window.addEventListener('mouseup', handleUp);
            window.addEventListener('touchend', handleUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchend', handleUp);
        };
    }, [isDraggingMin, isDraggingMax, min, max, minValue, maxValue, onChange]);

    const minPercent = getPercent(minValue);
    const maxPercent = getPercent(maxValue);

    const trackColor = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200';
    const rangeColor = theme === 'dark' ? 'bg-white' : 'bg-black';
    const thumbColor = theme === 'dark' ? 'bg-white border-black' : 'bg-white border-gray-300';

    return (
        <div className="relative w-full h-6 flex items-center select-none" ref={trackRef}>
            {/* Track Background */}
            <div className={`absolute w-full h-1 rounded-full ${trackColor}`} />

            {/* Active Range */}
            <div
                className={`absolute h-1 rounded-full ${rangeColor}`}
                style={{
                    left: `${minPercent}%`,
                    width: `${maxPercent - minPercent}%`,
                }}
            />

            {/* Min Thumb */}
            <div
                className={`absolute w-5 h-5 rounded-full shadow-md cursor-pointer border ${thumbColor} flex items-center justify-center z-10`}
                style={{ left: `calc(${minPercent}% - 10px)` }}
                onMouseDown={handleMouseDown('min')}
                onTouchStart={handleMouseDown('min')}
            >
                <div className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-black' : 'bg-black'}`} />
            </div>

            {/* Max Thumb */}
            <div
                className={`absolute w-5 h-5 rounded-full shadow-md cursor-pointer border ${thumbColor} flex items-center justify-center z-10`}
                style={{ left: `calc(${maxPercent}% - 10px)` }}
                onMouseDown={handleMouseDown('max')}
                onTouchStart={handleMouseDown('max')}
            >
                <div className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-black' : 'bg-black'}`} />
            </div>
        </div>
    );
}
