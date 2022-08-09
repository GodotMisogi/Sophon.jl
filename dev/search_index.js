var documenterSearchIndex = {"docs":
[{"location":"","page":"Home","title":"Home","text":"CurrentModule = Sophon","category":"page"},{"location":"#Sophon","page":"Home","title":"Sophon","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Documentation for Sophon.","category":"page"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [Sophon]","category":"page"},{"location":"#Sophon.FourierFeature","page":"Home","title":"Sophon.FourierFeature","text":"FourierFeature(in_dim::Int, modes::NTuple{N,Pair{S,T}}) where {N,S,T<:Int}\n\nFourier Feature Network.\n\nArguments\n\nin_dim: Input dimension.\nmodes: A tuple of pairs of std => out_dim, where std is the standard deviation of the Gaussian distribution, and out_dim is the output dimension.\n\nInputs\n\nx: An an AbstractArray with size(x, 1) == in_dim.\n\nReturns\n\nAn AbstractArray with size(y, 1) == sum(last(modes) * 2).\nThe states of the layers.\n\nStates\n\nmodes: Random frequencies.\n\nExamples\n\nFourierFeature(2, (1 => 3, 50 => 4))\n\nReferences\n\n[1] Tancik, Matthew, et al. “Fourier features let networks learn high frequency functions in low dimensional domains.” Advances in Neural Information Processing Systems 33 (2020): 7537-7547.\n\n\n\n\n\n","category":"type"},{"location":"#Sophon.PINNAttention","page":"Home","title":"Sophon.PINNAttention","text":"PINNAttention(H_net, U_net, V_net, fusion_layers)\nPINNAttention(in_dim::Int, hidden_dim::Int, num_layers::Int, activation)\n\nThe output dimesion of H_net and the input dimension of fusion_layers must be the same. For the second and the third constructor, Dense layers is used for H_net, U_net, and V_net.\n\n                 x → U_net → u                           u\n                               ↘                           ↘\nx → H_net →  h1 → fusionlayer1 → connection → fusionlayer2 → connection\n                               ↗                           ↗\n                 x → V_net → v                           v\n\nArguments\n\n- `H_net`: `AbstractExplicitLayer`\n- `U_net`: `AbstractExplicitLayer`\n- `V_net`: `AbstractExplicitLayer`\n- `in_dim`: The input dimension.\n- `hidden_dims`: The output dimension of `H_net`.\n- `fusion_layers`: `AbstractExplicitLayer` or a tuple of integeters. In the latter case,\n    fully connected layers are used.\n\nReferences\n\n[1] Wang, Sifan, Yujun Teng, and Paris Perdikaris. \"Understanding and mitigating gradient flow pathologies in physics-informed neural networks.\" SIAM Journal on Scientific Computing 43.5 (2021): A3055-A3081\n\n\n\n\n\n","category":"type"},{"location":"#Sophon.TriplewiseFusion","page":"Home","title":"Sophon.TriplewiseFusion","text":"TriplewiseFusion(connection, layers...)\n\n         u1                    u2\n            ↘                     ↘\nh1 → layer1 → connection → layer2 → connection\n            ↗                     ↗\n         v1                    v2\n\nArguments\n\nconnection: Takes 3 inputs and combines them\nlayers: AbstractExplicitLayers or a Chain.\n\nInputs\n\nLayer behaves differently based on input type:\n\nA tripe of (h, u, v), where u and v itself are tuples of length N, the layers is also a tuple of length N. The computation is as follows\n\nfor i in 1:N\n    h = connection(layers[i](h), u[i], v[i])\nend\n\nA triple of (h, u, v), where u and v are AbstractArrays.\n\nfor i in 1:N\n    h = connection(layers[i](h), u, v)\nend\n\nReturns\n\nSee Inputs section for how the return value is computed\nUpdated model state for all the contained layers\n\nParameters\n\nParameters of each layer wrapped in a NamedTuple with fields = layer_1, layer_2, ..., layer_N\n\nStates\n\nStates of each layer wrapped in a NamedTuple with fields = layer_1, layer_2, ..., layer_N\n\n\n\n\n\n","category":"type"},{"location":"#Sophon.FourierAttention-Tuple{Int64, Int64, Int64, Any}","page":"Home","title":"Sophon.FourierAttention","text":"FourierAttention(in_dim::Int, hidden_dim::Int, num_layers::Int, activation; modes)\n\nx → [FourierFeature(x); x] → PINNAttention\n\nArguments\n\nin_dim: The input dimension.\nhidden_dim: The hidden dimension of each hidden layer.\nnum_layers: The number of hidden layers.\n\nKeyword Arguments\n\n```\n\n\n\n\n\n","category":"method"},{"location":"#Sophon.FullyConnected-Union{Tuple{T}, Tuple{N}, Tuple{Int64, Tuple{Vararg{T, N}}, Function}} where {N, T<:Int64}","page":"Home","title":"Sophon.FullyConnected","text":"FullyConnected(in_dim, hidden_dims::NTuple{N, Int}, activation = identity)\nFullyConnected(in_dim, hidden_dims, num_layers, activation=identity)\n\nCreate fully connected layers. Note that the last layer is activated as well.\n\n\n\n\n\n","category":"method"},{"location":"#Sophon.MultiscaleFourier-Union{Tuple{Int64}, Tuple{S}, Tuple{N2}, Tuple{N1}, Tuple{Int64, Tuple{Vararg{Int64, N1}}}, Tuple{Int64, Tuple{Vararg{Int64, N1}}, Function}, Tuple{Int64, Tuple{Vararg{Int64, N1}}, Function, Tuple{Vararg{Pair{S, Int64}, N2}}}} where {N1, N2, S}","page":"Home","title":"Sophon.MultiscaleFourier","text":"MultiscaleFourier(in_dim::Int, out_dim::NTuple, activation=identity, modes::NTuple)\n\nMulti-scale Fourier Feature Net.\n\nx → FourierFeature → FullyConnected → y\n\nArguments\n\nin_dim: The number of input dimensions.\nout_dim: A tuple of output dimensions used to construct FullyConnected.\nactivation: The activation function used to construct FullyConnected.\nmodes: A tuple of modes used to construct FourierFeature.\n\nReferences\n\n[1] Wang, Sifan, Hanwen Wang, and Paris Perdikaris. “On the eigenvector bias of fourier feature networks: From regression to solving multi-scale pdes with physics-informed neural networks.” Computer Methods in Applied Mechanics and Engineering 384 (2021): 113938.\n\n\n\n\n\n","category":"method"}]
}
