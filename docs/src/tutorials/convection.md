# 1D Convection Equation

Consider the following 1D-convection equation with periodic boundary conditions.

```math
\begin{aligned}
&\frac{\partial u}{\partial t}+c \frac{\partial u}{\partial x}=0, x \in[0,1], t \in[0,1] \\
&u(x, 0)=sin(2\pi x) \\
\end{aligned}
```

First we define the PDE.

```@example convection
using NeuralPDE, Lux, Random, Sophon, IntervalSets, CairoMakie
using Optimization, OptimizationOptimJL, OptimizationOptimisers
using CUDA
CUDA.allowscalar(false)

@parameters x, t
@variables u(..)
Dₜ = Differential(t)
Dₓ = Differential(x)

c = 4
eq = Dₜ(u(x,t)) + c * Dₓ(u(x,t)) ~ 0
u_analytic(x,t) = sin(2π*(x-c*t))

domains = [x ∈ 0..1, t ∈ 0..1]

bcs = [u(x,0) ~ u_analytic(x,0)]

@named convection = PDESystem(eq, bcs, domains, [x,t], [u(x,t)])
```
## Imposing periodic boundary conditions
We will use [`BACON`](@ref) to impose the boundary conditions. To this end, we simply set `period` to be one.

```@example convection
chain = BACON(2,1; hidden_dims = 32, num_layers=5, period = 1, N = 5)
```

!!! note
    For demonstration purposes, the model is also periodic in time

```@example convection
discretization = PhysicsInformedNN(chain, QuasiRandomTraining(300); adaptive_loss = NonAdaptiveLoss(; bc_loss_weights = [100]))
prob = discretize(convection, discretization) 

@time res = Optimization.solve(prob, Adam(); maxiters = 2000)
```

Let's visualize the result.

```@example convection
phi = discretization.phi

xs, ts= [infimum(d.domain):0.01:supremum(d.domain) for d in domains]
u_pred = [sum(phi(gpu([x,t]),res.u)) for x in xs, t in ts]
u_real = u_analytic.(xs,ts')

fig, ax, hm = CairoMakie.heatmap(ts, xs, u_pred', axis=(xlabel="t", ylabel="x", title="c = $c"))
save("convection.png", fig); nothing # hide
```
![](convection.png)

This may not look so accurate, which is fine. What we want to show is that our model is indeed, periodic.

```@example convection
phi = discretization.phi

xs, ts= [infimum(d.domain):0.01:supremum(d.domain)*2 for d in domains]
u_pred = [sum(phi(gpu([x,t]),res.u)) for x in xs, t in ts]
u_real = u_analytic.(xs,ts')

fig, ax, hm = CairoMakie.heatmap(ts, xs, u_pred', axis=(xlabel="t", ylabel="x", title="c = $c"))
save("convection2.png", fig); nothing # hide
```
![](convection2.png)
## Respecting Causality is all you need
This is a time-dependent PDE, and our training process actually violates causality. Therefore we use [`CausalTraining`](@ref).

```@example convection
discretization = PhysicsInformedNN(chain, CausalTraining(300; epsilon = 0.1); adaptive_loss = NonAdaptiveLoss(; bc_loss_weights = [100]))
prob = discretize(convection, discretization) 

@time res = Optimization.solve(prob, Adam(); maxiters = 2000)
```

And now you have an astonishingly good result.

```@example convection
phi = discretization.phi

xs, ts= [infimum(d.domain):0.01:supremum(d.domain) for d in domains]
u_pred = [sum(phi(gpu([x,t]),res.u)) for x in xs, t in ts]
u_real = u_analytic.(xs,ts')

fig, ax, hm = CairoMakie.heatmap(ts, xs, u_pred', axis=(xlabel="t", ylabel="x", title="c = $c"))
ax2, hm2 = heatmap(fig[1,end+1], ts,xs, abs.(u_pred' .- u_real'), axis = (xlabel="t", ylabel="x", title="error"))
Colorbar(fig[:, end+1], hm2)

save("convection3.png", fig); nothing # hide
```
![](convection3.png)