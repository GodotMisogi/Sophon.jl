Base.getindex(c::Chain, i::Int) = c.layers[i]
Base.getindex(c::Chain{<:NamedTuple}, i::AbstractArray) =
  Chain(NamedTuple{keys(c)[i]}(Tuple(c.layers)[i]))
Base.length(c::Chain) = length(c.layers)

@inline GPUComponentArray64(nt::NamedTuple) = nt |> ComponentArray |> gpu .|> Float64

"""
    kaiming_uniform(rng::AbstractRNG, size...; gain = √2f0)

Return an `Array{Float32}` of the given `size` containing random numbers drawn from a
uniform distribution on the interval `[-x, x]`, where `x = gain * sqrt(3/fan_in)`.

# References

[1] He, Kaiming, et al. "Delving deep into rectifiers: Surpassing human-level performance on
imagenet classification." _Proceedings of the IEEE international conference on computer
vision_. 2015.
"""
function kaiming_uniform(rng::AbstractRNG, dims::Integer...; gain::Real=√2.0f0)
    bound = Float32(√3.0f0 * gain / sqrt(first(Lux._nfan(dims...))))
    return (rand(rng, Float32, dims...) .- 0.5f0) .* 2bound
end

function kaiming_uniform(nonlinearity::Union{Type{<:Function}, Function})
    return (rng::AbstractRNG, dims::Integer...) -> kaiming_uniform(rng, dims...;
                                                                   gain=calculate_gain(nonlinearity))
end

ChainRulesCore.@non_differentiable kaiming_uniform(::Any...)

"""
    kaiming_normal(rng::AbstractRNG, size...; gain = √2f0)

Return an `Array{Float32}` of the given `size` containing random numbers taken from a normal
distribution standard deviation `gain / sqrt(fan_in)`

# References

[1] He, Kaiming, et al. "Delving deep into rectifiers: Surpassing human-level performance on
imagenet classification." _Proceedings of the IEEE international conference on computer
vision_. 2015.
"""
function kaiming_normal(rng::AbstractRNG, dims::Integer...; gain::Real=√2.0f0)
    std = Float32(gain / sqrt(first(Lux._nfan(dims...))))
    return randn(rng, Float32, dims...) .* std
end

function kaiming_normal(nonlinearity::Union{Type{<:Function}, Function})
    return (rng::AbstractRNG, dims::Integer...) -> kaiming_normal(rng, dims...;
                                                                  gain=calculate_gain(nonlinearity))
end

ChainRulesCore.@non_differentiable kaiming_normal(::Any...)

@inline calculate_gain(::typeof(relu)) = √2.0f0
@inline calculate_gain(::typeof(tanh)) = Float32(5 / 3)
@inline calculate_gain(::typeof(sigmoid)) = 1
@inline calculate_gain(::typeof(identity)) = 1
@inline calculate_gain(::typeof(sin)) = √2.0f0 # Siren
@inline calculate_gain(::Type{<:Function}) = 1 # default
@inline calculate_gain(f::Function) = calculate_gain(typeof(f))