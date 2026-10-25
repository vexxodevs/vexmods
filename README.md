# VexxosMods website

Live site: https://vexxodevs.github.io/vexmods/
Admin panel: https://vexxodevs.github.io/vexmods/admin.html

## Editing the site
Use the **admin panel** to:
- replace a mod's download file (drag the new .jar onto the mod)
- edit names, descriptions, badges, icons and colours
- add, remove or reorder mods
- change the announcement bar, Discord/YouTube links and the seasonal theme
- choose where downloads are stored (**Files** tab): in this repo, or on Buzzheavier

Changes go live about a minute after you press **Publish**.

## Files
| File | What it is |
|---|---|
| `index.html`, `style.css`, `script.js` | The main site |
| `terms.html` | Terms & disclaimer page |
| `admin.html` | Admin panel |
| `site-data.json` | Mods + settings (edited by the admin panel) |
| `site-theme.js` | Theme setting (edited by the admin panel) |
| `downloads/` | Mod files, when the Files tab is set to "On this site" |
| `vexxo-uploader.py` | Uploader app — keeps your downloads alive on Buzzheavier |

## Buzzheavier

Downloads are hosted on buzzheavier.com. There are two ways to put a file there.

**From the admin panel.** Open **Files**, pick Buzzheavier, then drop a .jar on a mod
and press Publish. Press **Test** on the mod afterwards to check the link downloads.

**From the uploader app**, which can also do it on a schedule:

```
python vexxo-uploader.py
```

It opens a control panel in your browser. Give each mod its .jar once — the uploader
keeps a copy in `vexxo-files/` — then switch **Auto** on for that mod and turn the
**Schedule** on. Every 2 days it re-uploads the saved copy and puts the fresh link on
the site by itself. No need to pick the file again.

The schedule only runs while the uploader is open. Settings live in
`vexxo-uploader.json` next to the script; neither that file nor `vexxo-files/`
belongs in the repo.

Made by Jimmy & John Co
