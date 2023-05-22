[中文](README.md) | English

# logseq-plugin-days

Simple Stable Diffusion WebUI frontend for Logseq.

## Feature Highlights

- Simple txt2img, free from sliders, unleash your imagination.
- The basic parameters can be set in the plug-in configuration.
- You can regenerate again if you're not satisfied with the generated image.
- Insert the satisfied image into Logseq.
- Shortcut key for txt2img.

## Usage

https://github.com/sethyuan/logseq-plugin-drawit/assets/3410293/bbd739e9-e606-4c13-8282-d22800002989

## Preparations

1. You must ensure that you have access to your Stable Diffusion WebUI (Automatic1111), either locally or remotely. The address for local access is usually `http://127.0.0.1:7860`, for remote access you need to add the `---listen` startup argument, you can refer to your own integration package documentation for details. You can access the WebUI from other machines after enabling `--listen`, but an extra VPN setup may be required if you want to access your machine across networks.
1. Make sure the API function is enabled, also specified by the startup argument, `--api`.
1. Optionally turn on the startup argument `-enable-insecure-extension-access`, otherwise you can't install plugins in WebUI during remote access.

## Buy me a coffee

If you think the software I have developed is helpful to you and would like to give recognition and support, you may buy me a coffee using following link. Thank you for your support and attention.

<a href="https://www.buymeacoffee.com/sethyuan" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
