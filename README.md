# Tiddly Static Server Reader and Exporter (TSSRE)
Publishing TiddlyWiki site to locations like `github.io` in such a way as to reduce the filesize of `index.html`.

## Project Folder
The project consists of two parts: `tssre` and `tssre-adapater`:
- `tssre`
  - Should be installed on local machine that is used for day to day use.
- `tssre-adapter`
  - Should be installed on remote static site as a plugin in `tiddlywiki.html`

## Setup
The following should only have to be done once:

1. Have a copy of TiddlyWiki that saves tiddlers into a folder with `.tid` like NodeJS version.
2. Install `tssre` plugin to your client-server tiddlywiki (should be using Node JS).
3. Build your NodeJs tiddlywiki via `tiddlywiki --build index`
4. Push the `tiddlers/` folder onto you static server repo (but not the `index.html`), say `yourhost.com/td/tiddlers`.
5. Manually download the HTML only version TiddlyWiki, call it `tiddlywiki.html`, and install `tssre-adaptor` into it.
6. Setup `tssre-adaptor` inside the `html`: `Settings > plugins > tssre-adaptor` and edit remote to point to `yourhost.com/td/tiddlers`
7. Upload `tiddlywiki.html` to where you want users to access the tiddlywiki: `yourhost.com/where_ever`

**Only steps 3 and 4 have to be repeated in order to update the tiddly wiki. You site should allow GET operations on the `tiddlers` folder.**

## How it Works
On any save or auto-save (this includes cli `--build` options), `tssre` will add all available tiddler
names into `$:/config/programmingincluded/tssre/remote-tiddlers`.

Later on, when one pushes their `tiddler` directory to a remote, the `tssre-adaptor` will use the tiddler
list to figure out what tiddlers are on the server to be able to fetch it.

As a result `tssre` is designed for small to medium sized wikis.
`tssre` should not be used for large wikis either it should be optimized (file an issue/request) or manually
update the `$:/config/programmingincluded/tssre/remote-tiddlers` tiddler.

## Other Misc
The following message hooks are defined for `tssre`:
- `tssre-export`
  - Exports every tiddler title on the wiki into remote-tiddlers file
- `tssre-test`
  - Reads `$:config/tssre/host` and tests to see if `tssre-adapator` will work pointed to that remote.

You can send these messages via buttons defined in tiddlers:
```html
<button message="tssre-export" />
```

## Q/A
**Wouldn't tiddlyweb and the likes do the same thing?**

In theory [tiddlyweb](https://github.com/Jermolene/TiddlyWiki5/tree/master/plugins/tiddlywiki/tiddlyweb) can perform similar
actions, however, there is a few modifications required in order to have things work out of the box.
The modifications require domain expertise of tiddlywiki and the associated plugins.
This repo is designed to be drag and drop, press button, setup and forget approach.

## Release Log
- v0.0.1
  - Initial release with support for `.tid` from server only