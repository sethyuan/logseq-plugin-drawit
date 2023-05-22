中文 | [English](README.en.md)

# logseq-plugin-drawit

为 Logseq 打造的 Stable Diffusion WebUI 的简易前端。

## 功能特色

- 简易文生图，不受参数困扰，释放你的想象力。
- 基础参数可在插件配置中设置。
- 生成的图如果不满意可选择再抽一次。
- 插入满意的图至 Logseq 中。
- 生图快捷键。

## 使用展示

https://github.com/sethyuan/logseq-plugin-drawit/assets/3410293/bbd739e9-e606-4c13-8282-d22800002989

## 前置准备

1. 你必须确保能够访问到自行部署的 Stable Diffusion WebUI (Automatic1111)，可以是本地访问，也可以是远程访问。本地访问的地址一般是 `http://127.0.0.1:7860`，想要远程访问需要添加 `--listen` 启动参数，具体方法可以参考各自的整合包。如果是使用秋叶大佬的整合包的话，这个设置是在`高级选项->网络设置`中。开启后就允许从其它机器访问了，但是跨网络的话还需要有其它配套软件加持才行，例如蒲公英。
1. 确保 API 功能是开启的，同样通过启动参数指定，`--api`。如果是使用秋叶大佬的整合包的话，这个设置默认应该是开启的。
1. 可选打开启动参数 `--enable-insecure-extension-access`，否则不能在远程访问时在 WebUI 中安装插件。

## Buy me a coffee

如果您认为我所开发的软件对您有所帮助，并且愿意给予肯定和支持，不妨扫描下方的二维码进行打赏。感谢您的支持与关注。

![wx](https://user-images.githubusercontent.com/3410293/236807219-cf21180a-e7f8-44a9-abde-86e1e6df999b.jpg) ![ap](https://user-images.githubusercontent.com/3410293/236807256-f79768a7-16e0-4cbf-a9f3-93f230feee30.jpg)
