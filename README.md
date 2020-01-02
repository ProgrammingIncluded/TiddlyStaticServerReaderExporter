# Tiddly Static Server Reader and Exporter (TSSRE)
Use Case: Publishing TiddlyWiki site to locations like `github.io` in such a way as to reduce the filesize of `index.html`. Generates a html tiddly wiki read-only file that only reads files pushed to static servers like `github.io` in order to reduce standalone html size.

This plugin reduces the need to know the underlying structure of TiddlyWiki by supporting the following:
- A control panel that can export a standalone tiddly wiki that can GET from a host's static folder.
- Removes the adapter abstraction like `tiddlyweb` so that TiddlyWiki `download` and `save` functionalities are not affected.
  - Provides an export button to get the generated html file.

**This plugin is different from Node JS and tiddlyweb plugins in that it does not attempt to modify the file adapters and more so to enable smaller wiki files on download mapped to a button.**

## Usage

1. Install the plugin to your local development wiki page.
2. Go to plugin control panel through `Settings > Plugins > TSSRE`.
3. Setup appropriate values for host and then press the `export` button.
4. Push the newly generated `static_server_index.html` to your static content deliver site like `github.io`.
5. Make sure that your `.tid` files that you wish to use are in your specified host path (e.g. `yourhost.com/tiddlers/*.tid`)

Make sure that your folder containing `.tid` files contains all `$__*` files in order for TiddlyWiki
to get the necessary files to run properly.

## Q/A
**Wouldn't tiddlyweb and the likes do the same thing?**

In theory [tiddlyweb](https://github.com/Jermolene/TiddlyWiki5/tree/master/plugins/tiddlywiki/tiddlyweb) can perform similar
actions, however, there is a few modifications required in order to have things work out of the box.
The modifications require domain expertise of tiddlywiki and the associated plugins.
This repo is designed to be drag and drop, press button, setup and forget approach.

## Release Log
- v0.0.1
  - Initial release with support for `.tid` from server only