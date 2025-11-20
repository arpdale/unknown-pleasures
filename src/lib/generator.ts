import { SeededRandom } from './random';

export interface GeneratorParams {
    width: number;
    height: number;
    numLines: number;
    lineSpacing: number;
    maxAmplitude: number;
    numPeaksMin: number;
    numPeaksMax: number;
    waveFreq: number;
    noiseLevel: number;
    strokeWidth: number;
    seed: number;
}

export function generateJoyDivision(params: GeneratorParams): string {
    const {
        width,
        height,
        numLines,
        lineSpacing,
        maxAmplitude,
        numPeaksMin,
        numPeaksMax,
        waveFreq,
        noiseLevel,
        strokeWidth,
        seed,
    } = params;

    const rng = new SeededRandom(seed);
    const numPoints = 400;

    const totalHeight = numLines * lineSpacing;
    const startY = (height - totalHeight) / 2;

    let paths = '';

    for (let lineIdx = 0; lineIdx < numLines; lineIdx++) {
        const baseY = startY + lineIdx * lineSpacing;

        // Generate random peaks for this line
        const numPeaks = rng.randint(numPeaksMin, numPeaksMax);
        const peaks: { pos: number; width: number; amp: number }[] = [];

        for (let p = 0; p < numPeaks; p++) {
            const peakPos = rng.uniform(0.3, 0.7);
            const peakWidth = rng.uniform(0.01, 0.05);
            const peakAmp = rng.uniform(0.3, 1.0) * maxAmplitude;
            peaks.push({ pos: peakPos, width: peakWidth, amp: peakAmp });
        }

        // Primary waves - low frequency, large amplitude
        const primaryWaves: { freq: number; phase: number; amp: number }[] = [];
        const numPrimary = 2 + Math.floor(rng.next() * 2); // 2-3 waves
        for (let w = 0; w < numPrimary; w++) {
            const freq = waveFreq * rng.uniform(0.7, 1.3);
            const wavePhase = rng.uniform(0, 2 * Math.PI);
            const waveAmp = rng.uniform(0.5, 2.0);
            primaryWaves.push({ freq, phase: wavePhase, amp: waveAmp });
        }

        // Secondary waves - medium frequency, medium amplitude
        const secondaryWaves: { freq: number; phase: number; amp: number }[] = [];
        const numSecondary = 2 + Math.floor(rng.next() * 2); // 2-3 waves
        for (let w = 0; w < numSecondary; w++) {
            const freq = waveFreq * rng.uniform(3, 6);
            const wavePhase = rng.uniform(0, 2 * Math.PI);
            const waveAmp = rng.uniform(0.3, 0.8);
            secondaryWaves.push({ freq, phase: wavePhase, amp: waveAmp });
        }

        // Tertiary waves - high frequency, small amplitude (replaces random noise)
        const tertiaryWaves: { freq: number; phase: number; amp: number }[] = [];
        const numTertiary = 3 + Math.floor(rng.next() * 3); // 3-5 waves
        for (let w = 0; w < numTertiary; w++) {
            const freq = rng.uniform(15, 30);
            const wavePhase = rng.uniform(0, 2 * Math.PI);
            const waveAmp = noiseLevel * rng.uniform(0.1, 0.3);
            tertiaryWaves.push({ freq, phase: wavePhase, amp: waveAmp });
        }

        // Generate points
        const linePoints: string[] = [];
        for (let i = 0; i < numPoints; i++) {
            const x = (i / (numPoints - 1)) * width;
            const xNorm = x / width;

            // Start with primary waves
            let offset = 0;
            for (const wave of primaryWaves) {
                offset += wave.amp * Math.sin(wave.freq * 2 * Math.PI * xNorm + wave.phase);
            }

            // Add secondary waves
            for (const wave of secondaryWaves) {
                offset += wave.amp * Math.sin(wave.freq * 2 * Math.PI * xNorm + wave.phase);
            }

            // Add tertiary waves (fine detail)
            for (const wave of tertiaryWaves) {
                offset += wave.amp * Math.sin(wave.freq * 2 * Math.PI * xNorm + wave.phase);
            }

            // Add peaks
            for (const peak of peaks) {
                const peakOffset =
                    peak.amp *
                    Math.exp(
                        -Math.pow(xNorm - peak.pos, 2) / (2 * peak.width * peak.width)
                    );
                offset += peakOffset;
            }

            const y = baseY - offset;
            linePoints.push(`${x.toFixed(2)},${y.toFixed(2)}`);
        }

        // Create line path
        const linePath = 'M ' + linePoints.join(' L ');

        // Create fill path (for occlusion)
        // Extend mask slightly beyond next line spacing for proper occlusion
        const firstPoint = linePoints[0].split(',');
        const lastPoint = linePoints[linePoints.length - 1].split(',');
        const maskBottom = baseY + lineSpacing * 1.5;
        const fillPath =
            linePath +
            ` L ${lastPoint[0]},${maskBottom} L ${firstPoint[0]},${maskBottom} Z`;

        // Add fill and stroke
        paths += `<path d="${fillPath}" fill="white" stroke="none"/>\n`;
        paths += `<path d="${linePath}" fill="none" stroke="black" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>\n`;
    }

    return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <rect width="${width}" height="${height}" fill="white"/>
        ${paths}
    </svg>`;
}
