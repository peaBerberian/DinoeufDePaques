# DinoeufDePâques

This is an (half-assed, incomplete and buggy) implementation of the "dinosaur
game"", intended to be easily embeddable in a page (by loading a single JS
file) with the purpose of being used as an easter egg in other programs.

For example, images (which are here in the `webp` format) are directly embedded
inside the browser-ready file (./build/dinoeufdepaques.js) as base64 strings.
Because of it's easter egg nature, the size of the bundled result should still
stay very small.

<video src="./example.mp4" />

The bundle is available in the `bundles` directory. Just include the code in
yours and the dino game will appear on top of your page.

I added as a personal challenge the idea of declaring variable and function name
in french - which isn't really a thing even in france. It makes development,
funnily enough, harder even for a french person.

For now the game is minimal, quickly done in a simple and broken way. It's also
not really fun yet, but it works and it fills its ambition of an easter egg, so
to me it's ready!
