#!/usr/bin/env python3
"""
Generate a Joy Division "Unknown Pleasures" style SVG
Horizontal lines with Gaussian peak centered in the middle
Suitable for plotting with AxiDraw via Inkscape
"""

import random
import math
import sys

# Only import tkinter if needed (for GUI mode)
if len(sys.argv) <= 1 or sys.argv[1] != "--cli":
    try:
        import tkinter as tk
        from tkinter import ttk, filedialog
        HAS_TKINTER = True
    except ImportError:
        HAS_TKINTER = False
        print("Warning: tkinter not available. Use --cli flag for command line mode.")
else:
    HAS_TKINTER = False

def gaussian(x, center, sigma, amplitude):
    """Calculate Gaussian (bell curve) value"""
    return amplitude * math.exp(-((x - center) ** 2) / (2 * sigma ** 2))

def generate_joy_division_svg(
    width=600,
    height=800,
    num_lines=80,
    line_spacing=6,
    sigma=100,
    max_amplitude=40,
    noise_level=0.5,
    stroke_width=1.5,
    output_file="joy_division.svg"
):
    """
    Generate Joy Division style SVG with horizontal lines and centered Gaussian peak

    Args:
        width: SVG canvas width
        height: SVG canvas height
        num_lines: number of horizontal lines
        line_spacing: vertical spacing between lines
        sigma: Gaussian width (lower = sharper peak)
        max_amplitude: maximum height of the peak
        noise_level: amount of random noise
        stroke_width: thickness of the lines
        output_file: output filename
    """

    svg_lines = []
    svg_lines.append(f'<?xml version="1.0" encoding="UTF-8"?>')
    svg_lines.append(f'<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">')
    svg_lines.append(f'  <rect width="{width}" height="{height}" fill="white"/>')

    # Calculate starting position
    total_height = num_lines * line_spacing
    start_y = (height - total_height) / 2

    # Center of the image horizontally
    center_x = width / 2

    # Number of points per line for smooth curves
    num_points = 400

    # Generate each horizontal line (draw from top to bottom for proper occlusion)
    for line_idx in range(num_lines):
        # Calculate vertical position of this line
        base_y = start_y + line_idx * line_spacing

        # Generate random peaks for this line (4-9 peaks placed in center region)
        num_peaks = random.randint(4, 9)
        peaks = []

        # Center region is where peaks can be placed (using sigma to define region)
        center_region_start = 0.3
        center_region_end = 0.7

        for _ in range(num_peaks):
            # Random position within center region
            peak_pos = random.uniform(center_region_start, center_region_end)
            # Random width (sigma for this peak's gaussian)
            peak_width = random.uniform(0.01, 0.05)
            # Random amplitude for this peak
            peak_amp = random.uniform(0.3, 1.0) * max_amplitude
            peaks.append((peak_pos, peak_width, peak_amp))

        # Generate random parameters for continuous variation across full line
        # These create gentle waves that run the entire width
        full_width_waves = []
        for _ in range(3):
            wave_freq = random.uniform(1, 4)
            wave_phase = random.uniform(0, 2 * math.pi)
            wave_amp = random.uniform(0.5, 2.0)
            full_width_waves.append((wave_freq, wave_phase, wave_amp))

        # Generate points along the line
        line_points = []
        for i in range(num_points):
            # X position (normalized 0 to 1)
            x = (i / (num_points - 1)) * width
            x_norm = x / width

            # Start with continuous gentle waves across the entire line
            offset = 0
            for wave_freq, wave_phase, wave_amp in full_width_waves:
                offset += wave_amp * math.sin(wave_freq * 2 * math.pi * x_norm + wave_phase)

            # Add each random peak (these are concentrated in the center)
            for peak_pos, peak_width, peak_amp in peaks:
                # Gaussian peak centered at peak_pos
                peak_offset = peak_amp * math.exp(-((x_norm - peak_pos) ** 2) / (2 * peak_width ** 2))
                offset += peak_offset

            # Add subtle random noise for organic texture
            noise = random.gauss(0, noise_level)
            offset += noise

            # Final Y position (subtract offset to make peak go up)
            y = base_y - offset

            line_points.append(f"{x:.2f},{y:.2f}")

        # Build the path for this line
        line_path = "M " + " L ".join(line_points)

        # Create a closed path that fills the area BELOW the line
        # This creates a "mask" that occludes previous lines
        # Extend mask slightly beyond next line spacing for proper occlusion
        first_point = line_points[0].split(',')
        last_point = line_points[-1].split(',')
        mask_bottom = base_y + line_spacing * 1.5  # Extend 1.5x line spacing below

        fill_path = line_path + f" L {last_point[0]},{mask_bottom} L {first_point[0]},{mask_bottom} Z"

        # Draw filled polygon (white) to mask previous lines
        svg_lines.append(f'  <path d="{fill_path}" fill="white" stroke="none"/>')

        # Draw the line itself on top
        svg_lines.append(f'  <path d="{line_path}" fill="none" stroke="black" stroke-width="{stroke_width}" stroke-linecap="round" stroke-linejoin="round"/>')

    svg_lines.append('</svg>')

    # Write to file
    with open(output_file, 'w') as f:
        f.write('\n'.join(svg_lines))

    return output_file

class JoyDivisionUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Joy Division SVG Generator")
        self.root.geometry("550x750")

        # Default values (3:4 portrait aspect ratio)
        self.width_var = tk.IntVar(value=600)
        self.height_var = tk.IntVar(value=800)
        self.num_lines_var = tk.IntVar(value=80)
        self.line_spacing_var = tk.DoubleVar(value=6.0)
        self.sigma_var = tk.IntVar(value=100)
        self.max_amplitude_var = tk.IntVar(value=40)
        self.noise_level_var = tk.DoubleVar(value=0.5)
        self.stroke_width_var = tk.DoubleVar(value=1.5)
        self.seed_var = tk.IntVar(value=42)
        self.output_var = tk.StringVar(value="joy_division.svg")

        self.create_widgets()

    def create_widgets(self):
        # Title
        title = tk.Label(self.root, text="Joy Division SVG Generator",
                        font=("Arial", 16, "bold"))
        title.pack(pady=10)

        # Main frame
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.pack(fill=tk.BOTH, expand=True)

        # Canvas Size Section
        size_frame = ttk.LabelFrame(main_frame, text="Canvas Size", padding="10")
        size_frame.pack(fill=tk.X, pady=5)

        ttk.Label(size_frame, text="Width (px):").grid(row=0, column=0, sticky=tk.W)
        ttk.Entry(size_frame, textvariable=self.width_var, width=10).grid(row=0, column=1, padx=5)

        ttk.Label(size_frame, text="Height (px):").grid(row=1, column=0, sticky=tk.W)
        ttk.Entry(size_frame, textvariable=self.height_var, width=10).grid(row=1, column=1, padx=5)

        # Preset buttons (3:4 portrait aspect ratio)
        preset_frame = ttk.Frame(size_frame)
        preset_frame.grid(row=0, column=2, rowspan=2, padx=10)
        ttk.Button(preset_frame, text="600x800",
                  command=lambda: self.set_size(600, 800)).pack(side=tk.LEFT, padx=2)
        ttk.Button(preset_frame, text="900x1200",
                  command=lambda: self.set_size(900, 1200)).pack(side=tk.LEFT, padx=2)
        ttk.Button(preset_frame, text="1200x1600",
                  command=lambda: self.set_size(1200, 1600)).pack(side=tk.LEFT, padx=2)

        # Line Density Section
        density_frame = ttk.LabelFrame(main_frame, text="Line Density", padding="10")
        density_frame.pack(fill=tk.X, pady=5)

        ttk.Label(density_frame, text="Number of Lines:").grid(row=0, column=0, sticky=tk.W)
        ttk.Scale(density_frame, from_=40, to=150, variable=self.num_lines_var,
                 orient=tk.HORIZONTAL, length=250).grid(row=0, column=1, padx=5)
        ttk.Label(density_frame, textvariable=self.num_lines_var).grid(row=0, column=2)

        ttk.Label(density_frame, text="Line Spacing:").grid(row=1, column=0, sticky=tk.W)
        ttk.Scale(density_frame, from_=2, to=8, variable=self.line_spacing_var,
                 orient=tk.HORIZONTAL, length=250).grid(row=1, column=1, padx=5)
        spacing_label = ttk.Label(density_frame, text="4.0")
        spacing_label.grid(row=1, column=2)

        def update_spacing_label(*args):
            spacing_label.config(text=f"{self.line_spacing_var.get():.1f}")
        self.line_spacing_var.trace('w', update_spacing_label)

        # Peak Shape Section
        peak_frame = ttk.LabelFrame(main_frame, text="Peak Shape", padding="10")
        peak_frame.pack(fill=tk.X, pady=5)

        ttk.Label(peak_frame, text="Peak Width (σ):").grid(row=0, column=0, sticky=tk.W)
        ttk.Scale(peak_frame, from_=30, to=200, variable=self.sigma_var,
                 orient=tk.HORIZONTAL, length=250).grid(row=0, column=1, padx=5)
        ttk.Label(peak_frame, textvariable=self.sigma_var).grid(row=0, column=2)
        ttk.Label(peak_frame, text="(lower = sharper)").grid(row=0, column=3, padx=5)

        ttk.Label(peak_frame, text="Peak Height:").grid(row=1, column=0, sticky=tk.W)
        ttk.Scale(peak_frame, from_=10, to=80, variable=self.max_amplitude_var,
                 orient=tk.HORIZONTAL, length=250).grid(row=1, column=1, padx=5)
        ttk.Label(peak_frame, textvariable=self.max_amplitude_var).grid(row=1, column=2)

        # Noise Section
        noise_frame = ttk.LabelFrame(main_frame, text="Texture", padding="10")
        noise_frame.pack(fill=tk.X, pady=5)

        ttk.Label(noise_frame, text="Noise Level:").grid(row=0, column=0, sticky=tk.W)
        ttk.Scale(noise_frame, from_=0.0, to=5.0, variable=self.noise_level_var,
                 orient=tk.HORIZONTAL, length=250).grid(row=0, column=1, padx=5)
        noise_label = ttk.Label(noise_frame, text="1.5")
        noise_label.grid(row=0, column=2)

        def update_noise_label(*args):
            noise_label.config(text=f"{self.noise_level_var.get():.1f}")
        self.noise_level_var.trace('w', update_noise_label)

        ttk.Label(noise_frame, text="Random Seed:").grid(row=1, column=0, sticky=tk.W)
        ttk.Entry(noise_frame, textvariable=self.seed_var, width=10).grid(row=1, column=1, padx=5, sticky=tk.W)
        ttk.Button(noise_frame, text="New Random",
                  command=self.new_random_seed).grid(row=1, column=2, padx=5)

        # Stroke Section
        stroke_frame = ttk.LabelFrame(main_frame, text="Line Style", padding="10")
        stroke_frame.pack(fill=tk.X, pady=5)

        ttk.Label(stroke_frame, text="Stroke Width:").grid(row=0, column=0, sticky=tk.W)
        ttk.Scale(stroke_frame, from_=0.5, to=3.0, variable=self.stroke_width_var,
                 orient=tk.HORIZONTAL, length=250).grid(row=0, column=1, padx=5)
        stroke_label = ttk.Label(stroke_frame, text="1.5")
        stroke_label.grid(row=0, column=2)

        def update_stroke_label(*args):
            stroke_label.config(text=f"{self.stroke_width_var.get():.1f}")
        self.stroke_width_var.trace('w', update_stroke_label)

        # Output Section
        output_frame = ttk.LabelFrame(main_frame, text="Output", padding="10")
        output_frame.pack(fill=tk.X, pady=5)

        ttk.Label(output_frame, text="Filename:").grid(row=0, column=0, sticky=tk.W)
        ttk.Entry(output_frame, textvariable=self.output_var, width=30).grid(row=0, column=1, padx=5)
        ttk.Button(output_frame, text="Browse",
                  command=self.browse_output).grid(row=0, column=2, padx=5)

        # Generate Button
        generate_btn = ttk.Button(main_frame, text="Generate SVG",
                                 command=self.generate, style="Accent.TButton")
        generate_btn.pack(pady=20)

        # Status
        self.status_var = tk.StringVar(value="Ready to generate")
        status_label = ttk.Label(main_frame, textvariable=self.status_var,
                                foreground="green")
        status_label.pack()

    def set_size(self, width, height):
        self.width_var.set(width)
        self.height_var.set(height)

    def new_random_seed(self):
        self.seed_var.set(random.randint(1, 999999))

    def browse_output(self):
        filename = filedialog.asksaveasfilename(
            defaultextension=".svg",
            filetypes=[("SVG files", "*.svg"), ("All files", "*.*")],
            initialfile=self.output_var.get()
        )
        if filename:
            self.output_var.set(filename)

    def generate(self):
        try:
            # Set random seed
            random.seed(self.seed_var.get())

            # Generate SVG
            output_file = generate_joy_division_svg(
                width=self.width_var.get(),
                height=self.height_var.get(),
                num_lines=self.num_lines_var.get(),
                line_spacing=self.line_spacing_var.get(),
                sigma=self.sigma_var.get(),
                max_amplitude=self.max_amplitude_var.get(),
                noise_level=self.noise_level_var.get(),
                stroke_width=self.stroke_width_var.get(),
                output_file=self.output_var.get()
            )

            self.status_var.set(f"✓ Generated: {output_file}")

        except Exception as e:
            self.status_var.set(f"Error: {str(e)}")

def main():
    if not HAS_TKINTER:
        print("Error: tkinter is not available. Please install python-tk or use --cli mode.")
        print("  On macOS: brew install python-tk")
        print("  On Ubuntu: sudo apt-get install python3-tk")
        return

    root = tk.Tk()
    app = JoyDivisionUI(root)
    root.mainloop()

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--cli":
        # Command line mode
        random.seed(42)
        generate_joy_division_svg(
            width=600,
            height=800,
            num_lines=80,
            line_spacing=6,
            sigma=100,
            max_amplitude=40,
            noise_level=0.5,
            stroke_width=1.5,
            output_file="joy_division.svg"
        )
        print("Generated joy_division.svg")
        print("  600x800px (3:4 portrait), 80 lines")
        print("  Random peaks in center region (like original pulsar data)")
        print("  White background, black lines (ready for pen plotter)")
    else:
        # GUI mode
        main()
