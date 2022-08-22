var documenterSearchIndex = {"docs":
[{"location":"tutorials/wave/#D-Wave-Equation","page":"1D Wave Equation","title":"1D Wave Equation","text":"","category":"section"},{"location":"tutorials/wave/","page":"1D Wave Equation","title":"1D Wave Equation","text":"This example is taken from here.","category":"page"},{"location":"tutorials/wave/","page":"1D Wave Equation","title":"1D Wave Equation","text":"The wave is described by the below equation.","category":"page"},{"location":"tutorials/wave/","page":"1D Wave Equation","title":"1D Wave Equation","text":"beginaligned\nu_t t =c^2 u_x x \nu(0 t) =0 \nu(pi t) =0 \nu(x 0) =sin (x) \nu_t(x 0) =sin (x)\nendaligned","category":"page"},{"location":"tutorials/wave/","page":"1D Wave Equation","title":"1D Wave Equation","text":"where, the wave speed c=1 and the analytical solution to the above problem is given by sin (x)(sin (t)+cos (t)).","category":"page"},{"location":"tutorials/wave/","page":"1D Wave Equation","title":"1D Wave Equation","text":"using NeuralPDE, Lux, Random, Optimization, OptimizationOptimJL, OptimizationOptimisers, IntervalSets\nusing Random\n\n@parameters t, x, c\n@variables u(..)\nDxx = Differential(x)^2\nDtt = Differential(t)^2\nDt = Differential(t)\n\neq = Dtt(u(x,t)) ~ Dxx(u(x,t))\n\n# make domain\ndomain = [x ∈ Interval(0.0, π),\n          t ∈ Interval(0.0, 2π)]\n\n# boundary conditions\nbcs = [u(x, 0) ~ sin(x),\n       Dt(u(x, 0)) ~ sin(x),\n       u(0, t) ~ 0,\n       u(π, t) ~ 0]\n@named pde_system = PDESystem(eq,bcs,domain,[x,t],[u(x,t)])\n\n\nnet = FullyConnected(2, 1, sin; num_layers = 5, hidden_dims = 32)\nps = Lux.setup(Random.default_rng(), net)[1] |> Lux.ComponentArray |> gpu .|> Float64\ndiscretization = PhysicsInformedNN(net, QuasiRandomTraining(200); init_params = ps)\nphi = discretization.phi\n\nprob = discretize(pde_system, discretization)\n\nopt = Scheduler(Adam(), Sophon.Step(λ = 1e-3, γ = 0.95, step_sizes=100))\n@time res = Optimization.solve(prob,opt; maxiters=2000)","category":"page"},{"location":"tutorials/wave/","page":"1D Wave Equation","title":"1D Wave Equation","text":"Let's visualize the results.","category":"page"},{"location":"tutorials/wave/","page":"1D Wave Equation","title":"1D Wave Equation","text":"xs, ts= [infimum(d.domain):0.01:supremum(d.domain) for d in domain]\nu_analytic(x,t) = sin(x)*(sin(t)+cos(t))\npredict(x,t) = first(phi(gpu([x,t]),res.u))\nu_real = u_analytic.(xs,ts')\nu_pred = predict.(xs,ts')\n\nusing CairoMakie\naxis = (xlabel=\"x\", ylabel=\"t\", title=\"Analytical Solution\")\nfig, ax1, hm1 = CairoMakie.heatmap(xs, ts, u_real, axis=axis)\nColorbar(fig[:, end+1], hm1)\nax2, hm2= CairoMakie.heatmap(fig[1, end+1], xs, ts, u_pred, axis= merge(axis, (;title = \"Prediction\")))\nColorbar(fig[:, end+1], hm2)\nax3, hm3 = CairoMakie.heatmap(fig[1, end+1], xs, ts, u_pred-u_real, axis= merge(axis, (;title = \"Error\")))\nColorbar(fig[:, end+1], hm3)\n\nfig","category":"page"},{"location":"tutorials/wave/","page":"1D Wave Equation","title":"1D Wave Equation","text":"Let's see how causal training can help imporve the results.","category":"page"},{"location":"tutorials/wave/","page":"1D Wave Equation","title":"1D Wave Equation","text":"discretization = PhysicsInformedNN(net, CausalTraining(200;epsilon = 20); init_params = ps)\nphi = discretization.phi\n\nprob = discretize(pde_system, discretization)\n@time res = Optimization.solve(prob,opt; maxiters=2000)","category":"page"},{"location":"tutorials/wave/","page":"1D Wave Equation","title":"1D Wave Equation","text":"xs, ts= [infimum(d.domain):0.01:supremum(d.domain) for d in domain]\nu_analytic(x,t) = sin(x)*(sin(t)+cos(t))\npredict(x,t) = first(phi([x,t],res.u))\nu_real = u_analytic.(xs,ts')\nu_pred = predict.(xs,ts')\nusing CairoMakie\naxis = (xlabel=\"x\", ylabel=\"t\", title=\"Analytical Solution\")\nfig, ax1, hm1 = CairoMakie.heatmap(xs, ts, u_real, axis=axis)\nColorbar(fig[:, end+1], hm1)\nax2, hm2= CairoMakie.heatmap(fig[1, end+1], xs, ts, u_pred, axis= merge(axis, (;title = \"Prediction\")))\nColorbar(fig[:, end+1], hm2)\nax3, hm3 = CairoMakie.heatmap(fig[1, end+1], xs, ts, u_pred-u_real, axis= merge(axis, (;title = \"Error\")))\nColorbar(fig[:, end+1], hm3)\n\nfig","category":"page"},{"location":"tutorials/discontinuous/#Fitting-a-nonlinear-discontinuous-function","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"","category":"section"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"This example is taken from here.","category":"page"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"The following  discontinuous  function  with  discontinuity  at x=0  location  is approximated by Siren.","category":"page"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"u(x)= begincases02 sin (18 x)  text  if  x leq 0  1+03 x cos (54 x)  text  otherwise endcases","category":"page"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"The domain is -11. The number of training points used is 300.","category":"page"},{"location":"tutorials/discontinuous/#Import-pacakges","page":"Fitting a nonlinear discontinuous function","title":"Import pacakges","text":"","category":"section"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"using Lux, Sophon\nusing NNlib, Optimisers, Plots, Random, Statistics, Zygote","category":"page"},{"location":"tutorials/discontinuous/#Dataset","page":"Fitting a nonlinear discontinuous function","title":"Dataset","text":"","category":"section"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"function u(x)\n    if x <= 0\n        return 0.2 * sin(18 * x)\n    else\n        return 1 + 0.3 * x * cos(54 * x)\n    end\nend\n\nfunction generate_data(n=300)\n    x = reshape(collect(range(-1.0f0, 1.0f0, n)), (1, n))\n    y = u.(x)\n    return (x, y)\nend","category":"page"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"Let's visualize the data.","category":"page"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"x, y = generate_data()\nPlots.plot(vec(x), vec(y),label=false)\nsavefig(\"u.svg\"); nothing # hide","category":"page"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"(Image: )","category":"page"},{"location":"tutorials/discontinuous/#Model","page":"Fitting a nonlinear discontinuous function","title":"Model","text":"","category":"section"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"We use four hidden layers with 50 neurons in each.","category":"page"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"model = Siren(1,50,50,50,50,1)","category":"page"},{"location":"tutorials/discontinuous/#Train-the-model","page":"Fitting a nonlinear discontinuous function","title":"Train the model","text":"","category":"section"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"function train(model)\n    ps, st = Lux.setup(Random.default_rng(), model)\n    opt = Adam()\n    st_opt = Optimisers.setup(opt,ps)\n    function loss(model, ps, st, x, y)\n        y_pred, _ = model(x, ps, st)\n        mes = mean(abs2, y_pred .- y)\n        return mes\n    end\n\n    for i in 1:2000\n        gs = gradient(p->loss(model,p,st,x,y), ps)[1]\n        st_opt, ps = Optimisers.update(st_opt, ps, gs)\n        if i % 100 == 1 || i == 100\n            println(\"Epoch $i ||  \", loss(model,ps,st,x,y))\n        end\n    end\n    return ps, st\nend\n","category":"page"},{"location":"tutorials/discontinuous/#Results","page":"Fitting a nonlinear discontinuous function","title":"Results","text":"","category":"section"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"@time ps, st = train(model)\ny_pred = model(x,ps,st)[1]\nPlots.plot(vec(x), vec(y_pred),label=\"Prediction\",line = (:dot, 4))\nPlots.plot!(vec(x), vec(y),label=\"Exact\",legend=:topleft)\nsavefig(\"result.svg\"); nothing # hide","category":"page"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"(Image: )","category":"page"},{"location":"tutorials/discontinuous/#Gaussian-activation-function","page":"Fitting a nonlinear discontinuous function","title":"Gaussian activation function","text":"","category":"section"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"We can also try using a fully connected net with the gaussian activation function.","category":"page"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"model = FullyConnected((1,50,50,50,50,1), gaussian)","category":"page"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"@time ps, st = train(model)\ny_pred = model(x,ps,st)[1]\nPlots.plot(vec(x), vec(y_pred),label=\"Prediction\",line = (:dot, 4))\nPlots.plot!(vec(x), vec(y),label=\"Exact\",legend=:topleft)\nsavefig(\"result2.svg\"); nothing # hide","category":"page"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"(Image: )","category":"page"},{"location":"tutorials/discontinuous/#Quadratic-activation-function","page":"Fitting a nonlinear discontinuous function","title":"Quadratic activation function","text":"","category":"section"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"quadratic is much cheaper to compute compared to the Gaussain activation function.","category":"page"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"model = FullyConnected((1,50,50,50,50,1), quadratic)","category":"page"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"@time ps, st = train(model)\ny_pred = model(x,ps,st)[1]\nPlots.plot(vec(x), vec(y_pred),label=\"Prediction\",line = (:dot, 4))\nPlots.plot!(vec(x), vec(y),label=\"Exact\",legend=:topleft)\nsavefig(\"result3.svg\"); nothing # hide","category":"page"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"(Image: )","category":"page"},{"location":"tutorials/discontinuous/#An-activation-function-I-designed","page":"Fitting a nonlinear discontinuous function","title":"An activation function I designed","text":"","category":"section"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"model = FullyConnected((1,50,50,50,50,1), wu)","category":"page"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"@time ps, st = train(model)\ny_pred = model(x,ps,st)[1]\nPlots.plot(vec(x), vec(y_pred),label=\"Prediction\",line = (:dot, 4))\nPlots.plot!(vec(x), vec(y),label=\"Exact\",legend=:topleft)\nsavefig(\"result4.svg\"); nothing # hide","category":"page"},{"location":"tutorials/discontinuous/","page":"Fitting a nonlinear discontinuous function","title":"Fitting a nonlinear discontinuous function","text":"(Image: )","category":"page"},{"location":"tutorials/ks/#This-does-not-look-right-!","page":"-","title":"This does not look right !","text":"","category":"section"},{"location":"tutorials/ks/","page":"-","title":"-","text":"using NeuralPDE, Lux, ModelingToolkit, Optimization, OptimizationOptimJL, Sophon, OptimizationOptimisers\nimport ModelingToolkit: Interval, infimum, supremum\n\n@parameters x, t\n@variables u(..)\nDt = Differential(t)\nDx = Differential(x)\nDx2 = Differential(x)^2\nDx3 = Differential(x)^3\nDx4 = Differential(x)^4\n\nα = 1\nβ = 4\nγ = 1\neq = Dt(u(x,t)) + u(x,t)*Dx(u(x,t)) + α*Dx2(u(x,t)) + β*Dx3(u(x,t)) + γ*Dx4(u(x,t)) ~ 0\n\nu_analytic(x,t;z = -x/2+t) = 11 + 15*tanh(z) -15*tanh(z)^2 - 15*tanh(z)^3\ndu(x,t;z = -x/2+t) = 15/2*(tanh(z) + 1)*(3*tanh(z) - 1)*sech(z)^2\n\nbcs = [u(x,0) ~ u_analytic(x,0),\n       u(-10,t) ~ u_analytic(-10,t),\n       u(10,t) ~ u_analytic(10,t),\n       Dx(u(-10,t)) ~ du(-10,t),\n       Dx(u(10,t)) ~ du(10,t)]\n\n# Space and time domains\ndomains = [x ∈ Interval(-10.0,10.0),\n           t ∈ Interval(0.0,1.0)]\n\n# Neural network\nchain = FullyConnected(2,1, tanh; num_layers = 4, hidden_dims = 16)\nps = Lux.setup(Random.default_rng(), chain)[1] |> Lux.ComponentArray |> gpu .|> Float64\ndiscretization = PhysicsInformedNN(chain, CausalTraining(200;epsilon=1); init_params = ps)\n@named pde_system = PDESystem(eq,bcs,domains,[x,t],[u(x, t)])\nprob = discretize(pde_system,discretization)\n\ncallback = function (p,l)\n    println(\"Current loss is: $l\")\n    return false\nend\n\nopt = Adam()\nres = Optimization.solve(prob,opt; callback = callback, maxiters=2000)\nphi = discretization.phi","category":"page"},{"location":"tutorials/ks/","page":"-","title":"-","text":"using Plots\n\nxs,ts = [infimum(d.domain):0.1:supremum(d.domain) for d in domains]\n\nu_predict = [[first(phi([x,t],res.u)) for x in xs] for t in ts]\nu_real = [[u_analytic(x,t) for x in xs] for t in ts]\ndiff_u = [[abs(u_analytic(x,t) -first(phi([x,t],res.u)))  for x in xs] for t in ts]\n\np1 =plot(xs,u_predict,title = \"predict\")\np2 =plot(xs,u_real,title = \"analytic\")\np3 =plot(xs,diff_u,title = \"error\")\nplot(p1,p2,p3)","category":"page"},{"location":"tutorials/convection/#D-Convection-Equation","page":"1D Convection Equation","title":"1D Convection Equation","text":"","category":"section"},{"location":"tutorials/convection/","page":"1D Convection Equation","title":"1D Convection Equation","text":"Consider the following 1D-convection equation","category":"page"},{"location":"tutorials/convection/","page":"1D Convection Equation","title":"1D Convection Equation","text":"beginaligned\nfracpartial upartial t+c fracpartial upartial x=0 x in01 t in01 \nu(x 0)=sin(2pi x) \nu(0t) = -sin(2pi ct)\nu(1t) = -sin(2pi ct)\nendaligned","category":"page"},{"location":"tutorials/convection/","page":"1D Convection Equation","title":"1D Convection Equation","text":"where c = 502pi. First we solve it with QuasiRandomTraining.","category":"page"},{"location":"tutorials/convection/","page":"1D Convection Equation","title":"1D Convection Equation","text":"using NeuralPDE, Lux, Random, Sophon, IntervalSets, CairoMakie\nusing Optimization, OptimizationOptimJL, OptimizationOptimisers\nusing CUDA\nCUDA.allowscalar(false)\n\n@parameters x, t\n@variables u(..)\nDₜ = Differential(t)\nDₓ = Differential(x)\n\nβ = 50\nc = β/2π\neq = Dₜ(u(x,t)) + c * Dₓ(u(x,t)) ~ 0\nu_analytic(x,t) = sin(2π*(x-c*t))\n\ndomains = [x ∈ 0..1, t ∈ 0..1]\n\nbcs = [u(0,t) ~ u_analytic(0,t),\n       u(1,t) ~ u_analytic(1,t),\n       u(x,0) ~ u_analytic(x,0)]\n\n@named convection = PDESystem(eq, bcs, domains, [x,t], [u(x,t)])\n\nchain = Siren(2, 1; num_layers = 5, hidden_dims = 50, omega = 1.0f0)\nps = Lux.initialparameters(Random.default_rng(), chain) |> GPUComponentArray64\ndiscretization = PhysicsInformedNN(chain, QuasiRandomTraining(100); init_params=ps, adaptive_loss = NonAdaptiveLoss(pde_loss_weights = 1, bc_loss_weights = 100), order = 2)\nprob = discretize(convection, discretization)\n\n@time res = Optimization.solve(prob, Adam(); maxiters = 3000)","category":"page"},{"location":"tutorials/convection/","page":"1D Convection Equation","title":"1D Convection Equation","text":"Let's visualize the result.","category":"page"},{"location":"tutorials/convection/","page":"1D Convection Equation","title":"1D Convection Equation","text":"phi = discretization.phi\n\nxs, ts= [infimum(d.domain):0.01:supremum(d.domain) for d in domains]\nu_pred = [sum(phi(gpu([x,t]),res.u)) for x in xs, t in ts]\nu_real = u_analytic.(xs,ts')\n\naxis = (xlabel=\"t\", ylabel=\"x\", title=\"β = $β\")\nfig, ax, hm = CairoMakie.heatmap(ts, xs, u_pred', axis=axis)\nax2, hm2 = heatmap(fig[1,end+1], ts,xs, abs.(u_pred' .- u_real'), axis = (xlabel=\"t\", ylabel=\"x\", title=\"error\"))\nColorbar(fig[:, end+1], hm2)\n\nsave(\"convection.png\", fig); nothing # hide","category":"page"},{"location":"tutorials/convection/","page":"1D Convection Equation","title":"1D Convection Equation","text":"(Image: )","category":"page"},{"location":"tutorials/convection/#Compared-to-Method-of-Lines","page":"1D Convection Equation","title":"Compared to Method of Lines","text":"","category":"section"},{"location":"tutorials/convection/","page":"1D Convection Equation","title":"1D Convection Equation","text":"using MethodOfLines\ndx = 0.001\norder = 4\nmol_discretization = MOLFiniteDifference([x => dx], t, approx_order = order)\n\n# Convert the PDE problem into an ODE problem\nprob = discretize(convection,mol_discretization)\n\n# Solve ODE problem\nusing OrdinaryDiffEq\nsol = solve(prob, Tsit5(), saveat=0.001)\n\ngrid = get_discrete(convection, mol_discretization)\ndiscrete_x = grid[x]\ndiscrete_t = sol[t]\n\nsolu = [map(d -> sol[d][i], grid[u(x, t)]) for i in 1:length(sol[t])]\nu_pred = hcat(solu...)\n\nfig_, ax, hm = CairoMakie.heatmap(ts, xs, u_pred', axis=axis)\nax2, hm2 = heatmap(fig_[1,end+1], ts,xs, abs.(u_pred' .- u_analytic.(discrete_x, discrete_t')'), axis = (xlabel=\"t\", ylabel=\"x\", title=\"error\"))\nColorbar(fig_[:, end+1], hm2)\nsave(\"convection2.png\", fig_); nothing # hide","category":"page"},{"location":"tutorials/convection/","page":"1D Convection Equation","title":"1D Convection Equation","text":"(Image: )","category":"page"},{"location":"tutorials/poisson/#D-Poisson's-Equation","page":"1D Poisson's Equation","title":"1D Poisson's Equation","text":"","category":"section"},{"location":"tutorials/poisson/","page":"1D Poisson's Equation","title":"1D Poisson's Equation","text":"This example is taken from here. Consider a simple 1D Poisson’s equation with Dirichlet boundary conditions. The solution is given by","category":"page"},{"location":"tutorials/poisson/","page":"1D Poisson's Equation","title":"1D Poisson's Equation","text":"u(x)=sin (2 pi x)+01 sin (50 pi x)","category":"page"},{"location":"tutorials/poisson/","page":"1D Poisson's Equation","title":"1D Poisson's Equation","text":"using NeuralPDE, IntervalSets, Lux, Sophon\nusing Optimization, OptimizationOptimisers, OptimizationOptimJL\nusing CairoMakie\n\n@parameters x\n@variables u(..)\nDₓ² = Differential(x)^2\n\nf(x) = -4 * π^2 * sin(2 * π * x) - 250 * π^2 * sin(50 * π * x)\neq = Dₓ²(u(x)) ~ f(x)\ndomain = [x ∈ 0 .. 1]\nbcs = [u(0) ~ 0, u(1) ~ 0]\n\n@named poisson = PDESystem(eq, bcs, domain, [x], [u(x)])\n\nchain = Siren(1, 32, 32, 32, 32, 1)\ndiscretization = PhysicsInformedNN(chain,  GridTraining(0.01))\nprob = discretize(poisson, discretization)\n\nres = Optimization.solve(prob, Adam(5.0f-3); maxiters=2000)\n\nprob = remake(prob; u0=res.u)\nres = Optimization.solve(prob, LBFGS(); maxiters=1000)\n\nusing CairoMakie\nphi = discretization.phi\nxs = 0:0.001:1\nu_true = @. sin(2 * pi * xs) + 0.1 * sin(50 * pi * xs)\nus = phi(xs', res.u)\nfig = Figure()\naxis = Axis(fig[1, 1])\nlines!(xs, u_true; label=\"Ground truth\")\nlines!(xs, vec(us); label=\"prediction\")\naxislegend(axis)\nsave(\"result.png\", fig); nothing # hide","category":"page"},{"location":"tutorials/poisson/","page":"1D Poisson's Equation","title":"1D Poisson's Equation","text":"(Image: )","category":"page"},{"location":"tutorials/poisson/#Compute-the-relative-L2-error","page":"1D Poisson's Equation","title":"Compute the relative L2 error","text":"","category":"section"},{"location":"tutorials/poisson/","page":"1D Poisson's Equation","title":"1D Poisson's Equation","text":"using Integrals\n\nu_analytical(x,p) = sin.(2 * pi .* x) + 0.1 * sin.(50 * pi .* x)\nerror(x,p) = abs2.(vec(phi([x;;],res.u)) .- u_analytical(x,p))\n\nrelative_L2_error = solve(IntegralProblem(error,0,1),HCubatureJL(),reltol=1e-3,abstol=1e-3) ./ solve(IntegralProblem((x,p) -> abs2.(u_analytical(x,p)),0, 1),HCubatureJL(),reltol=1e-3,abstol=1e-3)","category":"page"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = Sophon","category":"page"},{"location":"#Sophon","page":"Home","title":"Sophon","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Documentation for Sophon.","category":"page"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [Sophon]","category":"page"},{"location":"#Sophon.CausalTraining","page":"Home","title":"Sophon.CausalTraining","text":"CausalTraining(points; epsilon, bcs_points=points, sampling_alg=LatinHypercubeSample())\n\nKeyword arguments\n\nepsilon: How much you respect causality. If epsilon is 0, then it falls back to QuasiRandomTraining. You can also pass in a AbstractSchedule.\n\nReferences\n\n[1] Wang S, Sankaran S, Perdikaris P. Respecting causality is all you need for training physics-informed neural networks[J]. arXiv preprint arXiv:2203.07404, 2022.\n\n\n\n\n\n","category":"type"},{"location":"#Sophon.EvoTraining","page":"Home","title":"Sophon.EvoTraining","text":"EvoTraining(points; sampling_alg=LatinHypercubeSample(), bcs_points=points, ϵ = 100, η = 1e-3,\nΔ = 0.1)\n\nbeta_i+1=beta_i+eta e^-epsilon mathcalL_r^g(theta)\n\nKeyword Arguments\n\nϵ:  Tolerance that controls how low the PDE loss needs to be before the gate shifts to the right.\nη: The learning rate of updating β that controls how fast the gate should propagate.\nΔ: The maximum allowed magnitude of update of β.\nλ: The weights of the initial and boundary conditions.\n\nReferences\n\n[1] Daw A, Bu J, Wang S, et al. Rethinking the Importance of Sampling in Physics-informed Neural Networks[J]. arXiv preprint arXiv:2207.02338, 2022.\n\n\n\n\n\n","category":"type"},{"location":"#Sophon.FourierFeature","page":"Home","title":"Sophon.FourierFeature","text":"FourierFeature(in_dims::Int, modes::NTuple{N,Pair{S,T}}) where {N,S,T<:Int}\n\nFourier Feature Network.\n\nphi^(i)(x)=leftsin left(2 pi W^(i) xright)  cos 2 pi W^(i) xright quad W^(i) sim mathcalNleft(0 sigma^(i)right)\n\nArguments\n\nin_dims: Number of the input dimensions.\nmodes: A tuple of pairs of std => out_dims, where std is the standard deviation of the Gaussian distribution, and out_dims is the corresponding number of output dimensions.\n\nInputs\n\nx: An an AbstractArray with size(x, 1) == in_dims.\n\nReturns\n\nAn AbstractArray with size(y, 1) == sum(last(modes) * 2).\nThe states of the modes.\n\nStates\n\nStates of each mode wrapped in a NamedTuple with fields = mode_1, mode_2, ..., mode_N.\n\nExamples\n\njulia> f = FourierFeature(2, (1 => 3, 50 => 4))\nFourierFeature(2 => 14)\n\njulia> ps, st = Lux.setup(rng, f)\n(NamedTuple(), (mode_1 = Float32[0.7510394 0.0678698; -1.6466209 -0.08511321; -0.4704813 2.0663197], mode_2 = Float32[-98.90031 -42.593884; 110.35572 15.565719; 81.60114 51.257904; -0.53021294 15.216658]))\n\njulia> st\n(mode_1 = Float32[0.7510394 0.0678698; -1.6466209 -0.08511321; -0.4704813 2.0663197], mode_2 = Float32[-98.90031 -42.593884; 110.35572 15.565719; 81.60114 51.257904; -0.53021294 15.216658])\n\nReferences\n\n[1] Tancik, Matthew, et al. “Fourier features let networks learn high frequency functions in low dimensional domains.” Advances in Neural Information Processing Systems 33 (2020): 7537-7547.\n\n\n\n\n\n","category":"type"},{"location":"#Sophon.PINNAttention","page":"Home","title":"Sophon.PINNAttention","text":"PINNAttention(H_net, U_net, V_net, fusion_layers)\nPINNAttention(in_dims::Int, out_dims::Int, activation::Function=sin;\n              hidden_dims::Int, num_layers::Int)\n\nThe output dimesion of H_net and the input dimension of fusion_layers must be the same. For the second and the third constructor, Dense layers is used for H_net, U_net, and V_net. Note that the first constructer does not contain the output layer.\n\n                 x → U_net → u                           u\n                               ↘                           ↘\nx → H_net →  h1 → fusionlayer1 → connection → fusionlayer2 → connection\n                               ↗                           ↗\n                 x → V_net → v                           v\n\nArguments\n\n- `H_net`: `AbstractExplicitLayer`.\n- `U_net`: `AbstractExplicitLayer`.\n- `V_net`: `AbstractExplicitLayer`.\n- `fusion_layers`: `Chain`.\n\nKeyword Arguments\n\nnum_layers: The number of hidden layers.\nhidden_dims: The number of hidden dimensions of each hidden layer.\n\nReferences\n\n[1] Wang, Sifan, Yujun Teng, and Paris Perdikaris. \"Understanding and mitigating gradient flow pathologies in physics-informed neural networks.\" SIAM Journal on Scientific Computing 43.5 (2021): A3055-A3081\n\n\n\n\n\n","category":"type"},{"location":"#Sophon.RADTraining","page":"Home","title":"Sophon.RADTraining","text":"References\n\n[1] Wu, Chenxi, et al. \"A comprehensive study of non-adaptive and residual-based adaptive sampling for physics-informed neural networks.\" arXiv preprint arXiv:2207.10289 (2022).\n\n\n\n\n\n","category":"type"},{"location":"#Sophon.RBF","page":"Home","title":"Sophon.RBF","text":"RBF(in_dims::Int, out_dims::Int, num_centers::Int=out_dims; sigma::AbstractFloat=0.2f0)\n\nRadial Basis Fuction Network.\n\n\n\n\n\n","category":"type"},{"location":"#Sophon.Sine","page":"Home","title":"Sophon.Sine","text":"Sine(in_dims::Int, out_dims::Int, activation=sin; is_first::Bool = false, omega::AbstractFloat = 30f0)\n\nSinusoidal layer.\n\nExample\n\ns = Sine(2, 2; is_first=true) # first layer\ns = Sine(2, 2) # hidden layer\ns = Sine(2, 2, identity) # last layer\n\n\n\n\n\n","category":"type"},{"location":"#Sophon.TriplewiseFusion","page":"Home","title":"Sophon.TriplewiseFusion","text":"TriplewiseFusion(connection, layers...)\n\n         u1                    u2\n            ↘                     ↘\nh1 → layer1 → connection → layer2 → connection\n            ↗                     ↗\n         v1                    v2\n\nArguments\n\nconnection: A functio takes 3 inputs and combines them.\nlayers: AbstractExplicitLayers or a Chain.\n\nInputs\n\nLayer behaves differently based on input type:\n\nA tripe of (h, u, v), where u and v itself are tuples of length N, the layers is also a tuple of length N. The computation is as follows\n\nfor i in 1:N\n    h = connection(layers[i](h), u[i], v[i])\nend\n\nA triple of (h, u, v), where u and v are AbstractArrays.\n\nfor i in 1:N\n    h = connection(layers[i](h), u, v)\nend\n\nParameters\n\nParameters of each layer wrapped in a NamedTuple with fields = layer_1, layer_2, ..., layer_N\n\nStates\n\nStates of each layer wrapped in a NamedTuple with fields = layer_1, layer_2, ..., layer_N\n\n\n\n\n\n","category":"type"},{"location":"#Sophon.FourierAttention","page":"Home","title":"Sophon.FourierAttention","text":"FourierAttention(in_dims::Int, out_dims::Int, activation::Function=sin;\n                 hidden_dims::Int=512, num_layers::Int=6, modes::NTuple)\n\nx → [FourierFeature(x); x] → PINNAttention\n\nArguments\n\nin_dims: The input dimension.\n\nKeyword Arguments\n\nmodes: A tuple of pairs of random frequencies and the number of samples.\nhidden_dim: The hidden dimension of each hidden layer.\nnum_layers: The number of hidden layers.\n\nExamples\n\njulia> FourierAttention(3, 1, sin; hidden_dims=10, num_layers=3,\n                        modes=(1 => 10, 10 => 10, 50 => 10))\nChain(\n    layer_1 = SkipConnection(\n        FourierFeature(3 => 60),\n        vcat\n    ),\n    layer_2 = PINNAttention(\n        H_net = Dense(63 => 10, sin),   # 640 parameters\n        U_net = Dense(63 => 10, sin),   # 640 parameters\n        V_net = Dense(63 => 10, sin),   # 640 parameters\n        fusion = TriplewiseFusion(\n            layers = (layer_1 = Dense(10 => 10, sin), layer_2 = Dense(10 => 10, sin), layer_3 = Dense(10 => 10, sin), layer_4 = Dense(10 => 1)),  # 341 parameters\n        ),\n    ),\n)         # Total: 2_261 parameters,\n          #        plus 90 states, summarysize 176 bytes.\n\n\n\n\n\n","category":"function"},{"location":"#Sophon.FullyConnected-Union{Tuple{T}, Tuple{N}, Tuple{Tuple{Vararg{T, N}}, Function}} where {N, T<:Int64}","page":"Home","title":"Sophon.FullyConnected","text":"FullyConnected(layer_dims::NTuple{N, Int}, activation; outermost = true)\nFullyConnected(in_dims::Int, out_dims::Int, activation::Function;\n               hidden_dims::Int, num_layers::Int, outermost=true)\n\nCreate fully connected layers.\n\nArguments\n\nlayer_dims: Number of dimensions of each layer.\nhidden_dims: Number of hidden dimensions.\nnum_layers: Number of layers.\nactivation: Activation function.\n\nKeyword Arguments\n\noutermost: Whether to use activation function for the last layer. If false, the activation function is applied to the output of the last layer.\n\nExample\n\njulia> fc = FullyConnected((1, 12, 24, 32), relu)\nChain(\n    layer_1 = Dense(1 => 12, relu),     # 24 parameters\n    layer_2 = Dense(12 => 24, relu),    # 312 parameters\n    layer_3 = Dense(24 => 32),          # 800 parameters\n)         # Total: 1_136 parameters,\n          #        plus 0 states, summarysize 48 bytes.\n\njulia> fc = FullyConnected(1, 10, relu; hidden_dims=20, num_layers=3)\nChain(\n    layer_1 = Dense(1 => 20, relu),     # 40 parameters\n    layer_2 = Dense(20 => 20, relu),    # 420 parameters\n    layer_3 = Dense(20 => 20, relu),    # 420 parameters\n    layer_4 = Dense(20 => 10),          # 210 parameters\n)         # Total: 1_090 parameters,\n          #        plus 0 states, summarysize 64 bytes.\n\n\n\n\n\n","category":"method"},{"location":"#Sophon.MultiscaleFourier-Union{Tuple{Int64}, Tuple{S}, Tuple{N2}, Tuple{N1}, Tuple{Int64, Tuple{Vararg{Int64, N1}}}, Tuple{Int64, Tuple{Vararg{Int64, N1}}, Function}} where {N1, N2, S}","page":"Home","title":"Sophon.MultiscaleFourier","text":"MultiscaleFourier(in_dims::Int, layer_dims::NTuple, activation=identity, modes::NTuple)\n\nMulti-scale Fourier Feature Net.\n\nx → FourierFeature → FullyConnected → y\n\nArguments\n\nin_dims: The number of input dimensions.\nlayer_dims: A tuple of hidden dimensions used to construct FullyConnected.\nactivation: The activation function used to construct FullyConnected.\nmodes: A tuple of modes used to construct FourierFeature.\n\nKeyword Arguments\n\nmodes: A tuple of modes used to construct FourierFeature.\n\nExamples\n\njulia> m = MultiscaleFourier(2, (30, 30, 1), sin; modes=(1 => 10, 10 => 10, 50 => 10))\nChain(\n    layer_1 = FourierFeature(2 => 60),\n    layer_2 = Dense(60 => 30, sin),     # 1_830 parameters\n    layer_3 = Dense(30 => 30, sin),     # 930 parameters\n    layer_4 = Dense(30 => 1),           # 31 parameters\n)         # Total: 2_791 parameters,\n          #        plus 60 states, summarysize 112 bytes.\n\nReferences\n\n[1] Wang, Sifan, Hanwen Wang, and Paris Perdikaris. “On the eigenvector bias of fourier feature networks: From regression to solving multi-scale pdes with physics-informed neural networks.” Computer Methods in Applied Mechanics and Engineering 384 (2021): 113938.\n\n\n\n\n\n","category":"method"},{"location":"#Sophon.Siren","page":"Home","title":"Sophon.Siren","text":"Siren(in_dims::Int, hidden_dim::Int, num_layers::Int; omega = 30f0)\nSiren(layer_dims::NTuple{N, T}; omega = 30f0) where {N, T <: Int}\n\nSinusoidal Representation Network.\n\nKeyword Arguments\n\nomega: The ω₀ used for the first layer.\n\nExamples\n\njulia> Siren(3; hidden_dims=20, num_layers=3)\nChain(\n    layer_1 = Sine(3 => 20),            # 80 parameters, plus 1\n    layer_2 = Sine(20 => 20),           # 420 parameters\n    layer_3 = Sine(20 => 20),           # 420 parameters\n)         # Total: 920 parameters,\n          #        plus 1 states, summarysize 292 bytes.\n\njulia> Siren(3, 1; hidden_dims=20, num_layers=3)\nChain(\n    layer_1 = Sine(3 => 20),            # 80 parameters, plus 1\n    layer_2 = Sine(20 => 20),           # 420 parameters\n    layer_3 = Sine(20 => 20),           # 420 parameters\n    layer_4 = Sine(20 => 1),            # 21 parameters\n)         # Total: 941 parameters,\n          #        plus 1 states, summarysize 388 bytes.\n\nReferences\n\n[1] Sitzmann, Vincent, et al. \"Implicit neural representations with periodic activation functions.\" Advances in Neural Information Processing Systems 33 (2020): 7462-7473.\n\n\n\n\n\n","category":"function"},{"location":"#Sophon.SirenAttention","page":"Home","title":"Sophon.SirenAttention","text":"SirenAttention(in_dims::Int, out_dims::Int, activation::Function=sin;\nhidden_dims::Int=512, num_layers::Int=6)\n\nx -> Sine -> PINNAttention\n\n\n\n\n\n","category":"function"},{"location":"#Sophon.gaussian","page":"Home","title":"Sophon.gaussian","text":"gaussian(x, a=0.2)\n\nThe Gaussian activation function.\n\ne^frac-05 x^2a^2\n\nReferences\n\n[1] Ramasinghe, Sameera, and Simon Lucey. \"Beyond periodicity: Towards a unifying framework for activations in coordinate-mlps.\" arXiv preprint arXiv:2111.15135 (2021).\n\n\n\n\n\n","category":"function"},{"location":"#Sophon.wu","page":"Home","title":"Sophon.wu","text":"wu(x,a=1)\n\nAn activation function I designed for use in coordinate-mlps.\n\nfracxleft(5 x^2-1right)left(1+x^2right)^4\n\n\n\n\n\n","category":"function"}]
}
