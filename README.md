# Stake Engine Slots - GPU-Accelerated Development

Comprehensive slot machine game development framework for Stake Engine with NVIDIA CUDA-optimized physics simulations, high-performance random number generation, and real-time 3D rendering.

## Overview

This project combines:
- **Math SDK**: CUDA-accelerated Python simulations for RNG, cascades, scatter mechanics, and tumble effects
- **Frontend SDK**: WebGL/Canvas rendering with RTX path-tracing optimization
- **Profiling Tools**: Nsight Graphics & Systems for GPU optimization

## Prerequisites

### Required NVIDIA Tools

#### 1. **CUDA Toolkit 13.1 Update 1** (2.3 GB)
- **Purpose**: GPU compilation, CuPy support, cuRAND library
- **Download**: https://developer.nvidia.com/cuda-downloads
- **Installation**: Standard installer for Windows 10/11 x86_64
- **After Install**: Add CUDA to PATH (default: `C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v13.1`)

#### 2. **CUDA-X Libraries**
- **cuRAND**: High-performance GPU random number generation (millions of RNG calls/sec)
- **RAPIDS**: GPU-accelerated DataFrame for PAR sheet analysis
- **cuSOLVER**: For matrix operations in optimization
- **Download**: Bundled with CUDA Toolkit

#### 3. **Nsight Graphics**
- **Purpose**: WebGL/Canvas profiling, draw call optimization
- **Download**: https://developer.nvidia.com/nsight-graphics
- **Use Case**: Debug frontend rendering bottlenecks

#### 4. **Nsight Systems**
- **Purpose**: System-wide CPU/GPU profiling
- **Download**: https://developer.nvidia.com/nsight-systems
- **Use Case**: End-to-end latency analysis (simulation → frontend)

#### 5. **RTX Kit** (Optional - for 3D slots)
- **Purpose**: AI-powered asset rendering, photorealistic symbols
- **Download**: https://developer.nvidia.com/rtx-kit

## Installation Guide

### Windows Setup

1. **Install CUDA Toolkit**
   ```bash
   # Run installer
   cuda_13.1.1_windows.exe
   
   # Verify installation
   nvcc --version
   ```

2. **Install Python Dependencies**
   ```bash
   # Create virtual environment
   python -m venv venv
   .\venv\Scripts\activate
   
   # Install GPU-accelerated libraries
   pip install cupy-cuda11x rapids-cuml numba
   
   # Data processing
   pip install numpy pandas polars
   ```

3. **Download Profiling Tools**
   - [Nsight Graphics](https://developer.nvidia.com/nsight-graphics)
   - [Nsight Systems](https://developer.nvidia.com/nsight-systems)

## Project Structure

```
stake-engine-slots/
├── math-sdk/                  # CUDA-optimized simulation engine
│   ├── rng/                   # cuRAND wrappers
│   ├── mechanics/             # Cascades, scatters, tumbles
│   ├── payouts/               # PAR calculation
│   └── simulations/           # 100k+ batch testing
├── frontend-sdk/              # WebGL/Canvas rendering
│   ├── renderer/              # RTX optimization
│   ├── assets/                # 3D models, shaders
│   └── performance/           # Profiling hooks
├── profiling/                 # Nsight configs
│   ├── graphics-profile.txt
│   └── systems-profile.txt
├── docs/                      # Setup guides, benchmarks
└── benchmarks/                # Performance test suites
```

## Quick Start

### Run RNG Simulation (100k spins)

```python
import cupy as cp
from cupy.random import RandomState

# GPU-accelerated RNG
rs = RandomState(seed=42)
spins = rs.randint(0, 32768, size=100000)  # 32k possible outcomes

print(f"100k spins in {time:.3f}ms")
```

### Profile Math SDK

```bash
# Nsight Systems: CPU/GPU timeline
nsys profile -o stake_math python -m pytest benchmarks/math_sdk/

# Analyze results
nsys stats stake_math.nsys-rep
```

### Profile Frontend Rendering

1. Launch slot game in browser
2. Open **Nsight Graphics → Tools → Debugging**
3. Capture frame → Analyze draw calls, texture bindings

## Performance Targets

| Component | Target | Tool |
|-----------|--------|------|
| RNG (1M calls) | < 1ms | cuRAND |
| Cascade sim (100k) | < 50ms | CUDA Kernel |
| Payout calc | < 5ms | cuSOLVER |
| Frontend frame | 60 FPS @ 1440p | Nsight Graphics |
| End-to-end latency | < 200ms | Nsight Systems |

## Development Workflow

1. **Math SDK Development**
   - Write Python → Compile to CUDA with CuPy
   - Test locally → Profile with `cupy.cuda.profiler`
   - Benchmark against CPU version

2. **Frontend Development**
   - WebGL rendering in Firefox/Chrome (ANGLE for debugging)
   - Capture frames with Nsight Graphics
   - Optimize shader performance

3. **Full Stack Testing**
   - Spin request → Math SDK → PAR calculation → Frontend render
   - Profile entire pipeline with Nsight Systems

## Resources

- [CUDA C++ Programming Guide](https://docs.nvidia.com/cuda/cuda-c-programming-guide/)
- [CuPy Documentation](https://docs.cupy.dev/)
- [Nsight Graphics User Guide](https://docs.nvidia.com/nsight-graphics/user-guide/)
- [Nsight Systems Documentation](https://docs.nvidia.com/nsight-systems/)

## Contributing

1. Profile any new mechanics with Nsight tools
2. Document GPU memory footprint
3. Target 60+ FPS for frontend features

## License

Proprietary - Stake Engine
