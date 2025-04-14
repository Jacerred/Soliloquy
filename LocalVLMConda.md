# Steps to get Qwen 3B vlm working on WSL
## Cuda install in wsl 2
https://developer.nvidia.com/cuda-11-8-0-download-archive?target_os=Linux&target_arch=x86_64&Distribution=WSL-Ubuntu&target_version=2.0&target_type=deb_network

## AT THE END RUN
`sudo apt-get install cuda-11-8`

instead of apt install cuda to get the right version


`conda deactivate`

`conda create -n cuda python==3.12.2`

`conda install -c conda-forge cudatoolkit`

`conda install -c conda-forge cudnn`

`conda install pytorch torchvision torchaudio pytorch-cuda=11.8 -c pytorch -c nvidia`

`pip install transformers`

`pip install qwen-vl-utils[decord]==0.0.8`

`pip install accelerate`

`pip install --no-build-isolation flash-attn==2.7.3`