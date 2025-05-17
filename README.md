
# FEM-Based Electrostatics Solver

A lightweight Python implementation of a 2D electrostatics solver using the Finite Element Method (FEM). The solver handles Dirichlet boundary conditions and solves the Poisson equation with spatially varying permittivity. Visualization is supported via `matplotlib` and `pyvista`.

## Features

- FEM formulation for 2D Poisson’s equation: ∇·(ε∇V) = -ρ
- Support for spatially varying permittivity (ε)
- Arbitrary charge distribution (ρ)
- Dirichlet boundary conditions on arbitrary nodes
- Mesh generation via `meshzoo`
- Visualization of potential and electric field using `matplotlib` and `pyvista`

## Installation

Ensure you have Python 3.8+ and install dependencies:

```bash
pip install numpy matplotlib scipy meshzoo pyvista
```

## Usage

Run the main script:

```bash
python fem_electrostatics.py
```

The solver will:
- Create a unit square mesh
- Apply Dirichlet boundary conditions
- Assemble and solve the FEM system
- Plot the potential and electric field

## File Structure

```
├── fem_electrostatics.py     # Main solver script
├── README.md                 # This file
```

## Implementation Highlights

- Linear triangular elements for 2D domain discretization
- Element stiffness matrix computed using constant gradients (linear shape functions)
- Global matrix assembly with boundary condition enforcement
- Electric field computed as negative gradient of potential

## Visualization

Electric potential is visualized using `matplotlib`. Electric field vectors are visualized with `pyvista` in 3D-like perspective.

## Example Output

- 2D contour plot of electric potential
- Vector field plot of electric field

## License

MIT License. See `LICENSE` for details.
